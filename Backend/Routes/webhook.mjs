import express from "express";
import Stripe from "stripe";
import Order from "../Models/Order.mjs";
import { sendOrderNotifications } from "../Controllers/orderController.mjs";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        process.env.STRIPE_SIGNING_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const meta = paymentIntent.metadata;

      console.log("Payment succeeded:", paymentIntent.id);

      try {
        const existingOrder = await Order.findOne({ paymentId: paymentIntent.id });
        if (existingOrder) {
          console.log("Order already exists, skipping");
          return res.status(200).json({ message: "Order already exists" });
        }

        let items = [];
        try { items = JSON.parse(meta.items || "[]"); } catch (_) {}

        const order = await Order.create({
          paymentId: paymentIntent.id,
          customer:  meta.customer_name  || "Customer",
          phone:     meta.customer_phone || "",
          email:     meta.customer_email || "",
          items,
          total:     paymentIntent.amount / 100,
          method:    meta.method  || "pickup",
          address:   meta.address || "",
          status:    "paid",
          stripePaymentIntent: paymentIntent.id,
        });

        console.log("Order created, sending notifications...");
        await sendOrderNotifications(order);

      } catch (err) {
        console.error("Error in webhook handler:", err);
        return res.status(500).send("Server error");
      }
    }

    res.json({ received: true });
  }
);

export default router;