import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log('KEY STARTS WITH:', process.env.STRIPE_SECRET_KEY?.substring(0, 7));

// Returns the publishable key to the frontend so it can initialize Stripe.js
const getStripeConfig = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

// Creates a payment intent — Stripe returns a clientSecret the frontend uses to render the card form
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, customer_name, customer_email } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ error: 'Valid amount is required' });

    const paymentIntent = await stripe.paymentIntents.create({
      // Stripe requires amount in CENTS — multiply dollars by 100
      amount:   Math.round(Number(amount) * 100),
      currency: 'usd',
      metadata: {
        customer_name:  customer_name  || '',
        customer_email: customer_email || '',
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Verifies the payment actually succeeded before saving the order
const confirmPayment = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id)
      return res.status(400).json({ error: 'Payment intent ID is required' });

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded')
      return res.status(400).json({ error: `Payment not completed. Status: ${paymentIntent.status}` });

    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error('Stripe confirm error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export { getStripeConfig, createPaymentIntent, confirmPayment };