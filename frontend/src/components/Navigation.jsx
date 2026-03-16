import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Phone, UtensilsCrossed, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { path: '/',      label: 'Home'        },
  { path: '/menu',  label: 'Menu'        },
  { path: '/track', label: 'Track Order' },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
 const { itemCount, setCartOpen } = useCart();
  const isActive = path => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background:     'rgba(13,8,5,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom:   '1px solid rgba(255,255,255,0.07)',
        fontFamily:     "'Lato',sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <div className="font-corm text-xl font-bold text-white leading-none">Faith &amp; Grace</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: '#ff9a3c' }}>Catering</div>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ path, label }) => (
              <Link key={path} to={path}
                className="relative text-sm font-black tracking-wider uppercase transition-colors"
                style={{ color: isActive(path) ? '#ff9a3c' : '#a8927e' }}
                onMouseEnter={e => !isActive(path) && (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => !isActive(path) && (e.currentTarget.style.color = '#a8927e')}
              >
                {label}
                {isActive(path) && (
                  <motion.div layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg,#c0392b,#e67e22)' }} />
                )}
              </Link>
            ))}

            <a href="tel:862-212-9328"
              className="flex items-center gap-2 text-sm font-black tracking-wide transition-colors"
              style={{ color: '#a8927e' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a8927e')}>
              <Phone size={14} /> 862-212-9328
            </a>

            {/* Cart badge */}
          <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl transition-all hover:bg-white/5"
              style={{ color: '#a8927e' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a8927e')}>
              <ShoppingBag size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/track" className="p-2 rounded-xl" style={{ color: '#a8927e' }}>
              <Package size={20} />
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl" style={{ color: '#a8927e' }}>
              <ShoppingBag size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-xl transition-colors" style={{ color: '#a8927e' }}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="px-4 py-5 flex flex-col gap-2">
              {NAV_LINKS.map(({ path, label }) => (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-black tracking-wider uppercase transition-all"
                  style={isActive(path)
                    ? { background: 'rgba(192,57,43,0.15)', color: '#ff9a3c', border: '1px solid rgba(192,57,43,0.3)' }
                    : { color: '#a8927e', border: '1px solid transparent' }}>
                  {label}
                </Link>
              ))}
              <a href="tel:862-212-9328"
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-black"
                style={{ color: '#a8927e', border: '1px solid transparent' }}>
                <Phone size={14} /> 862-212-9328
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;