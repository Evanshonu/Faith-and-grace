import Stripe from "stripe";
import Order from "../Models/Order.mjs";
import { sendOrderNotifications } from "./orderController.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripeConfig = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

export const createPaymentIntent = async (req, res) => {
  try {
    const {
      amount, customer_name, customer_email,
      customer_phone, items, method, address,
    } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ error: "Valid amount is required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(Number(amount) * 100),
      currency: "usd",
      metadata: {
        customer_name:  customer_name  || "",
        customer_email: customer_email || "",
        customer_phone: customer_phone || "",
        method:         method         || "pickup",
        address:        address        || "",
        items:          JSON.stringify(items || []),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("PaymentIntent creation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};