import mongoose from 'mongoose';

const ownerSettingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('OwnerSettings', ownerSettingsSchema);