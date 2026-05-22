import 'dotenv/config';
import Order from '../Models/Order.mjs';
import PaymentLock from '../Models/PaymentLock.mjs';
import { Resend } from 'resend';
import { getOwnerEmails } from '../utils/ownerEmails.mjs';

const resend = new Resend(process.env.RESEND_API_KEY);

const VALID_STATUSES = ['paid', 'preparing', 'ready', 'delivered'];
const OWNER_PHONE_E164 = process.env.OWNER_PHONE || '18622129328';
const OWNER_PHONE_DISPLAY = process.env.OWNER_PHONE_DISPLAY || '+1 862-212-9328';
const FROM_EMAIL = 'Faith & Grace <onboarding@resend.dev>';
const OWNER_TEL_LINK = `tel:+${OWNER_PHONE_E164}`;
const PAYMENT_LOCK_WAIT_MS = 2500;
const PAYMENT_LOCK_POLL_MS = 250;
const PAYMENT_LOCK_STALE_MS = 30000;
const STATUS_EMAIL_SUBJECTS = {
  preparing: 'We are preparing your order',
  ready: 'Your order is ready',
  delivered: 'Your order has been delivered',
};

const buildWhatsAppMessage = (order) => {
  const itemsList = (order.items || [])
    .map(item => `- ${item.name} x${item.qty}`)
    .join('\n');

  const message =
    `NEW ORDER RECEIVED\n\n` +
    `Order ID: ${order.orderId}\n` +
    `Customer: ${order.customer}\n` +
    `Phone: ${order.phone}\n\n` +
    `Items:\n${itemsList}\n\n` +
    `Total: $${order.total.toFixed(2)}`;

  return `https://wa.me/${OWNER_PHONE_E164}?text=${encodeURIComponent(message)}`;
};

