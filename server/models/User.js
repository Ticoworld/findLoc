import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  // Student registration number (optional for staff/visitors), unique when provided
  regNumber: { type: String, unique: true, sparse: true, index: true },
  // Email verification
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  // Password reset
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
