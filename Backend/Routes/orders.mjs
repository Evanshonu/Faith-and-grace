import { Router }        from 'express';
import protect           from '../Middlewares/auth.mjs';
import { validateOrder } from '../Validators/orderValidator.mjs';
import {
  getOrders, createNewOrder, updateOrderStatus, getOrderByPayment, trackOrders,
} from '../Controllers/orderController.mjs';

const router = Router();

router.get('/',                            protect, getOrders);
router.post('/',                           validateOrder, createNewOrder);
router.get('/by-payment/:paymentIntentId', getOrderByPayment);
router.get('/track/:identifier',           trackOrders);
router.patch('/:id',                       protect, updateOrderStatus);

export default router;