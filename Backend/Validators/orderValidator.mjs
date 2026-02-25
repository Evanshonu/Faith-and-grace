const validateOrder = (req, res, next) => {
  const { customer_name, customer_phone, items, total, method, address } = req.body;

  if (!customer_name?.trim())
    return res.status(400).json({ error: 'Customer name is required' });

  if (!customer_phone?.trim())
    return res.status(400).json({ error: 'Customer phone is required' });

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Order must have at least one item' });

  if (!total || isNaN(total) || Number(total) <= 0)
    return res.status(400).json({ error: 'Valid order total is required' });

  if (!['pickup', 'delivery'].includes(method))
    return res.status(400).json({ error: 'Method must be pickup or delivery' });

  if (method === 'delivery' && !address?.trim())
    return res.status(400).json({ error: 'Delivery address is required' });

  next();
};

export { validateOrder };