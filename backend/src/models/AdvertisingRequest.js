
import mongoose from 'mongoose';

const advertisingRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyIndustry: {
      type: String,
      required: [true, 'Company industry is required'],
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
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
    adType: {
      type: String,
      enum: [
        'starter_visibility',
        'growth_partner',
        'strategic_sponsor',
        'business_documentary',
        'embassy_promotion',
        'livestream_launch',
        'studio_rental',
        'digital_ads'
      ],
      required: [true, 'Advertising service type is required'],
    },
    packageType: {
      type: String,
      default: 'standard',
    },
    duration: {
      type: Number,
      default: 1,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
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
      interests: [String],
    },
    budgetRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    socialMedia: {
      facebook: { type: String, trim: true, default: '' },
      telegram: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      tiktok: { type: String, trim: true, default: '' },
    },
    agreementAccepted: {
      type: Boolean,
      required: [true, 'You must accept the terms and agreements'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'revision_required', 'rejected', 'in_production', 'completed'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    supervisorNotes: {
      type: String,
      trim: true,
    },
    finalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

advertisingRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .populate('customerId', 'firstName lastName email');
};

const AdvertisingRequest = mongoose.model('AdvertisingRequest', advertisingRequestSchema);
export default AdvertisingRequest;