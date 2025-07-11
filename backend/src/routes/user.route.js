import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { register, login, logout } from '../controllers/user.controller.js';
import { registerValidation, loginValidation } from '../validation/user.validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', [...registerValidation, validate], register);
router.post('/login', [...loginValidation, validate], login);
router.post('/logout', authMiddleware, logout);

export default router;