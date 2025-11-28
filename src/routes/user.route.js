import userController from '../controllers/user.controller.js';
import validation from '../validations/auth.validation.js';
import express from 'express';

const router = express.Router();

router.post(
  '/register',
  validation.createUserValidation,
  userController.createUserController,
);

router.put(
  '/:id',
  validation.updateUserValidation,
  userController.updateUserController,
);

export default router;
