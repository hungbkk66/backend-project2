import categoryController from '../controllers/category.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', categoryController.createCategoryController);
router.get('/names', categoryController.getAllCategoryNames);
router.get('/id/:categoryName', categoryController.getCategoryIdByName);
export default router;
