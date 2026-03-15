import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShoppingBag, CheckCircle, AlertCircle, ChevronLeft, Truck, Package, UtensilsCrossed } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const stripeAppearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#e67e22', colorBackground: '#1e120c', colorText: '#f5ede3',
    colorTextPlaceholder: '#7a5c48', colorDanger: '#ef4444',
    fontFamily: "'Lato', sans-serif", borderRadius: '12px', spacingUnit: '4px',
  },
  rules: {
    '.Input':         { border: '2px solid rgba(255,255,255,0.08)', padding: '12px 16px', boxShadow: 'none' },
    '.Input:focus':   { border: '2px solid #e67e22', boxShadow: '0 0 0 3px rgba(230,126,34,0.15)' },
    '.Label':         { fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5c48', marginBottom: '8px' },
    '.Tab':           { border: '2px solid rgba(255,255,255,0.08)', boxShadow: 'none' },
    '.Tab--selected': { border: '2px solid #e67e22', boxShadow: '0 0 0 3px rgba(230,126,34,0.15)' },
    '.Error':         { color: '#f87171', fontSize: '13px' },
  },
};

/* ─── ORDER SUMMARY ─────────────────────────────────────────────────── */
const OrderSummary = ({ cartItems, customerInfo, subtotal }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
        <UtensilsCrossed size={18} className="text-white" />
      </div>
      <div>
        <div className="font-corm text-xl font-bold text-white leading-none">Faith &amp; Grace</div>
        <div className="text-xs mt-0.5" style={{ color: '#ff9a3c' }}>West African Cuisine</div>
      </div>
    </div>

    {customerInfo?.name && (
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-3">Order For</div>
        <div className="text-sm font-black text-white">{customerInfo.name}</div>
        {customerInfo.phone && <div className="text-xs text-stone-400 mt-0.5">{customerInfo.phone}</div>}
        <div className="flex items-center gap-2 mt-2">
          {customerInfo.method === 'delivery'
            ? <><Truck size={13} style={{ color: '#ff9a3c' }} /><span className="text-xs text-stone-400">Delivery{customerInfo.address ? ` · ${customerInfo.address}` : ''}</span></>
            : <><Package size={13} style={{ color: '#ff9a3c' }} /><span className="text-xs text-stone-400">Pickup</span></>}
        </div>
      </div>
    )}

    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 pt-4 pb-2"><div className="text-xs font-black tracking-widest uppercase text-stone-500">Your Order</div></div>
      <div className="px-5 pb-2">
        {cartItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: 'rgba(192,57,43,0.3)', border: '1px solid rgba(192,57,43,0.4)' }}>{item.quantity}</div>
              <span className="text-sm text-stone-300">{item.name}</span>
            </div>
            <span className="text-sm font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex justify-between text-xs text-stone-500 mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-stone-500 mb-3"><span>Tax (8%)</span><span>${(subtotal * 0.08).toFixed(2)}</span></div>
        <div className="flex justify-between items-center">
          <span className="font-black text-sm text-white">Total</span>
          <span className="font-corm text-2xl font-bold" style={{ color: '#ff9a3c' }}>${(subtotal * 1.08).toFixed(2)}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs text-stone-600"><Lock size={12} /><span>256-bit SSL · Powered by Stripe</span></div>
  </motion.div>
);

/* ─── CUSTOMER FORM ─────────────────────────────────────────────────── */
const CustomerForm = ({ onSubmit }) => {
  const saved = JSON.parse(localStorage.getItem('savedCustomer') || '{}');
  const [form, setForm] = useState({ name: saved.name || '', phone: saved.phone || '', email: saved.email || '', method: 'pickup', address: '' });
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.phone.trim() && (form.method === 'pickup' || form.address.trim());
  const iCls  = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
  const iSty  = { background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' };

  return (
    <form onSubmit={e => { e.preventDefault(); if (valid) onSubmit(form); }} className="flex flex-col gap-5">
      <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-1">Your Details</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Full Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" className={iCls} style={iSty} />
        </div>
        <div>
          <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Phone *</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Your phone number" className={iCls} style={iSty} />
        </div>
      </div>
      <div>
        <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Email (optional)</label>
        <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" className={iCls} style={iSty} />
      </div>
      <div>
        <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Order Method *</label>
        <div className="grid grid-cols-2 gap-3">
          {['pickup', 'delivery'].map(m => (
            <button key={m} type="button" onClick={() => set('method', m)}
              className="py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all"
              style={form.method === m ? { background: 'linear-gradient(135deg,#c0392b,#e67e22)', color: '#fff' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888' }}>
              {m === 'pickup' ? '🏃 Pickup' : '🚗 Delivery'}
            </button>
          ))}
        </div>
      </div>
      {form.method === 'delivery' && (
        <div>
          <label className="text-xs font-black tracking-widest uppercase text-stone-500 block mb-2">Delivery Address *</label>
          <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full delivery address" className={iCls} style={iSty} />
        </div>
      )}
      <button type="submit" disabled={!valid}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: valid ? 'linear-gradient(135deg,#c0392b,#e67e22)' : '#333', boxShadow: valid ? '0 6px 24px rgba(192,57,43,0.4)' : 'none' }}>
        Continue to Payment →
      </button>
    </form>
  );
};

/* ─── PAYMENT FORM ──────────────────────────────────────────────────── */
const PaymentForm = ({ amount, onSuccess }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [error,      setError]      = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-4">Payment Details</div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span className="text-sm text-red-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="submit" disabled={!stripe || processing}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        style={{ background: !processing ? 'linear-gradient(135deg,#c0392b,#e67e22)' : '#3a2a20', boxShadow: !processing ? '0 6px 24px rgba(192,57,43,0.45)' : 'none' }}>
        {processing
          ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
          : <><Lock size={16} />Pay ${amount.toFixed(2)}</>}
      </button>
    </form>
  );
};

