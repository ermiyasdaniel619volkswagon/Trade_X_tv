
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  attendance: {
    reportedOnTime: { type: Boolean, default: false },
    uniformAndId: { type: Boolean, default: false },
    dailyPlanReviewed: { type: Boolean, default: false },
    equipmentInspected: { type: Boolean, default: false },
    cameraBatteriesChecked: { type: Boolean, default: false },
    memoryCardsChecked: { type: Boolean, default: false },
  },
  contentProduction: {
    videosRecorded: { type: Number, min: 0, default: 0 },
    interviewsRecorded: { type: Number, min: 0, default: 0 },
    brollClipsCaptured: { type: Number, min: 0, default: 0 },
    photosTaken: { type: Number, min: 0, default: 0 },
  },
  videoEditing: {
    videosEdited: { type: Number, min: 0, default: 0 },
    reelsProduced: { type: Number, min: 0, default: 0 },
    thumbnailsCreated: { type: Number, min: 0, default: 0 },
    subtitlesAdded: { type: Boolean, default: false },
  },
  tradexSupport: {
    studioProduction: { type: Boolean, default: false },
    presenterHost: { type: Boolean, default: false },
    livestreamPreparation: { type: Boolean, default: false },
    producerDirector: { type: Boolean, default: false },
  },
  equipmentManagement: {
    cameraCleaned: { type: Boolean, default: false },
    tripodsStored: { type: Boolean, default: false },
    microphonesChecked: { type: Boolean, default: false },
    filesBackedUp: { type: Boolean, default: false },
    studioOrganized: { type: Boolean, default: false },
  },
  learningAndImprovement: {
    attendedTraining: { type: Boolean, default: false },
    learnedNewSkill: { type: Boolean, default: false },
    reviewedFeedback: { type: Boolean, default: false },
  },
  eod: {
    accomplishments: {
      type: String,
      trim: true,
      maxlength: [2000, 'Accomplishments cannot exceed 2000 characters'],
    },
    challenges: {
      type: String,
      trim: true,
      maxlength: [2000, 'Challenges cannot exceed 2000 characters'],
    },
    supportRequired: {
      type: String,
      trim: true,
      maxlength: [2000, 'Support required cannot exceed 2000 characters'],
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'revision_required', 'rejected'],
    default: 'pending',
  },
  supervisorFeedback: {
    type: String,
    trim: true,
    maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  revisionCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true,
});

reportSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'approved' || this.status === 'revision_required') {
      this.reviewedAt = new Date();
    }
  }
  next();
});

reportSchema.index({ userId: 1 });
reportSchema.index({ date: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ userId: 1, date: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;