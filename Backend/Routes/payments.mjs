import { Router } from "express";
import { createPaymentIntent, stripeWebhook } from "../Controllers/paymentController.mjs";

const router = Router();

router.post("/create", createPaymentIntent);
router.post("/webhook", stripeWebhook);

export default router;