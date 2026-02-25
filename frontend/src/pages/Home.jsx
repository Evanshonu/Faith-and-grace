import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Heart, Sparkles, Clock, Phone, Mail,
  ArrowRight, Star, ChevronRight, MapPin, CheckCircle, Flame,
} from 'lucide-react';

const HERO_IMAGES = [
  '/images/bankuandtilapia.webp',
  '/images/jollof.jpg',
  '/images/waakye.jpg',
];

const FEATURES = [
  { icon: Heart,       title: 'Made with Love',   description: 'Every dish crafted from authentic West African recipes passed down through generations.' },
  { icon: Sparkles,    title: 'Fresh & Hygienic', description: 'Prepared daily with the finest ingredients under strict hygiene standards.' },
  { icon: ShoppingBag, title: 'Great Value',       description: 'Restaurant-quality West African meals at prices that make your wallet smile.' },
  { icon: Clock,       title: 'On-Time Service',   description: 'Reliable pickup & delivery so your meal arrives hot and on schedule.' },
];

const MENU_PREVIEW = [
  { name: 'Jollof Rice',     desc: 'Smoky tomato-based rice, the soul of West Africa',      image: '/images/jollof.jpg',           badge: 'Fan Favourite' },
  { name: 'Waakye',          desc: 'Hearty Ghanaian rice & beans with rich stew',           image: '/images/waakye.jpg',           badge: 'Traditional'   },
  { name: 'Banku & Tilapia', desc: 'Fermented corn dumpling with grilled whole tilapia',    image: '/images/bankuandtilapia.webp', badge: "Chef's Pick"   },
  { name: 'Fufu',            desc: 'Velvety pounded cassava & yam in fragrant light soup',  image: '/images/fufu.jpg',             badge: 'Classic'       },
  { name: 'Fried Rice',      desc: 'Golden stir-fried rice with vegetables & seasoning',    image: '/images/friedrice.webp',       badge: 'Popular'       },
  { name: 'Bofrot',          desc: 'Light, pillowy Ghanaian fried doughnuts — addictive',   image: '/images/bofrot.jpg',           badge: 'Sweet Treat'   },
];

const STEPS = [
  { num: '01', title: 'Browse Our Menu',  desc: 'Explore our full selection of authentic Ghanaian & West African dishes.' },
  { num: '02', title: 'Place Your Order', desc: 'Call, email, or order online — we make it simple and hassle-free.' },
  { num: '03', title: 'We Prepare Fresh', desc: 'Your meal is prepared fresh to order with quality ingredients.' },
  { num: '04', title: 'Enjoy!',           desc: 'Pick up or receive delivery of your hot, delicious meal.' },
];

