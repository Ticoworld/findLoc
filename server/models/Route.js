import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  fromNodeId: { type: String, required: true },
  toNodeId: { type: String, required: true },
  preferenceHash: { type: String },
  pathNodeIds: { type: [String], required: true },
  totalDistanceMeters: { type: Number, required: true },
  totalDurationMin: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Route', RouteSchema);
