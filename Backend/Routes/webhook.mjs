import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { handlePaidOrder } from '../Controllers/ordersController.mjs'; // your function to update order

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' });

// This is critical: raw body is needed to verify signature
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SIGNING_SECRET);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Call your order handler (CRUD + email)
      await handlePaidOrder(session);
      break;
    case 'checkout.session.async_payment_failed':
      // optional: handle failed payments
      console.log('Payment failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).send('Received webhook');
});

export default router;