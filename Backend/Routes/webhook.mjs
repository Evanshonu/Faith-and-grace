import express from "express";
import Stripe from "stripe";
import Order from "../Models/Order.mjs";

const router = express.Router();

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT: Stripe needs raw body
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Payment succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      console.log("Payment succeeded:", paymentIntent.id);

      try {
        // Prevent duplicate orders
        const existingOrder = await Order.findOne({
          paymentId: paymentIntent.id,
        });

        if (existingOrder) {
          return res.status(200).json({ message: "Order already exists" });
        }

        // Create order
        await Order.create({
          paymentId: paymentIntent.id,
          total: paymentIntent.amount / 100,
          status: "paid",
        });

        console.log("Order created from webhook");
      } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).send("Server error");
      }
    }

    res.json({ received: true });
  }
);

export default router;