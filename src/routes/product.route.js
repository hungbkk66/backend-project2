import upload from '../middlewares/upload.js';
import productController from '../controllers/product.controller.js';
import express from 'express';

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

export default router;
