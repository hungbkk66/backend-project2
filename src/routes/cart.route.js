import express from 'express';
import cartController from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/add', protectRoute, cartController.addToCartController);
router.get('/me', protectRoute, cartController.getMyCartController);
router.get('/group-by-shop', protectRoute, cartController.getCartGroupedByShop);
router.delete(
  '/item/:cartItemId',
  protectRoute,
  cartController.removeItemFromCart,
);
export default router;
