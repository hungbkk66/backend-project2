import express from 'express';
import upload from '../middlewares/upload.js';
import shopController from '../controllers/shop.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/', upload.single('image'), shopController.createShopController);
router.get('/search', shopController.searchShopsController);
router.put(
  '/:id',
  protectRoute,
  upload.single('image'),
  shopController.updateShopController,
);
router.get('/me', protectRoute, shopController.getMyShop);

export default router;
