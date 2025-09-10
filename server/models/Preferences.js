import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  avoidDirt: { type: Boolean, default: false },
  preferLit: { type: Boolean, default: false },
  avoidStairs: { type: Boolean, default: false },
  speedMetersPerMin: { type: Number, default: 80 },
}, { timestamps: true });

export default mongoose.model('Preferences', PreferencesSchema);
