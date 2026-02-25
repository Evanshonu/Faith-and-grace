import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, X, Plus, Minus, Phone, Mail,
  CheckCircle, Users, Star, Trash2, CreditCard, Clock, PartyPopper,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const MENU_ITEMS = [
  { id: 1, name: 'Jollof Rice',     price: 12.99, desc: 'Smoky tomato-based rice slow-cooked with spices — the crown jewel of West African cuisine.',      image: '/images/jollof.jpg',           category: 'Rice Dishes', popular: true  },
  { id: 2, name: 'Waakye',          price: 11.99, desc: 'Hearty Ghanaian rice & beans cooked together, served with rich stew and garnishes.',                image: '/images/waakye.jpg',           category: 'Rice Dishes', popular: true  },
  { id: 3, name: 'Fried Rice',      price: 12.99, desc: 'Golden stir-fried rice tossed with vegetables, eggs, and aromatic seasoning.',                      image: '/images/friedrice.webp',       category: 'Rice Dishes', popular: false },
  { id: 4, name: 'Fufu',            price: 13.99, desc: 'Velvety pounded cassava & yam served in a fragrant, spicy light soup.',                             image: '/images/fufu.jpg',             category: 'Swallows',    popular: true  },
  { id: 5, name: 'Banku & Tilapia', price: 15.99, desc: 'Fermented corn & cassava dumplings served with a perfectly grilled whole tilapia.',                 image: '/images/bankuandtilapia.webp', category: 'Swallows',    popular: true  },
  { id: 6, name: 'Fried Fish',      price: 10.99, desc: 'Crispy golden fried fish seasoned with West African spices — a timeless favourite.',                image: '/images/friedfish.jpg',        category: 'Proteins',    popular: false },
  { id: 7, name: 'Pepper Sauce',    price: 3.99,  desc: 'Fiery house-made Ghanaian pepper sauce — the perfect companion for any dish.',                      image: '/images/peppersauce.jpg',      category: 'Sides',       popular: false },
  { id: 8, name: 'Bofrot',          price: 6.99,  desc: 'Light, pillowy Ghanaian fried doughnuts dusted in sugar — dangerously addictive.',                  image: '/images/bofrot.jpg',           category: 'Sweets',      popular: true  },
];

const CATEGORIES = ['All', 'Rice Dishes', 'Swallows', 'Proteins', 'Sides', 'Sweets'];

