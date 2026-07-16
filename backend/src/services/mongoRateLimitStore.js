import crypto from 'crypto';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const COLLECTION_NAME = 'rate_limit_counters';
const EXPIRY_INDEX_NAME = 'rate_limit_expiry';

let expiryIndexPromise = null;

const getCollection = () => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB must be connected before using the rate-limit store');
  }

  return mongoose.connection.db.collection(COLLECTION_NAME);
};

const ensureExpiryIndex = async (collection) => {
  if (!expiryIndexPromise) {
    expiryIndexPromise = collection.createIndex(
      { resetAt: 1 },
      { expireAfterSeconds: 0, name: EXPIRY_INDEX_NAME }
    ).catch((error) => {
      // Expiry is cleanup only; the atomic update below resets elapsed windows.
      // Keep enforcement working if a restricted database user cannot create
      // indexes, and surface the cleanup issue through operational logs.
      logger.warn('Unable to create rate-limit TTL index', {
        error: error.message,
      });
      return null;
    });
  }

  await expiryIndexPromise;
};

const unwrapDocument = (result) => result?.value ?? result;

/**
 * express-rate-limit store backed by the application's existing MongoDB.
 * Counters are shared by every Vercel function instance and expire through a
 * MongoDB TTL index. Raw IP addresses, emails, and user IDs are never stored.
 */
export class MongoRateLimitStore {
  constructor({ prefix = 'rate-limit' } = {}) {
    this.prefix = prefix;
    this.localKeys = false;
    this.windowMs = 60 * 1000;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  buildStorageKey(key) {
    const digest = crypto
      .createHash('sha256')
      .update(String(key))
      .digest('hex');

    return `${this.prefix}:${digest}`;
  }

  async increment(key) {
    const collection = getCollection();
    await ensureExpiryIndex(collection);

    const now = new Date();
    const nextResetAt = new Date(now.getTime() + this.windowMs);
    const storageKey = this.buildStorageKey(key);

    const update = [
      {
        $set: {
          totalHits: {
            $cond: [
              { $gt: ['$resetAt', now] },
              { $add: [{ $ifNull: ['$totalHits', 0] }, 1] },
              1,
            ],
          },
          resetAt: {
            $cond: [
              { $gt: ['$resetAt', now] },
              '$resetAt',
              nextResetAt,
            ],
          },
        },
      },
    ];

    let result;
    try {
      result = await collection.findOneAndUpdate(
        { _id: storageKey },
        update,
        { upsert: true, returnDocument: 'after' }
      );
    } catch (error) {
      // Two first requests for the same key can race on an upsert. The losing
      // request retries as a normal update, preserving an accurate hit count.
      if (error?.code !== 11000) throw error;

      result = await collection.findOneAndUpdate(
        { _id: storageKey },
        update,
        { returnDocument: 'after' }
      );
    }

    const counter = unwrapDocument(result);
    if (!counter) {
      throw new Error('MongoDB did not return the updated rate-limit counter');
    }

    return {
      totalHits: counter.totalHits,
      resetTime: counter.resetAt,
    };
  }

  async decrement(key) {
    try {
      const collection = getCollection();
      await collection.updateOne(
        {
          _id: this.buildStorageKey(key),
          totalHits: { $gt: 0 },
        },
        { $inc: { totalHits: -1 } }
      );
    } catch (error) {
      // express-rate-limit performs this after the response has finished and
      // cannot apply passOnStoreError here. Keep it best-effort to prevent an
      // unhandled rejection from affecting a serverless invocation.
      logger.error('Unable to decrement rate-limit counter', {
        error: error.message,
        prefix: this.prefix,
      });
    }
  }

  async resetKey(key) {
    const collection = getCollection();
    await collection.deleteOne({ _id: this.buildStorageKey(key) });
  }

  async get(key) {
    const collection = getCollection();
    const counter = await collection.findOne({
      _id: this.buildStorageKey(key),
      resetAt: { $gt: new Date() },
    });

    if (!counter) return undefined;

    return {
      totalHits: counter.totalHits,
      resetTime: counter.resetAt,
    };
  }
}

export default MongoRateLimitStore;
