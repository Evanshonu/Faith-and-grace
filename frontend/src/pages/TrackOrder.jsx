import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, ChefHat, Package, Truck, Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STATUS_STEPS = [
  { key: 'paid',      label: 'Order Received', icon: CheckCircle, color: '#a855f7' },
  { key: 'preparing', label: 'Preparing',       icon: ChefHat,     color: '#3b82f6' },
  { key: 'ready',     label: 'Ready',           icon: Package,     color: '#22c55e' },
  { key: 'delivered', label: 'Delivered',       icon: Truck,       color: '#ff9a3c' },
];

const StatusBar = ({ status }) => {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="flex items-center justify-between mt-4">
      {STATUS_STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: done ? step.color : 'rgba(255,255,255,0.06)',
                border: current ? `2px solid ${step.color}` : '2px solid transparent',
                boxShadow: current ? `0 0 10px ${step.color}66` : 'none',
              }}>
              <Icon size={14} className={done ? 'text-white' : 'text-stone-600'} />
            </div>
            <span className={`text-xs font-black text-center leading-tight ${done ? 'text-white' : 'text-stone-600'}`}
              style={{ fontSize: '10px' }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const TrackOrder = () => {
  const [identifier, setIdentifier] = useState('');
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);
  const [error,      setError]      = useState('');

  const handleSearch = async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const res  = await fetch(`${API_BASE}/api/orders/track/${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const pastOrders   = orders.filter(o => o.status === 'delivered');

  return (
    <div className="min-h-screen px-4 py-12"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
            <Search size={24} className="text-white" />
          </div>
          <h1 className="font-corm text-3xl font-bold text-white mb-2">Track Your Order</h1>
          <p className="text-stone-400 text-sm">Enter your phone number or email to see your orders</p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <input
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Phone number or email"
            className="flex-1 px-4 py-3.5 rounded-xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !identifier.trim()}
            className="px-6 py-3.5 rounded-xl font-black text-sm tracking-wide uppercase text-white transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}
          >
            {loading ? '...' : 'Track'}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        {/* Results */}
        <AnimatePresence>
          {searched && orders.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Clock size={32} className="text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 text-sm">No orders found for this phone or email.</p>
            </motion.div>
          )}

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h2 className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: '#ff9a3c' }}>
                Active Orders
              </h2>
              <div className="flex flex-col gap-4">
                {activeOrders.map(order => (
                  <div key={order._id} className="rounded-2xl p-5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-black text-white text-sm">{order.orderId}</div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} · {order.method === 'pickup' ? 'Pickup' : 'Delivery'}
                        </div>
                      </div>
                      <div className="font-black text-lg" style={{ color: '#ff9a3c' }}>${order.total.toFixed(2)}</div>
                    </div>
                    <div className="text-xs text-stone-500 mb-3">
                      {(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}
                    </div>
                    <StatusBar status={order.status} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xs font-black tracking-widest uppercase mb-3 text-stone-500">
                Past Orders
              </h2>
              <div className="flex flex-col gap-3">
                {pastOrders.map(order => (
                  <div key={order._id} className="rounded-2xl p-5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-black text-stone-400 text-sm">{order.orderId}</div>
                        <div className="text-xs text-stone-600 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} · {(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-black text-stone-400">${order.total.toFixed(2)}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-black"
                          style={{ background: 'rgba(255,154,60,0.1)', color: '#ff9a3c' }}>
                          Delivered ✓
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrder;