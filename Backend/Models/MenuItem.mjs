import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  label:    { type: String, required: true },  // e.g. "Small", "Medium", "Large"
  quantity: { type: Number, required: true },  // e.g. 250
  unit:     { type: String, required: true },  // e.g. "g", "kg", "ml", "L", "pc"
  price:    { type: Number, required: true },
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  price:     { type: Number, default: 0 },       // base price — used if no sizes
  sizes:     { type: [sizeSchema], default: [] }, // optional size variants
  category:  { type: String, required: true, trim: true },
  desc:      { type: String, required: true, trim: true },
  image:     { type: String, default: '' },
  available: { type: Boolean, default: true },
  imgFit:      { type: String, default: 'cover' },
  imgPosition: { type: String, default: 'center' },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;