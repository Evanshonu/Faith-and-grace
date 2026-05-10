import mongoose from 'mongoose';
import Counter from './Counter.mjs';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  method: { type: String, required: true, enum: ['pickup', 'delivery'] },
  address: { type: String, default: '' },
  status: { type: String, default: 'paid', enum: ['paid', 'preparing', 'ready', 'delivered'] },
  stripePaymentIntent: { type: String, required: true },
  paymentId: { type: String, default: null },
}, { timestamps: true });

const COUNTER_KEY = 'orderId';

const getCurrentMaxOrderSequence = async () => {
  const [result] = await mongoose.model('Order').aggregate([
    {
      $match: {
        orderId: { $type: 'string', $regex: /^ORD-\d+$/ },
      },
    },
    {
      $project: {
        seq: {
          $convert: {
            input: { $arrayElemAt: [{ $split: ['$orderId', '-'] }, 1] },
            to: 'int',
            onError: 0,
            onNull: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        maxSeq: { $max: '$seq' },
      },
    },
  ]);

  return result?.maxSeq || 0;
};

// Auto-generate orderId using an atomic counter to avoid collisions.
orderSchema.pre('save', async function () {
  if (!this.isNew || this.orderId) return;

  const existingCounter = await Counter.findOne({ key: COUNTER_KEY }).lean();

  if (!existingCounter) {
    const maxSeq = await getCurrentMaxOrderSequence();
    await Counter.findOneAndUpdate(
      { key: COUNTER_KEY },
      { $setOnInsert: { key: COUNTER_KEY, seq: maxSeq } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const counter = await Counter.findOneAndUpdate(
    { key: COUNTER_KEY },
    { $inc: { seq: 1 } },
    { new: true }
  );

  this.orderId = `ORD-${String(counter.seq).padStart(3, '0')}`;
});

orderSchema.add({ orderId: { type: String } });

const Order = mongoose.model('Order', orderSchema);

export default Order;
