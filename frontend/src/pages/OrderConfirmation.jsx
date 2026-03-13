import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  ArrowRight,
  Package,
  Truck,
  ChefHat
} from 'lucide-react';

const API_BASE = 'https://faith-and-grace.onrender.com';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Received', icon: CheckCircle, desc: 'We have your order' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Kitchen is cooking' },
  { key: 'ready', label: 'Ready', icon: Package, desc: 'Ready for pickup/delivery' },
  { key: 'delivered', label: 'Delivered', icon: Truck, desc: 'Enjoy your meal!' }
];

const OWNER_PHONE = "233501657205";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {

    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !redirectStatus) {
      navigate('/');
      return;
    }

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
          const items = JSON.parse(localStorage.getItem('pendingOrderCart') || '[]');
          const total = parseFloat(localStorage.getItem('pendingOrderTotal') || '0');

          if (items.length > 0 && customerInfo.name) {

            try {

              const res = await fetch(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customer_name: customerInfo.name || 'Guest',
                  customer_phone: customerInfo.phone || 'N/A',
                  customer_email: customerInfo.email || '',
                  items,
                  total,
                  method: customerInfo.method || 'pickup',
                  address: customerInfo.address || '',
                  payment_intent_id: paymentIntent
                })
              });

              if (res.ok) foundOrder = await res.json();

            } catch (err) {
              console.error('Order save failed:', err);
            }

          }

        }

        const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');

        if (customerInfo.name) {

          localStorage.setItem('savedCustomer', JSON.stringify({
            name: customerInfo.name,
            phone: customerInfo.phone || '',
            email: customerInfo.email || ''
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

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }

      } catch {}

    }, 15000);

    return () => clearInterval(interval);

  }, [paymentId, status]);

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order?.status);

  /* -------- WhatsApp message -------- */

  const whatsappLink = () => {

    if (!order) return '#';

    const items = order.items
      .map(i => `• ${i.name} x${i.qty}`)
      .join('%0A');

    const message =
      `Hello! I placed an order.%0A%0A` +
      `Order ID: ${order.orderId}%0A` +
      `Name: ${order.customer}%0A` +
      `Phone: ${order.phone}%0A%0A` +
      `Items:%0A${items}%0A%0A` +
      `Total: $${order.total.toFixed(2)}`;

    return `https://wa.me/${OWNER_PHONE}?text=${message}`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)' }}>

        <div className="w-10 h-10 border-2 border-stone-700 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Confirming your order...</p>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg,#0d0805,#1a0f0a)' }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg flex flex-col gap-5"
      >

        {/* SUCCESS */}

        {status === 'success' && (

          <>
            <div className="rounded-3xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

              <CheckCircle size={38} className="text-green-400 mx-auto mb-4" />

              <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>

              {paymentId && (
                <p className="text-stone-500 text-xs mt-2 font-mono">
                  Ref: {paymentId.slice(-10).toUpperCase()}
                </p>
              )}

            </div>

            {order && (

              <div className="rounded-3xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

                <div className="text-xs uppercase text-stone-500 mb-4">
                  Order Details
                </div>

                <div className="flex flex-col gap-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-stone-400">Order ID</span>
                    <span className="text-white font-bold">{order.orderId}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Name</span>
                    <span className="text-white font-bold">{order.customer}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Total</span>
                    <span className="text-orange-400 font-bold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                </div>

              </div>

            )}

            {/* ACTION BUTTONS */}

            <div className="flex flex-col gap-3">

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg,#25D366,#128C7E)'
                }}
              >
                Send Order via WhatsApp
              </a>

              <a
                href="tel:+233501657205"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg,#c0392b,#e67e22)'
                }}
              >
                <Phone size={15} /> Call Us
              </a>

              <button
                onClick={() => navigate('/')}
                className="py-3 rounded-xl text-stone-400 text-sm font-bold"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Back to Home
              </button>

            </div>

          </>

        )}

        {status === 'processing' && (
          <div className="text-center text-orange-400">
            Payment processing...
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center text-red-400">
            Payment failed. Please try again.
          </div>
        )}

      </motion.div>

    </div>
  );
};

export default OrderConfirmation;