/* ─── SUCCESS ───────────────────────────────────────────────────────── */
const SuccessState = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
    className="flex flex-col items-center justify-center py-12 text-center">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
      style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
      <CheckCircle size={36} className="text-green-400" />
    </motion.div>
    <h3 className="font-corm text-3xl font-bold text-white mb-2">Payment Successful!</h3>
    <p className="text-stone-400 text-sm mb-1">Saving your order...</p>
    <p className="text-stone-600 text-xs">Redirecting to order tracking...</p>
    <div className="mt-6 w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
      <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }}
        className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#c0392b,#e67e22)' }} />
    </div>
  </motion.div>
);

/* ─── MAIN CHECKOUT ─────────────────────────────────────────────────── */
const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [step,          setStep]          = useState('info');
  const [customerInfo,  setCustomerInfo]  = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret,  setClientSecret]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [initError,     setInitError]     = useState(null);
  const [success,       setSuccess]       = useState(false);

  const subtotal     = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const totalWithTax = parseFloat((subtotal * 1.08).toFixed(2));

  useEffect(() => {
    if (cart.length === 0 && step === 'info') navigate('/menu');
  }, []); // eslint-disable-line

  const handleInfoSubmit = async info => {
    setCustomerInfo(info);
    setStep('payment');
    setLoading(true);

    localStorage.setItem('customerInfo', JSON.stringify(info));
    localStorage.setItem('pendingOrderCart', JSON.stringify(
      cart.map(i => ({ name: i.name, qty: i.quantity, price: Number(i.price) }))
    ));
    localStorage.setItem('pendingOrderTotal', totalWithTax.toString());

    try {
      const configRes  = await fetch(`${API_BASE}/api/payments/config`);
      const configData = await configRes.json();
      if (!configData.publishableKey) throw new Error('No publishable key');
      setStripePromise(loadStripe(configData.publishableKey));

      const intentRes = await fetch(`${API_BASE}/api/payments/create-intent`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount:         totalWithTax,
          customer_name:  info.name,
          customer_email: info.email,
          customer_phone: info.phone,
          method:         info.method,
          address:        info.address || '',
          items:          cart.map(i => ({ name: i.name, qty: i.quantity, price: Number(i.price) })),
        }),
      });
      const intentData = await intentRes.json();
      if (!intentData.clientSecret) throw new Error(intentData.error || 'No client secret');
      setClientSecret(intentData.clientSecret);
    } catch (err) {
      setInitError(err.message || 'Unable to connect to payment server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async paymentIntentId => {
    setSuccess(true);

    try {
      await fetch(`${API_BASE}/api/orders`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name:     customerInfo.name,
          customer_phone:    customerInfo.phone,
          customer_email:    customerInfo.email || '',
          items:             cart.map(i => ({ name: i.name, qty: i.quantity, price: Number(i.price) })),
          total:             totalWithTax,
          method:            customerInfo.method  || 'pickup',
          address:           customerInfo.address || '',
          payment_intent_id: paymentIntentId,
        }),
      });
    } catch (err) {
      console.error('Order save failed:', err);
    }

    localStorage.setItem('savedCustomer', JSON.stringify({
      name: customerInfo.name, phone: customerInfo.phone || '', email: customerInfo.email || '',
    }));
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('pendingOrderCart');
    localStorage.removeItem('pendingOrderTotal');

    clearCart();

    setTimeout(() => {
      navigate(`/order-confirmation?payment_intent=${paymentIntentId}&redirect_status=succeeded`);
    }, 2800);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0d0805 0%,#1a0f0a 50%,#0d0805 100%)', fontFamily: "'Lato',sans-serif" }}>
      <div className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(13,8,5,0.8)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-black tracking-wide">
          <ChevronLeft size={16} /> Back to Menu
        </button>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Lock size={12} /><span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag size={20} style={{ color: '#ff9a3c' }} />
            <span className="text-xs font-black tracking-widest uppercase text-stone-500">Almost there</span>
          </div>
          <h1 className="font-corm text-4xl lg:text-5xl font-bold text-white">Complete Your Order</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <OrderSummary cartItems={cart} customerInfo={customerInfo} subtotal={subtotal} />
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3">
            <div className="rounded-3xl p-6 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>

              {step === 'info' && <CustomerForm onSubmit={handleInfoSubmit} />}

              {step === 'payment' && loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-10 h-10 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-stone-500 text-sm">Preparing secure checkout...</p>
                </div>
              )}

              {step === 'payment' && !loading && initError && (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <AlertCircle size={36} className="text-red-400" />
                  <p className="text-white font-black">Payment Unavailable</p>
                  <p className="text-stone-400 text-sm">{initError}</p>
                  <button onClick={() => { setInitError(null); setStep('info'); }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-black uppercase tracking-wider"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                    Try Again
                  </button>
                </div>
              )}

              {step === 'payment' && success && <SuccessState />}

              {step === 'payment' && !loading && !initError && !success && clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                  <PaymentForm amount={totalWithTax} onSuccess={handleSuccess} />
                </Elements>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;