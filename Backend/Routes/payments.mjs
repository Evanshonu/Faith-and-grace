import { Router } from 'express';
import {
  getStripeConfig,
  createPaymentIntent,
  confirmPayment,
} from '../Controllers/paymentController.mjs';

const router = Router();

router.get('/stripe-config',          getStripeConfig);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment',       confirmPayment);

export default router;