import categoryController from '../controllers/category.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', categoryController.createCategoryController);
export default router;
