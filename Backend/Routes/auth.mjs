import { Router } from 'express';
import { login, requestPasswordReset, confirmPasswordReset } from '../Controllers/authController.mjs';

const router = Router();

router.post('/login',         login);
router.post('/request-reset', requestPasswordReset);
router.post('/confirm-reset', confirmPasswordReset);

export default router;