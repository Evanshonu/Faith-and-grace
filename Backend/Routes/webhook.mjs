import express from "express";
import Stripe from "stripe";
import {
  createOrFindPaidOrder,
  sendOrderNotifications,
} from "../Controllers/orderController.mjs";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const emitNewOrder = (req, order) => {
  const io = req.app.get("io");
  if (io) io.emit("new-order", order);
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_SIGNING_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "payment_intent.succeeded") {
    return res.json({ received: true });
  }

  const paymentIntent = event.data.object;
  const meta = paymentIntent.metadata || {};

  console.log("Payment succeeded:", paymentIntent.id);

  try {
    let items = [];
    try {
      items = JSON.parse(meta.items || "[]");
    } catch (_) {}

    const { order, created, pending } = await createOrFindPaidOrder({
      customer_name: meta.customer_name || "Customer",
      customer_phone: meta.customer_phone || "",
      customer_email: meta.customer_email || "",
      items,
      total: paymentIntent.amount / 100,
      method: meta.method || "pickup",
      address: meta.address || "",
      payment_intent_id: paymentIntent.id,
    });

    if (pending) {
      console.log("Payment is already being processed, skipping duplicate creation");
      return res.status(200).json({ received: true, pending: true });
    }

    if (!created) {
      console.log("Order already exists, skipping");
      return res.status(200).json({ received: true, duplicate: true });
    }

    emitNewOrder(req, order);

    try {
      console.log("Order created, sending notifications...");
      await sendOrderNotifications(order);
    } catch (notificationError) {
      console.error("Webhook notification failed:", notificationError.message);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Error in webhook handler:", err);
    return res.status(500).send("Server error");
  }
};

router.post("/", handleStripeWebhook);
router.post("/stripe", handleStripeWebhook);

export default router;
