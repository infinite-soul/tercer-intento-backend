import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import UserController from '../controllers/authController.js';

const router = express.Router();

router.put('/premium/:uid', isAuthenticated, isAdmin, UserController.updateUserToPremium);

export default router;