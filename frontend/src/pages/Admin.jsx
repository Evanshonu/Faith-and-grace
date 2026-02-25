import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, History,
  LogOut, Plus, Pencil, Trash2, X, Eye, EyeOff,
  ChevronDown, AlertTriangle, ToggleLeft, ToggleRight,
  Clock, CheckCircle, Truck, Package, Search,
  DollarSign, ImagePlus, Save,
} from 'lucide-react';

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const INITIAL_MENU = [
  { id: 1, name: 'Jollof Rice',     price: 12.99, category: 'Rice Dishes', desc: 'Smoky tomato-based rice slow-cooked with spices.',          image: '/images/jollof.jpg',           available: true },
  { id: 2, name: 'Waakye',          price: 11.99, category: 'Rice Dishes', desc: 'Hearty Ghanaian rice & beans with rich stew.',              image: '/images/waakye.jpg',           available: true },
  { id: 3, name: 'Fried Rice',      price: 12.99, category: 'Rice Dishes', desc: 'Golden stir-fried rice with vegetables and seasoning.',     image: '/images/friedrice.webp',       available: true },
  { id: 4, name: 'Fufu',            price: 13.99, category: 'Swallows',    desc: 'Pounded cassava & yam in fragrant light soup.',             image: '/images/fufu.jpg',             available: true },
  { id: 5, name: 'Banku & Tilapia', price: 15.99, category: 'Swallows',    desc: 'Fermented corn dumplings with grilled tilapia.',            image: '/images/bankuandtilapia.webp', available: true },
  { id: 6, name: 'Fried Fish',      price: 10.99, category: 'Proteins',    desc: 'Crispy golden fried fish with West African spices.',        image: '/images/friedfish.jpg',        available: true },
  { id: 7, name: 'Pepper Sauce',    price: 3.99,  category: 'Sides',       desc: 'Fiery house-made Ghanaian pepper sauce.',                   image: '/images/peppersauce.jpg',      available: true },
  { id: 8, name: 'Bofrot',          price: 6.99,  category: 'Sweets',      desc: 'Pillowy Ghanaian fried doughnuts dusted in sugar.',         image: '/images/bofrot.jpg',           available: true },
];

const INITIAL_ORDERS = [
  { id: 'ORD-001', customer: 'Abena Mensah',  phone: '973-555-0101', items: [{ name: 'Jollof Rice',      qty: 2, price: 12.99 }, { name: 'Fried Fish',    qty: 1, price: 10.99 }], total: 36.97, method: 'pickup',   status: 'preparing', time: '2 min ago',  date: '2025-01-15 12:30' },
  { id: 'ORD-002', customer: 'Kofi Asante',   phone: '973-555-0202', items: [{ name: 'Waakye',           qty: 1, price: 11.99 }, { name: 'Pepper Sauce', qty: 2, price:  3.99 }], total: 19.97, method: 'delivery', status: 'pending',   time: '5 min ago',  date: '2025-01-15 12:27' },
  { id: 'ORD-003', customer: 'Serena Mills',  phone: '862-555-0303', items: [{ name: 'Banku & Tilapia',  qty: 2, price: 15.99 }],                                                  total: 31.98, method: 'pickup',   status: 'ready',     time: '12 min ago', date: '2025-01-15 12:20' },
  { id: 'ORD-004', customer: 'Marcus Brown',  phone: '201-555-0404', items: [{ name: 'Fufu',             qty: 1, price: 13.99 }, { name: 'Bofrot',       qty: 2, price:  6.99 }], total: 27.97, method: 'delivery', status: 'delivered', time: '1 hr ago',   date: '2025-01-15 11:30' },
  { id: 'ORD-005', customer: 'Ama Owusu',     phone: '973-555-0505', items: [{ name: 'Jollof Rice',      qty: 3, price: 12.99 }, { name: 'Pepper Sauce', qty: 1, price:  3.99 }], total: 42.96, method: 'pickup',   status: 'delivered', time: '2 hrs ago',  date: '2025-01-15 10:30' },
  { id: 'ORD-006', customer: 'David Osei',    phone: '862-555-0606', items: [{ name: 'Fried Rice',       qty: 2, price: 12.99 }, { name: 'Fried Fish',   qty: 2, price: 10.99 }], total: 47.96, method: 'delivery', status: 'delivered', time: '3 hrs ago',  date: '2025-01-15 09:30' },
  { id: 'ORD-007', customer: 'Yaa Darko',     phone: '201-555-0707', items: [{ name: 'Waakye',           qty: 2, price: 11.99 }],                                                  total: 23.98, method: 'pickup',   status: 'delivered', time: 'Jan 14',     date: '2025-01-14 18:00' },
  { id: 'ORD-008', customer: 'Nana Boateng',  phone: '973-555-0808', items: [{ name: 'Banku & Tilapia',  qty: 1, price: 15.99 }, { name: 'Bofrot',       qty: 3, price:  6.99 }], total: 36.96, method: 'delivery', status: 'delivered', time: 'Jan 14',     date: '2025-01-14 14:00' },
];

