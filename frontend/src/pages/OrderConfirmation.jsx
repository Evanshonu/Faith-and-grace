import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ShoppingBag, Phone, Mail, ArrowRight } from 'lucide-react';

const API_BASE = 'https://faith-and-grace.onrender.com';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status,    setStatus]    = useState('loading');
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const paymentIntent  = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !redirectStatus) { navigate('/'); return; }

    setPaymentId(paymentIntent);

    if (redirectStatus === 'succeeded') {
      const saveAndClear = async () => {
        // Read cart and customerInfo BEFORE clearing anything
        const cart         = JSON.parse(localStorage.getItem('faith_grace_cart') || '[]');
        const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
        const subtotal     = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

        // Save order to MongoDB — await so we know it completed
        try {
          const res  = await fetch(`${API_BASE}/api/orders`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name:     customerInfo.name    || 'Guest',
              customer_phone:    customerInfo.phone   || 'N/A',
              customer_email:    customerInfo.email   || '',
              items:             cart.map(i => ({ name: i.name, qty: i.quantity || 1, price: i.price })),
              total:             parseFloat((subtotal * 1.08).toFixed(2)),
              method:            customerInfo.method  || 'pickup',
              address:           customerInfo.address || '',
              payment_intent_id: paymentIntent,
            }),
          });
          const data = await res.json();
          console.log('Order saved:', data._id);
        } catch (err) {
          console.error('Order save failed:', err);
        }

        // Save customer info for next time
        if (customerInfo.name) {
          localStorage.setItem('savedCustomer', JSON.stringify({
            name:  customerInfo.name,
            phone: customerInfo.phone || '',
            email: customerInfo.email || '',
          }));
        }

        // Clear cart + customerInfo AFTER order is saved
        clearCart();
        localStorage.removeItem('customerInfo');
        setStatus('success');
      };

      saveAndClear();

    } else if (redirectStatus === 'processing') {
      setStatus('processing');
    } else {
      setStatus('failed');
    }
  }, []); // eslint-disable-line

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>
        <div className="w-10 h-10 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Saving your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl p-10 text-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* SUCCESS */}
        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 180 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.35)' }}>
              <CheckCircle size={44} className="text-green-400" />
            </motion.div>
            <h1 className="font-corm text-4xl font-bold text-white mb-3">Order Confirmed!</h1>
            <p className="text-stone-400 mb-2">Your payment was successful.</p>
            {paymentId && (
              <p className="text-stone-600 text-xs mb-8 font-mono">
                Ref: {paymentId.slice(-12).toUpperCase()}
              </p>
            )}
            <div className="rounded-2xl p-5 mb-8 text-left"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <p className="text-sm text-stone-300 mb-3 font-black">What happens next?</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                We've received your order and will start preparing it fresh. You'll hear from us shortly to
                confirm pickup time or delivery details.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="tel:862-212-9328"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black tracking-wider"
                style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                <Phone size={15} /> Call Us: 862-212-9328
              </a>
              <button onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-stone-400 text-sm font-black tracking-wider hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                Back to Home <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}

        {/* PROCESSING */}
        {status === 'processing' && (
          <>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(230,126,34,0.12)', border: '2px solid rgba(230,126,34,0.35)' }}>
              <Clock size={44} style={{ color: '#e67e22' }} />
            </div>
            <h1 className="font-corm text-4xl font-bold text-white mb-3">Payment Processing</h1>
            <p className="text-stone-400 mb-8">
              Your payment is being processed. This can take a moment. We'll confirm your order shortly.
            </p>
            <a href="mailto:gnigriel@yahoo.com"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
              <Mail size={15} /> Contact Us if Unsure
            </a>
          </>
        )}

        {/* FAILED */}
        {status === 'failed' && (
          <>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)' }}>
              <XCircle size={44} className="text-red-400" />
            </div>
            <h1 className="font-corm text-4xl font-bold text-white mb-3">Payment Failed</h1>
            <p className="text-stone-400 mb-8">
              Something went wrong with your payment. Your card was not charged.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/checkout')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black tracking-wider"
                style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                <ShoppingBag size={15} /> Try Again
              </button>
              <a href="tel:862-212-9328"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-stone-400 text-sm font-black hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <Phone size={15} /> Call to Order Instead
              </a>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
};

export default OrderConfirmation;