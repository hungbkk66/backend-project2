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

router.get('/search', productController.searchProductsController);

router.get('/:id', productController.getProductDetailController);

router.post('/rate', protectRoute, productController.rateProduct);

router.get('/sort/top-expensive', productController.getTopExpensiveProducts);

router.get('/sort/top-cheapest', productController.getTopCheapestProducts);

router.get(
  '/category/:categoryName',
  productController.getProductsByCategoryName,
);

router.get('/sort/top-rated', productController.getTopRatedProducts);

export default router;
