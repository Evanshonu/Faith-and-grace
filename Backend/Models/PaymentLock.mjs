import mongoose from 'mongoose';

const paymentLockSchema = new mongoose.Schema({
  _id: { type: String, required: true, trim: true },
  status: { type: String, enum: ['processing', 'completed'], default: 'processing' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
}, { timestamps: true });

export default mongoose.model('PaymentLock', paymentLockSchema);
