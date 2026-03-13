import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  qty:   { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema({
  customer:  { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  email:     { type: String, default: '', trim: true },
  items:     { type: [orderItemSchema], required: true },
  total:     { type: Number, required: true, min: 0 },
  method:    { type: String, required: true, enum: ['pickup', 'delivery'] },
  address:   { type: String, default: '' },
  status:    { type: String, default: 'pending', enum: ['pending','paid','preparing','ready','completed'] },
  stripePaymentIntent: { type: String, required: true },
  paymentId: { type: String, default: null },
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const count = await mongoose.model('Order').countDocuments();
  this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
  next();
});

orderSchema.add({ orderId: { type: String } });

const Order = mongoose.model('Order', orderSchema);

export default Order;