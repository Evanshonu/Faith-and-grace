import Order      from '../Models/Order.mjs';
import nodemailer from 'nodemailer';

const VALID_STATUSES = ['pending', 'preparing', 'ready', 'delivered'];

/* ─── WhatsApp Message Generator ──────────────────────────────────────────────────────────── */

const OWNER_WHATSAPP = "233501657205";

const buildWhatsAppMessage = (order) => {

  const itemsList = order.items
    .map(i => `• ${i.name} x${i.qty}`)
    .join('\n');

  const message = `
NEW ORDER RECEIVED

Order ID: ${order.orderId}
Customer: ${order.customer}
Phone: ${order.phone}

Items:
${itemsList}

Total: $${order.total.toFixed(2)}
`;

  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
};

/* ─── EMAIL ──────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderNotifications = async (order) => {
  const itemsList = order.items
    .map(i => `  • ${i.name} x${i.qty}  — $${(i.price * i.qty).toFixed(2)}`)
    .join('\n');

  const ownerText = [
    `NEW ORDER — ${order.orderId}`,
    ``,
    `Customer: ${order.customer}`,
    `Phone:    ${order.phone}`,
    `Email:    ${order.email || 'Not provided'}`,
    `Method:   ${order.method === 'pickup' ? 'Pickup' : 'Delivery — ' + order.address}`,
    ``,
    `Items:`,
    itemsList,
    ``,
    `Total: $${order.total.toFixed(2)}`,
    ``,
    `View orders: https://www.graceefaith.com/owner`,
  ].join('\n');

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#1a0f0a;color:#f5ede3;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#e67e22);padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;color:#fff;">Order Confirmed!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Faith &amp; Grace Catering</p>
      </div>
      <div style="padding:24px;">
        <p style="color:#a89080;">Hi ${order.customer},</p>
        <p style="color:#a89080;">Thank you for your order! We have received it and will start preparing it fresh.</p>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#6b5040;">Order ID</p>
          <p style="margin:0;font-size:18px;font-weight:bold;color:#ff9a3c;">${order.orderId}</p>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#6b5040;">Your Order</p>
          ${order.items.map(i => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#c8a88a;">${i.name} x${i.qty}</span>
              <span style="color:#fff;font-weight:bold;">$${(i.price * i.qty).toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding:12px 0 0;">
            <span style="color:#fff;font-weight:bold;">Total</span>
            <span style="color:#ff9a3c;font-weight:bold;font-size:18px;">$${order.total.toFixed(2)}</span>
          </div>
        </div>
        <p style="color:#a89080;font-size:14px;">Method: ${order.method === 'pickup' ? 'Pickup' : 'Delivery to ' + order.address}</p>
        <p style="color:#a89080;font-size:14px;">Questions? Call us: <a href="tel:862-212-9328" style="color:#ff9a3c;">862-212-9328</a></p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from:    `"Faith & Grace Orders" <${process.env.EMAIL_USER}>`,
      to:      process.env.OWNER_EMAIL || 'blackbird77ad@gmail.com',
      subject: `New Order ${order.orderId} — ${order.customer} ($${order.total.toFixed(2)})`,
      text:    ownerText,
    });

    if (order.email) {
      await transporter.sendMail({
        from:    `"Faith & Grace Catering" <${process.env.EMAIL_USER}>`,
        to:      order.email,
        subject: `Order Confirmed — ${order.orderId} | Faith & Grace`,
        html:    customerHtml,
      });
    }
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
};

/* ─── CONTROLLERS ────────────────────────────────────────────────────── */
const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

const createNewOrder = async (req, res) => {
  const {
    customer_name, customer_phone, customer_email,
    items, total, method, address, payment_intent_id,
  } = req.body;

  // Prevent duplicate orders if payment already exists
  if (payment_intent_id) {
    const existing = await Order.findOne({ paymentId: payment_intent_id });
    if (existing) return res.status(200).json(existing);
  }

  const order = await Order.create({
    customer:  customer_name,
    phone:     customer_phone,
    email:     customer_email        || '',
    items,
    total,
    method,
    address:   address               || '',
    paymentId: payment_intent_id     || null,
    stripePaymentIntent: payment_intent_id || 'manual',
  });
  // ------------------- SOCKET.IO EMIT -------------------
  const io = req.app.get("io");
  if (io) {
    io.emit("new-order", order); // send to all connected kitchen screens
  }

  // Send email notifications
  sendOrderNotifications(order);

  const whatsappURL = buildWhatsAppMessage(order);

res.status(201).json({
  ...order.toObject(),
  whatsappURL
});
};


const updateOrderStatus = async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status))
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });

  const updated = await Order.findByIdAndUpdate(
    id, { status }, { new: true }
  );

  if (!updated)
    return res.status(404).json({ error: 'Order not found' });

  res.json(updated);
};



const getOrderByPayment = async (req, res) => {
  const order = await Order.findOne({ paymentId: req.params.paymentIntentId });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

export { getOrders, createNewOrder, updateOrderStatus, getOrderByPayment };