import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import express from 'express';
import { MemoryStore } from 'express-rate-limit';
import {
  actorKeyGenerator,
  authKeyGenerator,
  createRateLimiter,
  getClientIp,
} from '../src/middleware/rateLimiter.js';
import MongoRateLimitStore from '../src/services/mongoRateLimitStore.js';

const originalRateLimitEnabled = process.env.RATE_LIMIT_ENABLED;
const originalVercel = process.env.VERCEL;

afterEach(() => {
  if (originalRateLimitEnabled === undefined) {
    delete process.env.RATE_LIMIT_ENABLED;
  } else {
    process.env.RATE_LIMIT_ENABLED = originalRateLimitEnabled;
  }

  if (originalVercel === undefined) {
    delete process.env.VERCEL;
  } else {
    process.env.VERCEL = originalVercel;
  }
});

const startServer = async (middleware) => {
  const app = express();
  app.use(express.json());
  app.post('/limited', middleware, (req, res) => {
    res.status(200).json({ success: true });
  });

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });

  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}/limited`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
};

test('limits requests and returns the existing API error shape', async () => {
  process.env.RATE_LIMIT_ENABLED = 'true';
  const store = new MemoryStore();
  const limiter = createRateLimiter({
    prefix: 'test-enforcement',
    windowMs: 60_000,
    limit: 2,
    error: 'Test limit exceeded.',
    keyGenerator: () => 'same-client',
    store,
  });
  const server = await startServer(limiter);

  try {
    const first = await fetch(server.url, { method: 'POST' });
    const second = await fetch(server.url, { method: 'POST' });
    const blocked = await fetch(server.url, { method: 'POST' });
    const body = await blocked.json();

    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.equal(blocked.status, 429);
    assert.deepEqual(Object.keys(body).sort(), ['error', 'retryAfter', 'success']);
    assert.equal(body.success, false);
    assert.equal(body.error, 'Test limit exceeded.');
    assert.ok(body.retryAfter > 0 && body.retryAfter <= 60);
    assert.ok(blocked.headers.get('retry-after'));
    assert.ok(blocked.headers.get('ratelimit'));
  } finally {
    await server.close();
    store.shutdown();
  }
});

test('the environment switch disables limiting without changing routes', async () => {
  process.env.RATE_LIMIT_ENABLED = 'false';
  let increments = 0;
  const store = {
    localKeys: false,
    prefix: 'disabled-test',
    increment: async () => {
      increments += 1;
      return { totalHits: 1, resetTime: new Date(Date.now() + 60_000) };
    },
    decrement: async () => {},
    resetKey: async () => {},
  };
  const limiter = createRateLimiter({
    prefix: 'disabled-test',
    windowMs: 60_000,
    limit: 1,
    error: 'Should not be returned.',
    store,
  });
  const server = await startServer(limiter);

  try {
    const responses = await Promise.all([
      fetch(server.url, { method: 'POST' }),
      fetch(server.url, { method: 'POST' }),
      fetch(server.url, { method: 'POST' }),
    ]);

    assert.deepEqual(responses.map(({ status }) => status), [200, 200, 200]);
    assert.equal(increments, 0);
  } finally {
    await server.close();
  }
});

test('store failures fail open and do not take application routes offline', async () => {
  process.env.RATE_LIMIT_ENABLED = 'true';
  const store = {
    localKeys: false,
    prefix: 'failing-test',
    increment: async () => {
      throw new Error('Simulated counter-store outage');
    },
    decrement: async () => {},
    resetKey: async () => {},
  };
  const limiter = createRateLimiter({
    prefix: 'failing-test',
    windowMs: 60_000,
    limit: 1,
    error: 'Should not be returned.',
    store,
  });
  const server = await startServer(limiter);
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await fetch(server.url, { method: 'POST' });
    assert.equal(response.status, 200);
  } finally {
    console.error = originalConsoleError;
    await server.close();
  }
});

test('uses Vercel client IP headers and authenticated user keys correctly', () => {
  process.env.VERCEL = '1';
  const anonymousRequest = {
    headers: {
      'x-vercel-forwarded-for': '203.0.113.10',
      'x-forwarded-for': '198.51.100.22',
    },
    socket: { remoteAddress: '127.0.0.1' },
  };

  assert.equal(getClientIp(anonymousRequest), '203.0.113.10');
  assert.equal(actorKeyGenerator(anonymousRequest), 'ip:203.0.113.10');
  assert.equal(
    authKeyGenerator({ ...anonymousRequest, body: { email: ' User@Example.COM ' } }),
    'ip:203.0.113.10:email:user@example.com'
  );
  assert.equal(
    actorKeyGenerator({ ...anonymousRequest, userId: '507f1f77bcf86cd799439011' }),
    'user:507f1f77bcf86cd799439011'
  );

  delete process.env.VERCEL;
  assert.equal(
    getClientIp({
      ...anonymousRequest,
      ip: '127.0.0.1',
    }),
    '127.0.0.1'
  );
});

test('MongoDB counter keys do not store raw caller identifiers', () => {
  const store = new MongoRateLimitStore({ prefix: 'auth' });
  const rawKey = 'ip:203.0.113.10:email:user@example.com';
  const storageKey = store.buildStorageKey(rawKey);

  assert.match(storageKey, /^auth:[a-f0-9]{64}$/);
  assert.equal(storageKey, store.buildStorageKey(rawKey));
  assert.ok(!storageKey.includes('203.0.113.10'));
  assert.ok(!storageKey.includes('user@example.com'));
});
