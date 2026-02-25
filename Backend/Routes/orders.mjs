import { Router }        from 'express';
import protect           from '../Middlewares/auth.mjs';
import { validateOrder } from '../Validators/orderValidator.mjs';
import {
  getOrders, getOrderById, createNewOrder, updateOrderStatus,
} from '../Controllers/orderController.mjs';

const router = Router();

router.get('/',      protect, getOrders);
router.get('/:id',   getOrderById);          // ← new — public, for order confirmation page
router.post('/',     validateOrder, createNewOrder);
router.patch('/:id', protect, updateOrderStatus);

export default router;