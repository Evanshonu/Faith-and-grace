const validateMenuItem = (req, res, next) => {
  const { name, price, category, desc } = req.body;

  if (!name?.trim())
    return res.status(400).json({ error: 'Dish name is required' });
  if (!price || isNaN(price) || price <= 0)
    return res.status(400).json({ error: 'Valid price is required' });
  if (!category?.trim())
    return res.status(400).json({ error: 'Category is required' });
  if (!desc?.trim())
    return res.status(400).json({ error: 'Description is required' });

  next();
};

export { validateMenuItem };