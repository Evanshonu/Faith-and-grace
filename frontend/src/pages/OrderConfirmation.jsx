import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Phone, ArrowRight, Package, Truck, ChefHat } from 'lucide-react';

const API_BASE = 'https://faith-and-grace.onrender.com';

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Received', icon: CheckCircle, desc: 'We have your order'        },
  { key: 'preparing', label: 'Preparing',       icon: ChefHat,     desc: 'Kitchen is cooking'        },
  { key: 'ready',     label: 'Ready',           icon: Package,     desc: 'Ready for pickup/delivery' },
  { key: 'delivered', label: 'Delivered',       icon: Truck,       desc: 'Enjoy your meal!'          },
];

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status,    setStatus]    = useState('loading');
  const [order,     setOrder]     = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const paymentIntent  = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !redirectStatus) { navigate('/'); return; }
    setPaymentId(paymentIntent);

    if (redirectStatus === 'succeeded') {
      const init = async () => {
        // Step 1 — Try to find the order (Checkout may have already saved it)
        let foundOrder = null;
        try {
          const res = await fetch(`${API_BASE}/api/orders/by-payment/${paymentIntent}`);
          if (res.ok) foundOrder = await res.json();
        } catch {}

        // Step 2 — If not found, this was a 3D Secure redirect
        // Save the order now using data stored in localStorage before payment
        if (!foundOrder) {
          const customerInfo = JSON.parse(localStorage.getItem('customerInfo')    || '{}');
          const items        = JSON.parse(localStorage.getItem('pendingOrderCart') || '[]');
          const total        = parseFloat(localStorage.getItem('pendingOrderTotal') || '0');

          if (items.length > 0 && customerInfo.name) {
            try {
              const res  = await fetch(`${API_BASE}/api/orders`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customer_name:     customerInfo.name    || 'Guest',
                  customer_phone:    customerInfo.phone   || 'N/A',
                  customer_email:    customerInfo.email   || '',
                  items,
                  total,
                  method:            customerInfo.method  || 'pickup',
                  address:           customerInfo.address || '',
                  payment_intent_id: paymentIntent,
                }),
              });
              if (res.ok) foundOrder = await res.json();
            } catch (err) {
              console.error('Order save failed:', err);
            }
          }
        }

        // Step 3 — Save customer for next time, clean up all temp data
        const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
        if (customerInfo.name) {
          localStorage.setItem('savedCustomer', JSON.stringify({
            name: customerInfo.name, phone: customerInfo.phone || '', email: customerInfo.email || '',
          }));
        }
        localStorage.removeItem('customerInfo');
        localStorage.removeItem('pendingOrderCart');
        localStorage.removeItem('pendingOrderTotal');

        // Step 4 — Clear cart
        clearCart();

        if (foundOrder) setOrder(foundOrder);
        setStatus('success');
      };

      init();
    } else if (redirectStatus === 'processing') {
      setStatus('processing');
    } else {
      setStatus('failed');
    }
  }, []); // eslint-disable-line

  // Refresh order status every 15s so customer sees live updates
  useEffect(() => {
    if (!paymentId || status !== 'success') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/by-payment/${paymentId}`);
        if (res.ok) { const data = await res.json(); setOrder(data); }
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [paymentId, status]);

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order?.status);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>
        <div className="w-10 h-10 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Confirming your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>

      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg flex flex-col gap-5">

        {/* SUCCESS */}
        {status === 'success' && (
          <>
            {/* Header */}
            <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 180 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.35)' }}>
                <CheckCircle size={38} className="text-green-400" />
              </motion.div>
              <h1 className="font-corm text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-stone-400 text-sm">Your payment was successful.</p>
              {paymentId && <p className="text-stone-600 text-xs mt-2 font-mono">Ref: {paymentId.slice(-10).toUpperCase()}</p>}
            </div>

            {/* Order details */}
            {order && (
              <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-4">Order Details</div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Order ID</span>
                    <span className="text-white font-black">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Name</span>
                    <span className="text-white font-black">{order.customer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Method</span>
                    <span className="text-white font-black">{order.method === 'pickup' ? '🏃 Pickup' : '🚗 Delivery'}</span>
                  </div>
                  {order.address && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Address</span>
                      <span className="text-white font-black text-right max-w-xs">{order.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <span className="text-stone-400">Total Paid</span>
                    <span className="font-black text-lg" style={{ color: '#ff9a3c' }}>${(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live order status tracker */}
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs font-black tracking-widest uppercase text-stone-500">Live Order Status</div>
                <div className="text-xs text-stone-600">Updates every 15s</div>
              </div>
              <div className="flex flex-col gap-4">
                {STATUS_STEPS.map((step, idx) => {
                  const done    = currentStep >= idx;
                  const current = currentStep === idx;
                  const Icon    = step.icon;
                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: done ? (current ? 'linear-gradient(135deg,#c0392b,#e67e22)' : 'rgba(34,197,94,0.2)') : 'rgba(255,255,255,0.04)',
                          border: done ? (current ? 'none' : '2px solid rgba(34,197,94,0.4)') : '2px solid rgba(255,255,255,0.08)',
                        }}>
                        <Icon size={16} style={{ color: done ? (current ? '#fff' : '#22c55e') : '#333' }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black" style={{ color: done ? '#fff' : '#444' }}>{step.label}</div>
                        <div className="text-xs" style={{ color: done ? '#777' : '#333' }}>{step.desc}</div>
                      </div>
                      {current && (
                        <span className="text-xs font-black px-2 py-1 rounded-full shrink-0"
                          style={{ background: 'rgba(230,126,34,0.15)', color: '#ff9a3c', border: '1px solid rgba(230,126,34,0.3)' }}>
                          Now
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <a href="tel:862-212-9328"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black tracking-wider"
                style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 16px rgba(192,57,43,0.4)' }}>
                <Phone size={15} /> Call Us: 862-212-9328
              </a>
              <button onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-stone-400 text-sm font-black hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                Back to Home <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}

        {/* PROCESSING */}
        {status === 'processing' && (
          <div className="rounded-3xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(230,126,34,0.12)', border: '2px solid rgba(230,126,34,0.35)' }}>
              <Clock size={38} style={{ color: '#e67e22' }} />
            </div>
            <h1 className="font-corm text-3xl font-bold text-white mb-3">Payment Processing</h1>
            <p className="text-stone-400 mb-6 text-sm">Your bank is processing the payment. We'll confirm your order shortly.</p>
            <a href="tel:862-212-9328"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
              <Phone size={15} /> Call if Unsure: 862-212-9328
            </a>
          </div>
        )}

        {/* FAILED */}
        {status === 'failed' && (
          <div className="rounded-3xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)' }}>
              <XCircle size={38} className="text-red-400" />
            </div>
            <h1 className="font-corm text-3xl font-bold text-white mb-3">Payment Failed</h1>
            <p className="text-stone-400 mb-6 text-sm">Your card was not charged. Please try again.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/checkout')}
                className="py-3 rounded-xl text-white text-sm font-black"
                style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}>
                Try Again
              </button>
              <a href="tel:862-212-9328"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-stone-400 text-sm font-black hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <Phone size={15} /> Call to Order Instead
              </a>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default OrderConfirmation;