const TESTIMONIALS = [
  { name: 'Abena K.',  stars: 5, quote: 'The Waakye took me straight back to Accra! Absolutely authentic and generous portions.' },
  { name: 'Marcus T.', stars: 5, quote: "Best Jollof Rice I've had outside of Ghana. The smoky flavor is unmatched." },
  { name: 'Serena M.', stars: 5, quote: 'Ordered Banku & Tilapia for a family gathering — everyone went back for seconds!' },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const Home = () => {
  const heroRef = useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-cycle through 3 hero images every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Crossfading background images — AnimatePresence swaps on heroIndex change */}
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${HERO_IMAGES[heroIndex]})` }}
          />
        </AnimatePresence>

        {/* Dark overlays */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,8,5,0.72) 0%, rgba(26,15,10,0.45) 45%, rgba(15,8,5,0.78) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(192,57,43,0.18), transparent 70%)' }} />

        {/* Decorative rings */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[15%] right-[8%] w-72 h-72 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(230,126,34,0.35)' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[18%] right-[10.5%] w-56 h-56 rounded-full pointer-events-none"
          style={{ border: '1px dashed rgba(230,126,34,0.2)' }} />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6"
              style={{ background: 'linear-gradient(135deg,rgba(192,57,43,0.5),rgba(230,126,34,0.4))', border: '1px solid rgba(230,126,34,0.6)', color: '#ffd4a8' }}>
              ✦ Authentic West African Cuisine ✦
            </span>
          </motion.div>

          <motion.h1 className="font-corm font-bold leading-none mb-1"
            style={{ fontSize: 'clamp(3.5rem,10vw,8rem)', color: '#fff8f0', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9 }}>
            Faith &amp; Grace
          </motion.h1>

          <motion.h2 className="font-light tracking-[0.35em] uppercase mb-8"
            style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', color: '#ff9a3c', textShadow: '0 0 30px rgba(230,126,34,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            Catering
          </motion.h2>

          <motion.p className="text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light"
            style={{ color: '#f0e6d6', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
            From the smoky depths of Jollof Rice to the comforting warmth of Fufu —
            taste the very heart of Ghana, lovingly prepared for you.
          </motion.p>

          <motion.div className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
            <Link to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#c0392b', border: '2px solid #c0392b', boxShadow: '0 4px 24px rgba(192,57,43,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#c0392b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.color = '#fff'; }}>
              View Our Menu <ArrowRight size={18} />
            </Link>
            <a href="tel:862-212-9328"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid #fff', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#c0392b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}>
              <Phone size={18} /> Call to Order
            </a>
          </motion.div>

          <motion.div className="flex justify-center gap-12 mt-16 flex-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
            {[['9+', 'Menu Items'], ['100%', 'Fresh Daily'], ['★ 5.0', 'Customer Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-corm font-bold text-4xl"
                  style={{ color: '#ff9a3c', textShadow: '0 0 20px rgba(255,120,0,0.5)' }}>{val}</div>
                <div className="text-xs tracking-widest uppercase mt-1 font-semibold" style={{ color: '#e8d5be' }}>{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Slideshow indicator dots */}
          <div className="flex justify-center gap-2 mt-10">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === heroIndex ? '24px' : '8px',
                  height:     '8px',
                  background: i === heroIndex ? '#ff9a3c' : 'rgba(255,255,255,0.3)',
                }} />
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-7 h-11 rounded-full flex justify-center pt-2"
            style={{ border: '2px solid rgba(255,255,255,0.5)' }}>
            <motion.div className="w-1 h-2 rounded-full" style={{ background: 'rgba(255,154,60,0.9)' }}
              animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden py-3" style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
        <div className="flex gap-12 whitespace-nowrap w-max" style={{ animation: 'marquee 45s linear infinite' }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-white text-xs font-black tracking-widest uppercase">
              Jollof Rice &nbsp;✦&nbsp; Waakye &nbsp;✦&nbsp; Banku &amp; Tilapia &nbsp;✦&nbsp; Fufu &nbsp;✦&nbsp; Bofrot &nbsp;✦&nbsp; Fried Fish &nbsp;✦&nbsp; Fried Rice &nbsp;✦&nbsp; Pepper Sauce &nbsp;✦
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="py-24 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)} className="relative h-96 md:h-[480px]">
            <img src="/images/jollof.jpg" alt="Jollof Rice"
              className="absolute top-0 left-0 w-2/3 h-[65%] object-cover rounded-2xl shadow-2xl" />
            <img src="/images/waakye.jpg" alt="Waakye"
              className="absolute bottom-0 right-0 w-[58%] h-[58%] object-cover rounded-2xl shadow-2xl" />
            <div className="absolute bottom-[30%] -left-4 bg-white rounded-2xl p-4 shadow-xl z-10 min-w-[160px]">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f39c12" strokeWidth={0} />)}
              </div>
              <div className="text-sm font-black text-stone-900">100% Authentic</div>
              <div className="text-xs text-stone-400">Ghanaian recipes</div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <span className="text-xs font-black tracking-[0.15em] uppercase text-red-700 mb-3 block">Our Story</span>
            <h2 className="font-corm font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#1a0f0a' }}>
              A Taste of Ghana,<br /><span className="text-red-700">Right Here for You</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              At Faith &amp; Grace Catering, we believe food is more than sustenance — it's a bridge between cultures,
              a vessel for memory, and an expression of love.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              From the iconic one-pot Jollof to the street-food joy of Bofrot, our menu celebrates the bold,
              vibrant flavors of Ghana made fresh every single day.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                'Authentic Ghanaian & West African recipes',
                'Prepared fresh daily with quality ingredients',
                'Available for events, catering & daily orders',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-red-700 shrink-0" />
                  <span className="text-stone-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 20px rgba(192,57,43,0.4)' }}>
              Explore Full Menu <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#1a0f0a' }}>
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(192,57,43,0.15),transparent 70%)' }} />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(230,126,34,0.1),transparent 70%)' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-black tracking-[0.15em] uppercase mb-2 block" style={{ color: '#e67e22' }}>Why Choose Us</span>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-0.5" style={{ background: 'linear-gradient(90deg,transparent,#e67e22)' }} />
              <Flame size={20} style={{ color: '#e67e22' }} />
              <div className="w-16 h-0.5" style={{ background: 'linear-gradient(90deg,#e67e22,transparent)' }} />
            </div>
            <h2 className="font-corm font-bold" style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', color: '#fff8f0' }}>
              The Faith &amp; Grace Difference
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.1)}
                className="rounded-2xl p-10 text-center transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                whileHover={{ borderColor: 'rgba(192,57,43,0.4)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg,rgba(192,57,43,0.2),rgba(230,126,34,0.2))' }}>
                  <Icon size={28} style={{ color: '#e67e22' }} />
                </div>
                <h3 className="font-corm text-2xl font-bold mb-3" style={{ color: '#fff8f0' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,248,242,0.6)' }}>{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU PREVIEW ── */}
      <section className="py-24 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-xs font-black tracking-[0.15em] uppercase text-red-700 mb-3 block">Our Specialties</span>
            <h2 className="font-corm font-bold mb-4" style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', color: '#1a0f0a' }}>
              A Few of Our Favourites
            </h2>
            <p className="text-stone-600 text-lg max-w-xl mx-auto">
              Bold flavors, generous portions, made with every ounce of love West Africa has to offer.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENU_PREVIEW.map((dish, i) => (
              <motion.div key={dish.name} {...fadeUp(i * 0.08)}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden h-52">
                  <span className="absolute top-4 left-4 z-10 text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>{dish.badge}</span>
                  <img src={dish.image} alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top,rgba(26,15,10,0.5),transparent 50%)' }} />
                </div>
                <div className="p-5">
                  <h3 className="font-corm text-2xl font-bold mb-2" style={{ color: '#1a0f0a' }}>{dish.name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4">{dish.desc}</p>
                  <Link to="/menu"
                    className="inline-flex items-center gap-1 text-red-700 font-black text-xs tracking-widest uppercase hover:gap-3 transition-all">
                    Order Now <ChevronRight size={15} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="text-center mt-14">
            <p className="text-stone-500 mb-4">Plus Fried Fish, Pepper Sauce & more on our full menu</p>
            <Link to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 20px rgba(192,57,43,0.4)' }}>
              View Full Menu (9+ dishes) <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg,#fef3e2,#fdf8f2)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-black tracking-[0.15em] uppercase text-red-700 mb-3 block">Simple Process</span>
            <h2 className="font-corm font-bold" style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', color: '#1a0f0a' }}>
              How to Get Your Order
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} {...fadeUp(i * 0.1)}>
                <div className="font-corm font-bold leading-none mb-2 select-none"
                  style={{ fontSize: '5rem', WebkitTextFillColor: 'transparent', WebkitTextStroke: '2px rgba(192,57,43,0.2)' }}>
                  {step.num}
                </div>
                <div className="w-12 h-1 rounded mb-4" style={{ background: 'linear-gradient(90deg,#c0392b,#e67e22)' }} />
                <h3 className="font-corm text-2xl font-bold mb-3" style={{ color: '#1a0f0a' }}>{step.title}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#1a0f0a' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: 'url("/images/bankuandtilapia.webp")' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-xs font-black tracking-[0.15em] uppercase mb-3 block" style={{ color: '#e67e22' }}>What People Say</span>
            <h2 className="font-corm font-bold" style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', color: '#fff8f0' }}>
              Happy Customers
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, stars, quote }, i) => (
              <motion.div key={name} {...fadeUp(i * 0.12)} className="rounded-2xl p-8 relative"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(stars)].map((_, j) => <Star key={j} size={15} fill="#f39c12" strokeWidth={0} />)}
                </div>
                <div className="absolute top-5 right-6 font-serif text-6xl leading-none"
                  style={{ color: 'rgba(230,126,34,0.2)' }}>"</div>
                <p className="italic text-sm leading-relaxed mb-5" style={{ color: 'rgba(253,248,242,0.8)' }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>{name[0]}</div>
                  <span className="font-black text-sm" style={{ color: '#fff8f0' }}>{name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ── */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#c0392b,#8b1a10,#6b3a2a)' }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="font-corm font-bold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)' }}>
              Ready to Experience<br />Authentic Flavour?
            </h2>
            <p className="text-white/80 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              Place your order today — by phone, email, or browse our full menu online.
            </p>
            <div className="flex justify-center gap-4 flex-wrap mb-10">
              {[
                { icon: Phone, label: 'Call Us',  value: '862-212-9328',       href: 'tel:862-212-9328' },
                { icon: Mail,  label: 'Email Us', value: 'gnigriel@yahoo.com', href: 'mailto:gnigriel@yahoo.com' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}
                  className="flex items-center gap-4 rounded-2xl px-6 py-4 transition-all hover:-translate-y-1 no-underline"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/60 tracking-widest uppercase mb-0.5">{label}</div>
                    <div className="text-white font-black">{value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-lg font-black text-sm tracking-widest uppercase transition-all hover:-translate-y-1 hover:shadow-xl no-underline"
                style={{ color: '#c0392b' }}>
                Order Online <ArrowRight size={18} />
              </Link>
              <a href="#"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-widest uppercase text-white transition-all hover:bg-white/10 no-underline"
                style={{ border: '2px solid rgba(255,255,255,0.6)' }}>
                <MapPin size={18} /> Find Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
};

export default Home;