const CATEGORIES = ['Rice Dishes', 'Swallows', 'Proteins', 'Sides', 'Sweets'];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: Clock       },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700 border-blue-200',        dot: 'bg-blue-500',   icon: Package     },
  ready:     { label: 'Ready',     color: 'bg-green-100 text-green-700 border-green-200',      dot: 'bg-green-500',  icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-stone-100 text-stone-500 border-stone-200',      dot: 'bg-stone-400',  icon: Truck       },
};

const NEXT_STATUS = { pending: 'preparing', preparing: 'ready', ready: 'delivered' };

const EMPTY_FORM = { name: '', price: '', category: 'Rice Dishes', desc: '', image: '', available: true };

const TABS = [
  { key: 'overview', label: 'Overview',      icon: LayoutDashboard },
  { key: 'menu',     label: 'Menu Items',    icon: UtensilsCrossed },
  { key: 'orders',   label: 'Active Orders', icon: ShoppingBag     },
  { key: 'past',     label: 'Past Orders',   icon: History         },
];

const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '2px solid rgba(255,255,255,0.1)',
  fontFamily: 'inherit',
};

const focusRed  = e => { e.target.style.borderColor = '#c0392b'; };
const blurReset = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────── */
const LoginPage = ({ onLogin }) => {
  const [pw, setPw]           = useState('');
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password: pw }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Invalid credentials');
      setLoading(false);
      return;
    }

    localStorage.setItem('fg_admin_token', data.token);
    onLogin();
  } catch {
    setError('Could not connect to server. Is the backend running?');
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#0d0805,#1a0f0a,#0d0805)', fontFamily: "'Lato',sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="font-corm text-3xl font-bold text-white mb-1">Faith & Grace</h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#ff9a3c' }}>Owner Dashboard</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <p className="text-stone-400 text-sm mb-6 text-center">Enter your password to access the dashboard</p>

          <div className="relative mb-4">
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              onFocus={focusRed}
              onBlur={blurReset}
              placeholder="Owner password"
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none pr-12 transition-all"
              style={{ ...inputStyle, border: error ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.1)' }}
            />
            <button
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs mb-4"
              >
                <AlertTriangle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleLogin}
            disabled={!pw || loading}
            className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: pw && !loading ? 'linear-gradient(135deg,#c0392b,#e67e22)' : '#444',
              boxShadow: pw ? '0 4px 20px rgba(192,57,43,0.4)' : 'none',
            }}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          This page is restricted to the restaurant owner only.
        </p>
      </motion.div>
    </div>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <div className="font-corm text-3xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-xs font-black tracking-widest uppercase text-stone-500">{label}</div>
    {sub && <div className="text-xs text-stone-600 mt-1">{sub}</div>}
  </motion.div>
);

