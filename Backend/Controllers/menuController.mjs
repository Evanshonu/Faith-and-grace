import MenuItem from '../Models/MenuItem.mjs';

const getMenu = async (req, res) => {
  // Disable caching so Cloudflare/browsers always get fresh menu data
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  const items = await MenuItem.find().sort({ createdAt: 1 });
  res.json(items);
};

const addMenuItem = async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
};

const updateMenuItem = async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  if (!updated)
    return res.status(404).json({ error: 'Menu item not found' });
  res.json(updated);
};

const deleteMenuItem = async (req, res) => {
  const deleted = await MenuItem.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ error: 'Menu item not found' });
  res.json({ message: 'Item deleted successfully' });
};

export { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };