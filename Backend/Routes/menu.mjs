import { Router } from 'express';
import protect from '../Middlewares/auth.mjs';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../Controllers/menuController.mjs';

const router = Router();

router.get('/',        getMenu);
router.post('/',       protect, addMenuItem);

// FIX: Admin dashboard sends PUT requests for edits, but original routes only had PATCH.
// Both are now supported.
router.patch('/:id',   protect, updateMenuItem);
router.put('/:id',     protect, updateMenuItem);

router.delete('/:id',  protect, deleteMenuItem);

export default router;
