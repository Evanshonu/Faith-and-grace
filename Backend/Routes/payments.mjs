import { Router } from "express";
import { getStripeConfig, createPaymentIntent } from "../Controllers/paymentController.mjs";

const router = Router();

router.get("/config",         getStripeConfig);
router.post("/create-intent", createPaymentIntent);

export default router;