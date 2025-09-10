import mongoose from 'mongoose';

const EdgeSchema = new mongoose.Schema({
  edgeId: { type: String, unique: true, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  bidirectional: { type: Boolean, default: true },
  weightMeters: { type: Number },
  attributes: { type: Object },
}, { timestamps: true });

export default mongoose.model('Edge', EdgeSchema);
