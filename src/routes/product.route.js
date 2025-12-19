import upload from '../middlewares/upload.js';
import productController from '../controllers/product.controller.js';
import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();
router.post(
  '/',
  upload.single('image'),
  productController.createProductController,
);

router.put(
  '/:id',
  upload.single('image'),
  productController.updateProductController,
);

router.get('/me', protectRoute, productController.getMyProductsController);

router.delete('/:id', protectRoute, productController.deleteProductController);

export default router;
