import Stripe from "stripe";
import Order from "../Models/Order.mjs";
import sendEmail from "../utils/sendEmail.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
-----------------------------------------
CREATE PAYMENT INTENT
-----------------------------------------
Frontend calls this after creating order
*/
export const createPaymentIntent = async (req, res) => {
  try {

    const { amount, orderId, currency = "usd" } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        message: "Amount and orderId are required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,

      metadata: {
        orderId: orderId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {

    console.error("❌ PaymentIntent creation failed:", error);

    res.status(500).json({
      message: "Failed to create payment",
    });

  }
};


/*
-----------------------------------------
STRIPE WEBHOOK HANDLER
-----------------------------------------
Stripe calls this endpoint after payment
*/
export const stripeWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_SIGNING_SECRET
    );

  } catch (err) {

    console.error("❌ Stripe webhook verification failed:", err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);

  }

  switch (event.type) {

    /*
    -----------------------------------------
    PAYMENT SUCCESS
    -----------------------------------------
    */
    case "payment_intent.succeeded": {

      const paymentIntent = event.data.object;

      try {

        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          console.warn("⚠️ Missing orderId in metadata");
          break;
        }

        const order = await Order.findById(orderId);

        if (!order) {
          console.warn("⚠️ Order not found:", orderId);
          break;
        }

        // Prevent duplicate processing
        if (order.status === "paid") {
          console.log("⚠️ Order already processed:", order._id);
          break;
        }

        // Update order
        order.status = "paid";
        order.paymentId = paymentIntent.id;

        await order.save();

        console.log("✅ Order marked as PAID:", order._id);

        /*
        -----------------------------------------
        SEND CUSTOMER EMAIL
        -----------------------------------------
        */
        try {

          await sendEmail({
            to: order.email,
            subject: "Order Confirmation - Faith & Grace",
            text: `
Thank you for your order!

Order ID: ${order._id}
Amount: ${order.amount}

Your payment has been successfully received.

Faith & Grace
            `,
          });

          console.log("📧 Confirmation email sent to:", order.email);

        } catch (emailError) {

          console.error("❌ Email failed:", emailError.message);

        }

      } catch (dbError) {

        console.error("❌ Database update error:", dbError);

      }

      break;
    }


    /*
    -----------------------------------------
    PAYMENT FAILED
    -----------------------------------------
    */
    case "payment_intent.payment_failed": {

      const failedIntent = event.data.object;

      console.warn("⚠️ Payment failed:", failedIntent.id);

      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
};