export const sendOrderNotifications = async (order) => {
  const ownerEmails = getOwnerEmails();
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
          ${(order.items || []).map(item => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#c8a88a;">${item.name} x${item.qty}</span>
              <span style="color:#fff;font-weight:bold;">$${(item.price * item.qty).toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding:12px 0 0;">
            <span style="color:#fff;font-weight:bold;">Total</span>
            <span style="color:#ff9a3c;font-weight:bold;font-size:18px;">$${order.total.toFixed(2)}</span>
          </div>
        </div>
        <p style="color:#a89080;font-size:14px;">Method: ${order.method === 'pickup' ? 'Pickup' : `Delivery to ${order.address}`}</p>
        <p style="color:#a89080;font-size:14px;">Questions? Call us: <a href="${OWNER_TEL_LINK}" style="color:#ff9a3c;">${OWNER_PHONE_DISPLAY}</a></p>
      </div>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#1a0f0a;color:#f5ede3;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#e67e22);padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#fff;">New Order Received!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${order.orderId}</p>
      </div>
      <div style="padding:24px;">
        <p style="color:#a89080;margin:0 0 16px;"><strong style="color:#fff;">${order.customer}</strong> just placed an order.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr><td style="color:#6b5040;padding:6px 0;font-size:13px;">Phone</td><td style="color:#fff;text-align:right;font-size:13px;">${order.phone}</td></tr>
          <tr><td style="color:#6b5040;padding:6px 0;font-size:13px;">Email</td><td style="color:#fff;text-align:right;font-size:13px;">${order.email || 'Not provided'}</td></tr>
          <tr><td style="color:#6b5040;padding:6px 0;font-size:13px;">Method</td><td style="color:#fff;text-align:right;font-size:13px;">${order.method === 'pickup' ? 'Pickup' : `Delivery - ${order.address}`}</td></tr>
          <tr><td style="color:#6b5040;padding:6px 0;font-size:13px;">Total</td><td style="color:#ff9a3c;text-align:right;font-size:16px;font-weight:bold;">$${order.total.toFixed(2)}</td></tr>
        </table>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:20px;">
          <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#6b5040;">Items Ordered</p>
          ${(order.items || []).map(item => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#c8a88a;">${item.name} x${item.qty}</span>
              <span style="color:#fff;font-weight:bold;">$${(item.price * item.qty).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <a href="https://www.graceefaith.com/owner"
           style="display:block;text-align:center;padding:14px;background:linear-gradient(135deg,#c0392b,#e67e22);color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;letter-spacing:0.05em;">
          View &amp; Manage Order ->
        </a>
      </div>
    </div>
  `;

  try {
    if (ownerEmails.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ownerEmails,
        subject: `New Order ${order.orderId} - ${order.customer} ($${order.total.toFixed(2)})`,
        html: ownerHtml,
      });
      console.log('Owner email sent');
    } else {
      console.warn('Owner email notification skipped: OWNER_EMAIL is not configured');
    }

    if (order.email) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: order.email,
        subject: `Order Confirmed - ${order.orderId} | Faith & Grace`,
        html: customerHtml,
      });
      console.log('Customer email sent');
    }
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
};

const sendCustomerStatusNotification = async (order, previousStatus) => {
  if (!order?.email || !order?.status || order.status === previousStatus) return;
  if (!STATUS_EMAIL_SUBJECTS[order.status]) return;

  const statusCopy = {
    preparing: {
      title: 'We are preparing your order',
      message: 'Your order is now being prepared fresh. We will let you know as soon as it is ready.',
    },
    ready: {
      title: order.method === 'pickup' ? 'Your order is ready for pickup' : 'Your order is out and ready',
      message: order.method === 'pickup'
        ? 'Your order is ready for pickup. Please head over when you are ready.'
        : 'Your order is ready and on the way soon. Thank you for your patience.',
    },
    delivered: {
      title: order.method === 'pickup' ? 'Your pickup order is complete' : 'Your order has been delivered',
      message: order.method === 'pickup'
        ? 'Your pickup order has been completed. Thank you for choosing Faith & Grace.'
        : 'Your order has been delivered. Thank you for choosing Faith & Grace.',
    },
  }[order.status];

  const statusHtml = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#1a0f0a;color:#f5ede3;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c0392b,#e67e22);padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;color:#fff;">${statusCopy.title}</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Faith &amp; Grace Catering</p>
      </div>
      <div style="padding:24px;">
        <p style="color:#a89080;">Hi ${order.customer},</p>
        <p style="color:#a89080;">${statusCopy.message}</p>
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#6b5040;">Order ID</p>
          <p style="margin:0;font-size:18px;font-weight:bold;color:#ff9a3c;">${order.orderId}</p>
        </div>
        <p style="color:#a89080;font-size:14px;">Status: <strong style="color:#fff;text-transform:capitalize;">${order.status}</strong></p>
        <p style="color:#a89080;font-size:14px;">Method: ${order.method === 'pickup' ? 'Pickup' : `Delivery to ${order.address}`}</p>
        <p style="color:#a89080;font-size:14px;">Questions? Call us: <a href="${OWNER_TEL_LINK}" style="color:#ff9a3c;">${OWNER_PHONE_DISPLAY}</a></p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `${STATUS_EMAIL_SUBJECTS[order.status]} - ${order.orderId} | Faith & Grace`,
      html: statusHtml,
    });
    console.log('Customer status email sent');
  } catch (err) {
    console.error('Customer status email failed:', err.message);
  }
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const findOrderByPaymentId = (paymentId) =>
  Order.findOne({ paymentId }).sort({ updatedAt: -1, createdAt: -1 });

const waitForOrderByPaymentId = async (paymentId, timeoutMs = PAYMENT_LOCK_WAIT_MS) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const order = await findOrderByPaymentId(paymentId);
    if (order) return order;
    await wait(PAYMENT_LOCK_POLL_MS);
  }

  return null;
};

const buildOrderPayload = ({
  customer_name,
  customer_phone,
  customer_email,
  items,
  total,
  method,
  address,
  payment_intent_id,
}) => ({
  customer: customer_name,
  phone: customer_phone,
  email: customer_email || '',
  items,
  total,
  method,
  address: address || '',
  paymentId: payment_intent_id || null,
  stripePaymentIntent: payment_intent_id || 'manual',
  status: 'paid',
});

const acquirePaymentLock = async (paymentId) => {
  try {
    await PaymentLock.create({ _id: paymentId });
    return true;
  } catch (err) {
    if (err?.code !== 11000) throw err;
    return false;
  }
};

const releaseStalePaymentLock = async (paymentId) => {
  const lock = await PaymentLock.findById(paymentId);

  if (!lock) return false;

  const isStale = Date.now() - new Date(lock.updatedAt).getTime() > PAYMENT_LOCK_STALE_MS;
  if (!isStale || lock.status === 'completed') return false;

  const result = await PaymentLock.deleteOne({
    _id: paymentId,
    status: 'processing',
    updatedAt: lock.updatedAt,
  });

  return result.deletedCount > 0;
};

export const createOrFindPaidOrder = async ({
  customer_name,
  customer_phone,
  customer_email,
  items,
  total,
  method,
  address,
  payment_intent_id,
}) => {
  if (!payment_intent_id) {
    const order = await Order.create(buildOrderPayload({
      customer_name,
      customer_phone,
      customer_email,
      items,
      total,
      method,
      address,
      payment_intent_id,
    }));

    return { order, created: true, pending: false };
  }

  const existingOrder = await findOrderByPaymentId(payment_intent_id);
  if (existingOrder) {
    return { order: existingOrder, created: false, pending: false };
  }

  let lockAcquired = await acquirePaymentLock(payment_intent_id);

  if (!lockAcquired) {
    const inFlightOrder = await waitForOrderByPaymentId(payment_intent_id);
    if (inFlightOrder) {
      return { order: inFlightOrder, created: false, pending: false };
    }

    const staleReleased = await releaseStalePaymentLock(payment_intent_id);
    if (staleReleased) {
      lockAcquired = await acquirePaymentLock(payment_intent_id);
    }
  }

  if (!lockAcquired) {
    return { order: null, created: false, pending: true };
  }

  try {
    const existingAfterLock = await findOrderByPaymentId(payment_intent_id);
    if (existingAfterLock) {
      await PaymentLock.findByIdAndUpdate(payment_intent_id, {
        status: 'completed',
        order: existingAfterLock._id,
      });

      return { order: existingAfterLock, created: false, pending: false };
    }

    const order = await Order.create(buildOrderPayload({
      customer_name,
      customer_phone,
      customer_email,
      items,
      total,
      method,
      address,
      payment_intent_id,
    }));

    await PaymentLock.findByIdAndUpdate(payment_intent_id, {
      status: 'completed',
      order: order._id,
    });

    return { order, created: true, pending: false };
  } catch (err) {
    await PaymentLock.findByIdAndDelete(payment_intent_id).catch(() => {});
    throw err;
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ updatedAt: -1, createdAt: -1 });

    const seenPaymentIds = new Set();
    const dedupedOrders = orders.filter(order => {
      if (!order.paymentId) return true;
      if (seenPaymentIds.has(order.paymentId)) return false;
      seenPaymentIds.add(order.paymentId);
      return true;
    });

    res.json(dedupedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNewOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      items,
      total,
      method,
      address,
      payment_intent_id,
    } = req.body;

    if (!customer_name || !customer_phone || !items || !total || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { order, created, pending } = await createOrFindPaidOrder({
      customer_name,
      customer_phone,
      customer_email,
      items,
      total,
      method,
      address,
      payment_intent_id,
    });

    if (pending) {
      return res.status(202).json({ pending: true });
    }

    if (!created) {
      return res.status(200).json(order);
    }

    const io = req.app.get('io');
    if (io) io.emit('new-order', order);

    sendOrderNotifications(order)
      .then(() => console.log('Notifications sent for order:', order.orderId))
      .catch(err => console.error('Notification failed:', err.message));

    const whatsappURL = buildWhatsAppMessage(order);
    res.status(201).json({ ...order.toObject(), whatsappURL });
  } catch (err) {
    console.error('Create order failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const existing = await Order.findById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const previousStatus = existing.status;
    existing.status = status;
    const updated = await existing.save();

    sendCustomerStatusNotification(updated, previousStatus)
      .catch(err => console.error('Status notification failed:', err.message));

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const trackOrders = async (req, res) => {
  try {
    const { identifier } = req.params;
    const orders = await Order.find({
      $or: [{ phone: identifier }, { email: identifier }],
    }).sort({ updatedAt: -1, createdAt: -1 });

    const seenPaymentIds = new Set();
    const dedupedOrders = orders.filter(order => {
      if (!order.paymentId) return true;
      if (seenPaymentIds.has(order.paymentId)) return false;
      seenPaymentIds.add(order.paymentId);
      return true;
    });

    res.json(dedupedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderByPayment = async (req, res) => {
  try {
    const order = await Order.findOne({ paymentId: req.params.paymentIntentId })
      .sort({ updatedAt: -1, createdAt: -1 });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
