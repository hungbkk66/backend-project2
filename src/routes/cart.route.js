import express from 'express';
import cartController from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/add', protectRoute, cartController.addToCartController);

export default router;
