import authController from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import validation from '../validations/auth.validation.js';
import express from 'express';

const router = express.Router();

router.post('/login', validation.loginValidation, authController.login);
router.get('/me', protectRoute, authController.tetsLogin);
router.post('/onboarding', protectRoute, authController.onboarding);

router.post('/logout', authController.logout);

export default router;