const PARTY_PERKS = [
  'Feeds 20 to 200+ guests', 'Customisable menu selection',
  'Fresh prepared on the day', 'Setup & serving available',
  'Flexible pickup or delivery', 'Corporate & private events',
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const Menu = () => {
  const navigate = useNavigate();

  // Pull everything from CartContext — single source of truth
  const { cart, addToCart, removeFromCart, updateCartItem, total, itemCount } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [cartOpen,       setCartOpen]       = useState(false);
  const partyRef = useRef(null);

  const filtered = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === activeCategory);

  // Calculates new quantity and removes item if it hits zero
  const updateQty = (id, delta) => {
    const item   = cart.find(c => c.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) { removeFromCart(id); return; }
    updateCartItem(id, newQty);
  };

  // Saves customer info to localStorage so Checkout page can read it
  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-amber-50" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ── PAGE HEADER ── */}
      <div className="relative text-center py-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a0f0a,#3d1408,#1a0f0a)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{ backgroundImage: 'url("/images/jollof.jpg")' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} className="relative z-10">
          <span className="text-xs font-black tracking-[0.15em] uppercase block mb-3"
            style={{ color: '#ff9a3c' }}>Fresh & Authentic</span>
          <h1 className="font-corm font-bold leading-none mb-4"
            style={{ fontSize: 'clamp(3rem,7vw,5.5rem)', color: '#fff8f0', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Our Menu
          </h1>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'rgba(253,248,242,0.75)' }}>
            Order individual dishes or plan your next big event with us.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              className="px-7 py-3 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all"
              style={{ background: '#c0392b', border: '2px solid #c0392b' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#c0392b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.color = '#fff'; }}>
              Order Food
            </button>
            <button
              onClick={() => partyRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-7 py-3 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all hover:bg-white/10"
              style={{ border: '2px solid rgba(255,255,255,0.6)' }}>
              Party Catering
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="bg-white border-b border-amber-100 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto hide-scroll pb-0.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border-2 font-black text-xs tracking-widest uppercase whitespace-nowrap transition-all ${activeCategory === cat ? 'text-white' : 'text-amber-900 border-amber-200 bg-white hover:border-red-700 hover:text-red-700'}`}
              style={activeCategory === cat ? { background: '#c0392b', borderColor: '#c0392b' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU GRID ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <motion.div key={item.id} layout
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative">
                  {item.popular && (
                    <span className="absolute top-3 right-3 z-10 text-white text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full"
                      style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                      ⭐ Popular
                    </span>
                  )}
                  <div className="overflow-hidden relative h-48">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute bottom-0 inset-x-0 h-2/5"
                      style={{ background: 'linear-gradient(to top,rgba(26,15,10,0.4),transparent)' }} />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-corm text-xl font-bold leading-tight" style={{ color: '#1a0f0a' }}>{item.name}</h3>
                      <span className="font-black text-lg whitespace-nowrap text-red-700">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-stone-500 text-xs leading-relaxed flex-1">{item.desc}</p>
                    <span className="self-start text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                      {item.category}
                    </span>
                    {inCart ? (
                      <div className="flex items-center gap-3 mt-1">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all">
                          <Minus size={13} />
                        </button>
                        <span className="font-black text-base min-w-[20px] text-center" style={{ color: '#1a0f0a' }}>
                          {inCart.quantity}
                        </span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all">
                          <Plus size={13} />
                        </button>
                        <span className="ml-auto text-sm font-black text-red-700">
                          ${(inCart.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)}
                        className="w-full py-2.5 rounded-lg text-white font-black text-xs tracking-widest uppercase mt-1 transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 3px 14px rgba(192,57,43,0.35)' }}>
                        + Add to Order
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── PARTY CATERING ── */}
      <section ref={partyRef} className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a0f0a,#3d1408)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url("/images/bankuandtilapia.webp")' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(192,57,43,0.2),transparent 70%)' }} />
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)}>
            <span className="text-xs font-black tracking-[0.15em] uppercase block mb-3" style={{ color: '#ff9a3c' }}>Feeding a Crowd?</span>
            <h2 className="font-corm font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff8f0' }}>
              Party & Event<br /><span style={{ color: '#ff9a3c' }}>Catering</span>
            </h2>
            <p className="leading-relaxed mb-8 text-sm" style={{ color: 'rgba(253,248,242,0.75)' }}>
              From intimate family gatherings to large corporate events, we bring the warmth and bold flavours of West Africa to your celebration.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {PARTY_PERKS.map(perk => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle size={15} style={{ color: '#ff9a3c', flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: 'rgba(253,248,242,0.85)' }}>{perk}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href="mailto:gnigriel@yahoo.com"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all no-underline"
                style={{ background: '#c0392b', border: '2px solid #c0392b', boxShadow: '0 4px 20px rgba(192,57,43,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#c0392b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.color = '#fff'; }}>
                <Mail size={16} /> Email Us
              </a>
              <a href="tel:862-212-9328"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all hover:bg-white/10 no-underline"
                style={{ border: '2px solid rgba(255,255,255,0.6)' }}>
                <Phone size={16} /> Call Us
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <div className="rounded-2xl p-8"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                  <PartyPopper size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-corm text-xl font-bold" style={{ color: '#fff8f0' }}>Party Packages</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(253,248,242,0.5)' }}>Starting from $8/person</div>
                </div>
              </div>
              {[
                { label: 'Small Gathering', sub: 'Up to 30 guests', price: 'From $250',    icon: Users },
                { label: 'Medium Event',    sub: '30 – 80 guests',  price: 'From $600',    icon: Users },
                { label: 'Large Event',     sub: '80+ guests',      price: 'Custom Quote', icon: Star  },
              ].map(({ label, sub, price, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3">
                    <Icon size={17} style={{ color: '#ff9a3c', flexShrink: 0 }} />
                    <div>
                      <div className="font-black text-sm" style={{ color: '#fff8f0' }}>{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(253,248,242,0.5)' }}>{sub}</div>
                    </div>
                  </div>
                  <span className="font-black text-sm" style={{ color: '#ff9a3c' }}>{price}</span>
                </div>
              ))}
              <div className="mt-6 p-4 rounded-xl flex gap-3"
                style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.3)' }}>
                <Clock size={15} style={{ color: '#ff9a3c', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs leading-relaxed m-0" style={{ color: 'rgba(253,248,242,0.8)' }}>
                  Please contact us <strong style={{ color: '#ff9a3c' }}>at least 3 days in advance</strong> to confirm availability and plan your custom menu.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING CART BUTTON ── */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.8 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-full font-black text-sm tracking-widest uppercase text-white transition-all hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 6px 28px rgba(192,57,43,0.55)' }}>
            <ShoppingCart size={20} />
            <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            <span className="px-3 py-0.5 rounded-full text-xs" style={{ background: 'rgba(0,0,0,0.2)' }}>
              ${total.toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setCartOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">

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

              <div className="flex-1 overflow-y-auto hide-scroll px-6 py-2">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center py-4 border-b border-amber-50">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm" style={{ color: '#1a0f0a' }}>{item.name}</div>
                      <div className="text-xs text-red-700 font-black mt-0.5">${item.price.toFixed(2)} each</div>
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
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-700 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-black tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 20px rgba(192,57,43,0.4)' }}>
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Menu;