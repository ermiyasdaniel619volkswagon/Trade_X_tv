
import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['camera', 'tripod', 'microphone', 'lighting', 'lens', 'monitor', 'accessory'],
    required: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  serialNumber: {
    type: String,
    trim: true,
    required: [true, 'Serial number is required'],
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance', 'retired'],
    default: 'available',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedDate: {
    type: Date,
    default: null,
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

equipmentSchema.index({ serialNumber: 1 }, { unique: true });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ assignedTo: 1 });
equipmentSchema.index({ type: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;