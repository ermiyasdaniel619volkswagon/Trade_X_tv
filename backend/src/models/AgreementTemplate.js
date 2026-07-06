import mongoose from 'mongoose';

const agreementTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    trim: true,
    default: '1.0',
  },
  content: {
    type: String,
    required: [true, 'Template content is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

agreementTemplateSchema.index({ isActive: 1 });
agreementTemplateSchema.index({ isDefault: 1 });

agreementTemplateSchema.statics.getDefault = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

const AgreementTemplate = mongoose.model('AgreementTemplate', agreementTemplateSchema);

export default AgreementTemplate;