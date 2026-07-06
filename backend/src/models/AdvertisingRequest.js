

import mongoose from 'mongoose';

const advertisingRequestSchema = new mongoose.Schema({
  // =============================================
  // CUSTOMER REFERENCE
  // =============================================
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  
  // =============================================
  // COMPANY INFORMATION
  // =============================================
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  companyIndustry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
  },
  companyDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  contactPhoneCode: {
    type: String,
    default: '+251',
  },

  // =============================================
  // ✅ SOCIAL MEDIA FIELDS (NEW)
  // =============================================
  socialMedia: {
    facebook: { type: String, trim: true, default: '' },
    telegram: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    youtube: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    tiktok: { type: String, trim: true, default: '' },
  },

  // =============================================
  // ADVERTISING DETAILS
  // =============================================
  adType: {
    type: String,
    enum: ['tv_spot', 'radio_ad', 'digital_campaign', 'sponsorship', 'custom'],
    required: [true, 'Advertising type is required'],
  },
  packageType: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    default: 'standard',
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 week'],
    max: [52, 'Duration cannot exceed 52 weeks'],
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi_weekly', 'monthly'],
    default: 'daily',
  },

  // =============================================
  // TARGET AUDIENCE
  // =============================================
  targetAudience: {
    ageGroup: {
      type: String,
      enum: ['18-24', '25-34', '35-44', '45-54', '55+', 'all'],
      default: 'all',
    },
    location: {
      type: String,
      trim: true,
    },
    interests: [{
      type: String,
      trim: true,
    }],
  },

  // =============================================
  // BUDGET & PRICING
  // =============================================
  budgetRange: {
    min: {
      type: Number,
      min: 0,
      default: 0,
    },
    max: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  proposedPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  finalPrice: {
    type: Number,
    min: 0,
    default: 0,
  },

  // =============================================
  // AGREEMENT / CONTRACT
  // =============================================
  agreementAccepted: {
    type: Boolean,
    default: false,
  },
  agreementVersion: {
    type: String,
    default: '1.0',
  },
  digitalSignature: {
    signedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },

  // =============================================
  // STATUS TRACKING
  // =============================================
  status: {
    type: String,
    enum: ['draft', 'pending', 'reviewing', 'approved', 'rejected', 'production', 'completed', 'cancelled'],
    default: 'draft',
  },

  // =============================================
  // SUPERVISOR REVIEW
  // =============================================
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  supervisorNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
  },

  // =============================================
  // PAYMENT TRACKING
  // =============================================
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    trim: true,
  },
  amountPaid: {
    type: Number,
    min: 0,
    default: 0,
  },

  // =============================================
  // PRODUCTION DETAILS
  // =============================================
  productionStartDate: {
    type: Date,
    default: null,
  },
  productionEndDate: {
    type: Date,
    default: null,
  },
  assignedTeam: {
    type: String,
    trim: true,
  },

  // =============================================
  // ADDITIONAL INFO
  // =============================================
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
}, {
  timestamps: true,
});

// =============================================
// INDEXES
// =============================================
advertisingRequestSchema.index({ customerId: 1 });
advertisingRequestSchema.index({ status: 1 });
advertisingRequestSchema.index({ createdAt: -1 });
advertisingRequestSchema.index({ customerId: 1, status: 1 });

// =============================================
// STATIC METHODS
// =============================================
advertisingRequestSchema.statics.getCustomerRequests = function(customerId) {
  return this.find({ customerId })
    .sort({ createdAt: -1 });
};

advertisingRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: { $in: ['pending', 'reviewing'] } })
    .sort({ createdAt: 1 })
    .populate('customerId', 'email');
};

advertisingRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .populate('customerId', 'email');
};

// =============================================
// INSTANCE METHODS
// =============================================
advertisingRequestSchema.methods.submitForReview = function() {
  if (this.status !== 'draft') {
    throw new Error('Only draft requests can be submitted');
  }
  if (!this.agreementAccepted) {
    throw new Error('Agreement must be accepted before submission');
  }
  this.status = 'pending';
  return this.save();
};

advertisingRequestSchema.methods.approve = function(supervisorId, notes) {
  if (this.status !== 'pending' && this.status !== 'reviewing') {
    throw new Error('Only pending requests can be approved');
  }
  this.status = 'approved';
  this.reviewedBy = supervisorId;
  this.reviewedAt = new Date();
  if (notes) this.supervisorNotes = notes;
  return this.save();
};

advertisingRequestSchema.methods.reject = function(supervisorId, reason) {
  if (this.status !== 'pending' && this.status !== 'reviewing') {
    throw new Error('Only pending requests can be rejected');
  }
  this.status = 'rejected';
  this.reviewedBy = supervisorId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

advertisingRequestSchema.methods.startProduction = function() {
  if (this.status !== 'approved') {
    throw new Error('Only approved requests can go to production');
  }
  this.status = 'production';
  this.productionStartDate = new Date();
  return this.save();
};

advertisingRequestSchema.methods.complete = function() {
  if (this.status !== 'production') {
    throw new Error('Only production requests can be completed');
  }
  this.status = 'completed';
  this.productionEndDate = new Date();
  return this.save();
};

const AdvertisingRequest = mongoose.model('AdvertisingRequest', advertisingRequestSchema);

export default AdvertisingRequest;