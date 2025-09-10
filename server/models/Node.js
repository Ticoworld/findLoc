import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  nodeId: { type: String, unique: true, required: true },
  name: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: { type: String, default: 'waypoint' },
  metadata: { type: Object },
}, { timestamps: true });

export default mongoose.model('Node', NodeSchema);
