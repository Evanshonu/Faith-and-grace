import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart, cartOpen, setCartOpen,
    removeFromCart, updateCartItem, total, itemCount,
  } = useCart();

  const updateQty = (id, delta) => {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) { removeFromCart(id); return; }
    updateCartItem(id, newQty);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-amber-100">
              <div>
                <div className="font-corm text-2xl font-bold" style={{ color: '#1a0f0a' }}>Your Order</div>
                <div className="text-xs text-amber-700 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full border-2 border-amber-100 flex items-center justify-center hover:border-red-700 hover:bg-amber-50 transition-all">
                <X size={17} className="text-stone-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="text-4xl">🍽️</div>
                  <p className="text-stone-400 text-sm">Your cart is empty</p>
                  <button onClick={() => { setCartOpen(false); navigate('/menu'); }}
                    className="text-xs font-black uppercase tracking-widest text-red-700 underline">
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center py-4 border-b border-amber-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-stone-100"
                      onError={e => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm" style={{ color: '#1a0f0a' }}>{item.name}</div>
                      <div className="text-xs text-red-700 font-black mt-0.5">${Number(item.price).toFixed(2)} each</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center hover:bg-red-700 hover:text-white transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="font-black text-sm min-w-[16px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center hover:bg-red-700 hover:text-white transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-black text-sm" style={{ color: '#1a0f0a' }}>
                        ${(item.quantity * Number(item.price)).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-700 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-amber-100 bg-amber-50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-black">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-stone-500">Tax (8%)</span>
                  <span className="font-black">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-amber-200 mb-4">
                  <span className="font-black" style={{ color: '#1a0f0a' }}>Total</span>
                  <span className="font-black text-xl text-red-700">${(total * 1.08).toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-black tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 20px rgba(192,57,43,0.4)' }}>
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;