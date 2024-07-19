// src/routes/productRoutes.js

import express from 'express';
import productController from '../controllers/productController.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', isAuthenticated, isAdmin, productController.addProduct);
router.put('/:pid', isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/:pid', isAuthenticated, isAdmin, productController.deleteProduct);

export default router;