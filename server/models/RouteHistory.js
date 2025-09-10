import mongoose from 'mongoose';

const RouteHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  destination: { type: String },
  routeSummary: { type: Object }, // distance, duration, method
  path: { type: [Object] }, // optional full path
}, { timestamps: true });

export default mongoose.model('RouteHistory', RouteHistorySchema);
