import orderController from '../controllers/order.controller.js';
import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();
router.post(
  '/from-cart',
  protectRoute,
  orderController.createOrdersFromCartByShop,
);
router.get('/my-orders', protectRoute, orderController.getMyOrders);
router.post('/momo-webhook', orderController.momoWebhookHandler);
router.get('/shop-orders', protectRoute, orderController.getShopOrders);
router.put('/:id/status', protectRoute, orderController.updateOrderStatus);
export default router;
