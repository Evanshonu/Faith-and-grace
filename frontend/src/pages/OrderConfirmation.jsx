import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Phone, Package,
  Truck, ChefHat, LayoutDashboard, MessageCircle,
} from 'lucide-react';

const API_BASE          = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const OWNER_PHONE       = '233544930267';
const OWNER_PHONE_DISPLAY = '+233 54 493 0267';

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Received', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing',       icon: ChefHat     },
  { key: 'ready',     label: 'Ready',           icon: Package     },
  { key: 'delivered', label: 'Delivered',       icon: Truck       },
];

const OrderConfirmation = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart }  = useCart();

  const [status,    setStatus]    = useState('loading');
  const [order,     setOrder]     = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const initialized = useRef(false);
  const isOwner     = !!localStorage.getItem('fg_admin_token');

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const paymentIntent  = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !redirectStatus) { navigate('/'); return; }

    setPaymentId(paymentIntent);

    if (redirectStatus === 'succeeded') {
      const init = async () => {
        let foundOrder = null;

        try {
          const res = await fetch(`${API_BASE}/api/orders/by-payment/${paymentIntent}`);
          if (res.ok) foundOrder = await res.json();
        } catch {}

        if (!foundOrder) {
          const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
          const items        = JSON.parse(localStorage.getItem('pendingOrderCart') || '[]');
          const total        = parseFloat(localStorage.getItem('pendingOrderTotal') || '0');

          if (items.length > 0 && customerInfo.name) {
            try {
              const res = await fetch(`${API_BASE}/api/orders`, {
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
            } catch (err) { console.error('Order save failed:', err); }
          }
        }

        const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
        if (customerInfo.name) {
          localStorage.setItem('savedCustomer', JSON.stringify({
            name:  customerInfo.name,
            phone: customerInfo.phone || '',
            email: customerInfo.email || '',
          }));
        }

        localStorage.removeItem('customerInfo');
        localStorage.removeItem('pendingOrderCart');
        localStorage.removeItem('pendingOrderTotal');
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
  }, []);

  useEffect(() => {
    if (!paymentId || status !== 'success') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/by-payment/${paymentId}`);
        if (res.ok) setOrder(await res.json());
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [paymentId, status]);

  const whatsappLink = () => {
    if (!order) return `https://wa.me/${OWNER_PHONE}`;
    const items = (order.items || [])
      .map(i => `• ${i.name} x${i.qty}`)
      .join('%0A');
    const msg =
      `Hello! I just placed an order.%0A%0A` +
      `Order ID: ${order.orderId || ''}%0A` +
      `Name: ${order.customer || ''}%0A` +
      `Phone: ${order.phone || ''}%0A%0A` +
      `Items:%0A${items}%0A%0A` +
      `Total: $${(order.total || 0).toFixed(2)}%0A%0A` +
      `Method: ${order.method === 'delivery' ? `Delivery to ${order.address}` : 'Pickup'}`;
    return `https://wa.me/${OWNER_PHONE}?text=${msg}`;
  };

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order?.status);

  if (status === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)' }}>
      <div className="w-10 h-10 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-stone-500 text-sm">Confirming your order...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)', fontFamily: "'Lato',sans-serif" }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg flex flex-col gap-5"
      >

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <>
            {/* Header card */}
            <div className="rounded-3xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
                <CheckCircle size={36} className="text-green-400" />
              </motion.div>
              <h1 className="font-corm text-3xl font-bold text-white mb-1">Order Confirmed!</h1>
              <p className="text-stone-400 text-sm">Thank you — we've received your order and will start preparing it fresh.</p>
              {paymentId && (
                <p className="text-stone-600 text-xs mt-2 font-mono">Ref: {paymentId.slice(-10).toUpperCase()}</p>
              )}
            </div>

            {/* Order details */}
            {order && (
              <div className="rounded-3xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-4">Order Details</div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Order ID', value: order.orderId },
                    { label: 'Name',     value: order.customer },
                    { label: 'Phone',    value: order.phone },
                    { label: 'Method',   value: order.method === 'delivery' ? `Delivery — ${order.address}` : 'Pickup' },
                  ].map(({ label, value }) => value ? (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-stone-400">{label}</span>
                      <span className="text-white font-black">{value}</span>
                    </div>
                  ) : null)}

                  <div className="border-t pt-2.5 mt-1" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-stone-400">{item.name} × {item.qty}</span>
                        <span className="text-white">${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <span className="font-black text-white">Total</span>
                    <span className="font-black text-lg" style={{ color: '#ff9a3c' }}>${(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status tracker */}
            {order && (
              <div className="rounded-3xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-black tracking-widest uppercase text-stone-500 mb-5">Order Status</div>
                <div className="flex items-start justify-between">
                  {STATUS_STEPS.map((step, i) => {
                    const Icon    = step.icon;
                    const done    = i <= currentStep;
                    const current = i === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background: done ? 'linear-gradient(135deg,#c0392b,#e67e22)' : 'rgba(255,255,255,0.06)',
                            border:     current ? '2px solid #ff9a3c' : '2px solid transparent',
                            boxShadow:  current ? '0 0 12px rgba(255,154,60,0.4)' : 'none',
                          }}>
                          <Icon size={16} className={done ? 'text-white' : 'text-stone-600'} />
                        </div>
                        <span className={`text-xs font-black text-center leading-tight ${done ? 'text-white' : 'text-stone-600'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black tracking-wide uppercase transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
              >
                <MessageCircle size={17} /> Send Order via WhatsApp
              </a>

              <a
                href={`tel:+${OWNER_PHONE}`}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black tracking-wide uppercase transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)', boxShadow: '0 4px 16px rgba(192,57,43,0.3)' }}
              >
                <Phone size={17} /> Call Us · {OWNER_PHONE_DISPLAY}
              </a>

              <button
                onClick={() => navigate('/')}
                className="py-3 rounded-xl text-stone-500 text-sm font-black uppercase tracking-wide hover:text-stone-300 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Back to Home
              </button>
            </div>

            <p className="text-center text-stone-600 text-xs px-4">
              A confirmation email has been sent to your inbox. We'll call you when your order is ready.
            </p>
          </>
        )}

        {/* ── PROCESSING ── */}
        {status === 'processing' && (
          <div className="rounded-3xl p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-12 h-12 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="font-corm text-2xl font-bold text-white mb-2">Payment Processing</h2>
            <p className="text-stone-400 text-sm">Your payment is being processed. We'll confirm shortly.</p>
          </div>
        )}

        {/* ── FAILED ── */}
        {status === 'failed' && (
          <div className="rounded-3xl p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <XCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-corm text-2xl font-bold text-white mb-2">Payment Failed</h2>
            <p className="text-stone-400 text-sm mb-6">Something went wrong. Please try again.</p>
            <button
              onClick={() => navigate('/checkout')}
              className="px-8 py-3 rounded-xl text-white font-black text-sm uppercase tracking-wider"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e67e22)' }}
            >
              Try Again
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default OrderConfirmation;