import Order from '../Models/Order.mjs';

const VALID_STATUSES = ['pending', 'preparing', 'ready', 'delivered'];

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNewOrder = async (req, res) => {
  try {
    const {
      customer_name, customer_phone, customer_email,
      items, total, method, address, payment_intent_id,
    } = req.body;

    const order = await Order.create({
      customer:  customer_name,
      phone:     customer_phone,
      email:     customer_email    || '',
      items,
      total,
      method,
      address:   address           || '',
      paymentId: payment_intent_id || null,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getOrders, getOrderById, createNewOrder, updateOrderStatus };