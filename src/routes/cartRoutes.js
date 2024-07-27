// src/routes/cartRoutes.js

import express from 'express';
import CartController from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
const cartController = new CartController();

router.post('/', isAuthenticated, cartController.createCart);
router.get('/', cartController.getCarts);
router.get('/:cid', isAuthenticated, cartController.getCartById);
router.post('/:cid/product/:pid', isAuthenticated, cartController.addProductToCart);
router.delete('/:cid/products/:pid', isAuthenticated, cartController.deleteProductFromCart);
router.put('/:cid', isAuthenticated, cartController.updateCart);
router.put('/:cid/products/:pid', isAuthenticated, cartController.updateProductQuantity);
router.delete('/:cid', isAuthenticated, cartController.deleteCart);

export default router;