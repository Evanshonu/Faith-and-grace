import MenuItem from '../Models/MenuItem.mjs';

// FIX: All handlers now wrapped in try/catch so errors return JSON, not unhandled crashes

const getMenu = async (req, res) => {
  try {
    // Disable caching so Cloudflare/browsers always get fresh menu data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    const items = await MenuItem.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    // FIX: Admin uses PUT but route was PATCH — support both via this controller
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ error: 'Menu item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
