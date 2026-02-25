import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  price:     { type: Number, required: true, min: 0 },
  category:  { type: String, required: true, enum: ['Rice Dishes', 'Swallows', 'Proteins', 'Sides', 'Sweets'] },
  desc:      { type: String, required: true, trim: true },
  image:     { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;