

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import validator from 'validator';

// const customerSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     lowercase: true,
//     trim: true,
//     unique: true,
//     validate: [validator.isEmail, 'Please provide a valid email'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Password must be at least 8 characters'],
//     select: false,
//   },
//   // ✅ Personal Info
//   firstName: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   lastName: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   phone: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   phoneCode: {
//     type: String,
//     default: '+251',
//   },
//   // ✅ Company Information (for auto-populating advertising requests)
//   companyName: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   companyIndustry: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   companyDescription: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   companyWebsite: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   // ✅ Social Media
//   socialMedia: {
//     facebook: { type: String, trim: true, default: '' },
//     telegram: { type: String, trim: true, default: '' },
//     linkedin: { type: String, trim: true, default: '' },
//     instagram: { type: String, trim: true, default: '' },
//     youtube: { type: String, trim: true, default: '' },
//     twitter: { type: String, trim: true, default: '' },
//     tiktok: { type: String, trim: true, default: '' },
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   lastLogin: {
//     type: Date,
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Hash password before saving
// customerSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
//     const salt = await bcrypt.genSalt(saltRounds);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// customerSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Indexes
// customerSchema.index({ email: 1 });
// customerSchema.index({ isActive: 1 });
// customerSchema.index({ createdAt: -1 });

// const Customer = mongoose.model('Customer', customerSchema);

// export default Customer;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  phoneCode: {
    type: String,
    default: '+251',
  },
  companyName: {
    type: String,
    trim: true,
    default: '',
  },
  companyIndustry: {
    type: String,
    trim: true,
    default: '',
  },
  companyDescription: {
    type: String,
    trim: true,
    default: '',
  },
  companyWebsite: {
    type: String,
    trim: true,
    default: '',
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
  
  // =============================================
  // ✅ GOOGLE AUTH FIELDS - ADDED
  // =============================================
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    index: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
customerSchema.index({ email: 1 });
customerSchema.index({ isActive: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ googleId: 1 }, { sparse: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;