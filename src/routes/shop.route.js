import express from 'express';
import upload from '../middlewares/upload.js';
import shopController from '../controllers/shop.controller.js';

const router = express.Router();

router.post('/', upload.single('image'), shopController.createShopController);

export default router;
