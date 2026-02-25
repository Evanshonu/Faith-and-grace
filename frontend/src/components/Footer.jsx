import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, Phone, Mail, MapPin,
  Instagram, Facebook, Twitter,
} from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Home',   path: '/'     },
  { label: 'Menu',   path: '/menu' },
];

const SOCIAL = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook,  href: '#', label: 'Facebook'  },
  { icon: Twitter,   href: '#', label: 'Twitter'   },
];

const Footer = () => (
  <footer
    style={{
      background:   '#110a07',
      borderTop:    '1px solid rgba(255,255,255,0.07)',
      fontFamily:   "'Lato',sans-serif",
    }}
  >
    {/* Main footer body */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

        {/* ── BRAND ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}
            >
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <div className="font-corm text-xl font-bold text-white leading-none">
                Faith &amp; Grace
              </div>
              <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: '#ff9a3c' }}>
                Catering
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: '#7a5c48' }}>
            Authentic West African cuisine crafted with love, served with soul.
            From intimate gatherings to grand celebrations — we bring the flavours of Ghana to your table.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background:   'rgba(255,255,255,0.05)',
                  border:       '1px solid rgba(255,255,255,0.08)',
                  color:        '#7a5c48',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(192,57,43,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(192,57,43,0.4)';
                  e.currentTarget.style.color = '#ff9a3c';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#7a5c48';
                }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div>
          <div className="text-xs font-black tracking-widest uppercase mb-6" style={{ color: '#ff9a3c' }}>
            Quick Links
          </div>
          <div className="flex flex-col gap-3">
            {FOOTER_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="text-sm font-black tracking-wide w-fit transition-colors"
                style={{ color: '#7a5c48' }}
                onMouseEnter={e => (e.target.style.color = '#fff')}
                onMouseLeave={e => (e.target.style.color = '#7a5c48')}
              >
                {label}
              </Link>
            ))}
            <a
              href="#catering"
              className="text-sm font-black tracking-wide w-fit transition-colors"
              style={{ color: '#7a5c48' }}
              onMouseEnter={e => (e.target.style.color = '#fff')}
              onMouseLeave={e => (e.target.style.color = '#7a5c48')}
            >
              Catering Packages
            </a>
            <a
              href="#contact"
              className="text-sm font-black tracking-wide w-fit transition-colors"
              style={{ color: '#7a5c48' }}
              onMouseEnter={e => (e.target.style.color = '#fff')}
              onMouseLeave={e => (e.target.style.color = '#7a5c48')}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div>
          <div className="text-xs font-black tracking-widest uppercase mb-6" style={{ color: '#ff9a3c' }}>
            Get In Touch
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="tel:862-212-9328"
              className="flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Phone size={13} style={{ color: '#ff9a3c' }} />
              </div>
              <div>
                <div className="text-xs font-black tracking-widest uppercase mb-0.5" style={{ color: '#7a5c48' }}>Phone</div>
                <div className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                  862-212-9328
                </div>
              </div>
            </a>

            <a
              href="mailto:gnigriel@yahoo.com"
              className="flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Mail size={13} style={{ color: '#ff9a3c' }} />
              </div>
              <div>
                <div className="text-xs font-black tracking-widest uppercase mb-0.5" style={{ color: '#7a5c48' }}>Email</div>
                <div className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                  gnigriel@yahoo.com
                </div>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <MapPin size={13} style={{ color: '#ff9a3c' }} />
              </div>
              <div>
                <div className="text-xs font-black tracking-widest uppercase mb-0.5" style={{ color: '#7a5c48' }}>Location</div>
                <div className="text-sm font-black text-white">New Jersey, USA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── BOTTOM BAR ── */}
    <div
      className="border-t"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs" style={{ color: '#4a3428' }}>
          © {new Date().getFullYear()} Faith &amp; Grace Catering. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: '#4a3428' }}>
          Crafted with ❤️ for the love of West African food
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;