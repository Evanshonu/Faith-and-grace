import { Router }           from 'express';
import protect              from '../Middlewares/auth.mjs';
import { validateMenuItem } from '../Validators/menuValidator.mjs';
import {
  getMenu, addMenuItem, updateMenuItem, deleteMenuItem,
} from '../Controllers/menuController.mjs';

const router = Router();

router.get('/',      getMenu);                            // public
router.post('/',     protect, validateMenuItem, addMenuItem);    // admin only
router.put('/:id',   protect, validateMenuItem, updateMenuItem); // admin only
router.delete('/:id',protect, deleteMenuItem);           // admin only

export default router;