/* ─── MENU FORM MODAL ────────────────────────────────────────────────── */
const MenuFormModal = ({ item, onSave, onClose }) => {
  const [form, setForm]       = useState(item ?? EMPTY_FORM);
  const [preview, setPreview] = useState(item?.image ?? '');

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.price && form.desc;

  const handleSave = () => {
    if (!valid) return;
    onSave({ ...form, price: parseFloat(form.price), id: item?.id ?? Date.now() });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#1a1210', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <div className="font-corm text-2xl font-bold text-white">{item ? 'Edit Dish' : 'Add New Dish'}</div>
            <div className="text-xs text-stone-500 mt-0.5">{item ? `Editing — ${item.name}` : 'Fill in the details below'}</div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-5 max-h-[70vh] overflow-y-auto hide-scroll">
          <div>
            <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Image URL</label>
            <div className="flex gap-3">
              <input
                value={form.image}
                onChange={e => { set('image', e.target.value); setPreview(e.target.value); }}
                onFocus={focusRed} onBlur={blurReset}
                placeholder="/images/dish.jpg or https://..."
                className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={inputStyle}
              />
              {preview
                ? <img src={preview} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" onError={() => setPreview('')} />
                : <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '2px dashed rgba(255,255,255,0.15)' }}>
                    <ImagePlus size={20} className="text-stone-600" />
                  </div>
              }
            </div>
          </div>

          <div>
            <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Dish Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              onFocus={focusRed} onBlur={blurReset}
              placeholder="e.g. Jollof Rice"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Price ($) *</label>
              <input
                type="number" step="0.01"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                onFocus={focusRed} onBlur={blurReset}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{ background: '#2a1a14', border: '2px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Description *</label>
            <textarea
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
              onFocus={focusRed} onBlur={blurReset}
              rows={3}
              placeholder="Describe the dish..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
              style={inputStyle}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <div className="text-sm font-black text-white">Available on Menu</div>
              <div className="text-xs text-stone-500 mt-0.5">Customers can see and order this dish</div>
            </div>
            <button onClick={() => set('available', !form.available)}>
              {form.available
                ? <ToggleRight size={36} style={{ color: '#22c55e' }} />
                : <ToggleLeft  size={36} className="text-stone-600" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-stone-400 font-black text-sm tracking-wider uppercase transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!valid}
            className="flex-1 py-3 rounded-xl text-white font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: valid ? 'linear-gradient(135deg,#c0392b,#e67e22)' : '#444',
              boxShadow: valid ? '0 4px 16px rgba(192,57,43,0.4)' : 'none',
            }}
          >
            <Save size={16} /> {item ? 'Save Changes' : 'Add Dish'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── DELETE CONFIRM ─────────────────────────────────────────────────── */
const DeleteConfirm = ({ item, onConfirm, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
  >
    <motion.div
      initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
      className="w-full max-w-sm rounded-2xl p-8 text-center"
      style={{ background: '#1a1210', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="font-corm text-2xl font-bold text-white mb-2">Delete Dish?</h3>
      <p className="text-stone-400 text-sm mb-6">
        Are you sure you want to remove <strong className="text-white">"{item.name}"</strong> from the menu? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl text-stone-400 font-black text-sm uppercase transition-all hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-white font-black text-sm uppercase bg-red-600 hover:bg-red-500 transition-all"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── ORDER CARD ─────────────────────────────────────────────────────── */
const OrderCard = ({ order, onStatusChange, isPast }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg        = STATUS_CONFIG[order.status];
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
          {order.customer[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm text-white">{order.customer}</span>
            <span className="text-xs text-stone-500">{order.id}</span>
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            {order.phone} · {order.method === 'pickup' ? '🏃 Pickup' : '🚗 Delivery'} · {order.time}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-black text-white">${order.total.toFixed(2)}</span>
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <ChevronDown size={16} className={`text-stone-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="mt-4 mb-4">
                <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-3">Items Ordered</div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-stone-300">{item.name} × {item.qty}</span>
                    <span className="font-black text-white">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-3">
                  <span className="font-black text-sm text-stone-400">Total</span>
                  <span className="font-black text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
              {!isPast && nextStatus && (
                <button
                  onClick={() => onStatusChange(order.id, nextStatus)}
                  className="w-full py-2.5 rounded-xl font-black text-xs tracking-widest uppercase text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 3px 14px rgba(192,57,43,0.35)' }}
                >
                  Mark as {STATUS_CONFIG[nextStatus].label} →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── MAIN DASHBOARD ─────────────────────────────────────────────────── */
const Dashboard = ({ onLogout }) => {
  const [tab,        setTab]        = useState('overview');
  const [menu,       setMenu]       = useState(INITIAL_MENU);
  const [orders,     setOrders]     = useState(INITIAL_ORDERS);
  const [editItem,   setEditItem]   = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('All');

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const pastOrders   = orders.filter(o => o.status === 'delivered');
  const totalRevenue = pastOrders.reduce((s, o) => s + o.total, 0);

  const filteredMenu = menu.filter(({ name, category }) =>
    (catFilter === 'All' || category === catFilter) &&
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = data => {
    setMenu(m => editItem
      ? m.map(i => i.id === data.id ? data : i)
      : [...m, data]
    );
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setMenu(m => m.filter(i => i.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const handleStatusChange = (id, newStatus) =>
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: newStatus } : ord));

  const openEdit  = item => { setEditItem(item); setShowForm(true); };
  const openAdd   = ()   => { setEditItem(null); setShowForm(true); };
  const closeForm = ()   => { setShowForm(false); setEditItem(null); };

  const tabCounts = { menu: menu.length, orders: activeOrders.length, past: pastOrders.length };

  const TAB_TITLES = { overview: 'Dashboard Overview', menu: 'Menu Management', orders: 'Active Orders', past: 'Past Orders' };

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0805', fontFamily: "'Lato',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 shrink-0 flex flex-col border-r"
        style={{ background: '#110a07', borderColor: 'rgba(255,255,255,0.07)' }}>

        <div className="px-6 py-7 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <div className="font-corm text-lg font-bold text-white leading-none">Faith & Grace</div>
              <div className="text-xs mt-0.5" style={{ color: '#ff9a3c' }}>Owner Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black tracking-wide transition-all text-left ${active ? 'text-white' : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'}`}
                style={active ? { background: 'linear-gradient(135deg,rgba(192,57,43,0.25),rgba(230,126,34,0.15))', border: '1px solid rgba(192,57,43,0.3)' } : {}}
              >
                <Icon size={18} style={active ? { color: '#ff9a3c' } : {}} />
                <span className="flex-1">{label}</span>
                {tabCounts[key] !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-black"
                    style={{ background: active ? 'rgba(255,154,60,0.2)' : 'rgba(255,255,255,0.07)', color: active ? '#ff9a3c' : '#666' }}>
                    {tabCounts[key]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto hide-scroll">

        <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 border-b"
          style={{ background: 'rgba(13,8,5,0.9)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="font-corm text-2xl font-bold text-white">{TAB_TITLES[tab]}</h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {tab === 'overview' && 'Your restaurant at a glance'}
              {tab === 'menu'     && `${menu.length} dishes · ${menu.filter(i => i.available).length} available`}
              {tab === 'orders'   && `${activeOrders.length} order${activeOrders.length !== 1 ? 's' : ''} need attention`}
              {tab === 'past'     && `${pastOrders.length} completed orders · $${totalRevenue.toFixed(2)} earned`}
            </p>
          </div>
          {tab === 'menu' && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm tracking-wider uppercase text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 16px rgba(192,57,43,0.4)' }}
            >
              <Plus size={17} /> Add Dish
            </button>
          )}
        </div>

        <div className="px-8 py-8">

          {/* ════ OVERVIEW ════ */}
          {tab === 'overview' && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={DollarSign}      label="Total Revenue"    value={`$${totalRevenue.toFixed(0)}`}  sub="From past orders"                              color="#22c55e" />
                <StatCard icon={ShoppingBag}     label="Active Orders"    value={activeOrders.length}            sub="Needs attention"                               color="#f59e0b" />
                <StatCard icon={UtensilsCrossed} label="Menu Items"       value={menu.length}                    sub={`${menu.filter(i => i.available).length} available`} color="#3b82f6" />
                <StatCard icon={History}         label="Orders Completed" value={pastOrders.length}              sub="All time"                                      color="#a855f7" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-corm text-xl font-bold text-white">Active Orders</h2>
                  <button onClick={() => setTab('orders')} className="text-xs font-black tracking-widest uppercase hover:text-white transition-colors" style={{ color: '#ff9a3c' }}>View all →</button>
                </div>
                {activeOrders.length === 0 ? (
                  <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
                    <p className="text-stone-400 text-sm">All caught up! No active orders right now.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeOrders.slice(0, 3).map(o => <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} isPast={false} />)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-corm text-xl font-bold text-white">Menu Availability</h2>
                  <button onClick={() => setTab('menu')} className="text-xs font-black tracking-widest uppercase hover:text-white transition-colors" style={{ color: '#ff9a3c' }}>Manage →</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {menu.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white truncate">{item.name}</div>
                        <div className={`text-xs mt-0.5 font-black ${item.available ? 'text-green-500' : 'text-red-400'}`}>
                          {item.available ? '● Available' : '● Unavailable'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ MENU CRUD ════ */}
          {tab === 'menu' && (
            <div>
              <div className="flex gap-3 mb-6 flex-wrap items-center">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className="pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none w-56"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['All', ...CATEGORIES].map(c => (
                    <button key={c} onClick={() => setCatFilter(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all ${catFilter === c ? 'text-white' : 'text-stone-500 hover:text-stone-300'}`}
                      style={catFilter === c
                        ? { background: 'rgba(192,57,43,0.25)', border: '1px solid rgba(192,57,43,0.4)' }
                        : { border: '1px solid rgba(255,255,255,0.07)' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredMenu.map(item => (
                    <motion.div key={item.id} layout
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="relative h-40 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,8,5,0.8),transparent 60%)' }} />
                        {!item.available && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
                            <span className="text-white text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full"
                              style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.5)' }}>
                              Unavailable
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                            <div className="font-corm text-xl font-bold text-white leading-tight">{item.name}</div>
                            <div className="text-xs text-stone-400">{item.category}</div>
                          </div>
                          <div className="font-black text-xl" style={{ color: '#ff9a3c' }}>${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-stone-500 text-xs leading-relaxed mb-4 line-clamp-2">{item.desc}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMenu(m => m.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                            className={`flex items-center gap-1.5 flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all justify-center ${item.available ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                            style={{ border: item.available ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)' }}>
                            {item.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {item.available ? 'On' : 'Off'}
                          </button>
                          <button onClick={() => openEdit(item)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase text-stone-400 hover:text-white transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Pencil size={13} /> Edit
                          </button>
                          <button onClick={() => setDeleteItem(item)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ════ ACTIVE ORDERS ════ */}
          {tab === 'orders' && (
            <div className="flex flex-col gap-3">
              {activeOrders.length === 0 ? (
                <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-corm text-2xl font-bold text-white mb-2">All Caught Up!</h3>
                  <p className="text-stone-500 text-sm">No active orders right now.</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 flex-wrap mb-2">
                    {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'delivered').map(([key, cfg]) => (
                      <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label} · {activeOrders.filter(o => o.status === key).length}
                      </div>
                    ))}
                  </div>
                  {activeOrders.map(o => <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} isPast={false} />)}
                </>
              )}
            </div>
          )}

          {/* ════ PAST ORDERS ════ */}
          {tab === 'past' && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: `$${totalRevenue.toFixed(2)}`,                                                    label: 'Total Earned',     color: 'text-green-400'    },
                  { value: pastOrders.length,                                                                 label: 'Orders Delivered', color: 'text-white'        },
                  { value: `$${pastOrders.length ? (totalRevenue / pastOrders.length).toFixed(2) : '0.00'}`, label: 'Avg. Order Value', color: 'text-[#ff9a3c]'   },
                ].map(({ value, label, color }) => (
                  <div key={label} className="rounded-2xl p-5 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className={`font-corm text-3xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs font-black tracking-widest uppercase text-stone-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {pastOrders.map(o => <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} isPast={true} />)}
              </div>
            </div>
          )}

        </div>
      </main>

      <AnimatePresence>
        {showForm   && <MenuFormModal item={editItem}   onSave={handleSave}      onClose={closeForm}                />}
        {deleteItem && <DeleteConfirm item={deleteItem} onConfirm={handleDelete} onClose={() => setDeleteItem(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ─── ROOT EXPORT ────────────────────────────────────────────────────── */
const Admin = () => {
  const [authed, setAuthed] = useState(
    () => {
      const token = localStorage.getItem('fg_admin_token');
      return !!token && token !== 'owner-authenticated';
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('fg_admin_token');
    setAuthed(false);
  };

  return authed
    ? <Dashboard onLogout={handleLogout} />
    : <LoginPage onLogin={() => setAuthed(true)} />;
};

export default Admin;