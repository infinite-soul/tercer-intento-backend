import express from 'express';
import passport from 'passport';
import { UserModel } from '../dao/MongoDB/User.model.js';
import ProductService from '../services/productService.js';
import bcrypt from 'bcrypt';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
const productService = new ProductService();

router.get('/realtimeproducts', async (req, res) => {
    try {
        const allProducts = await productService.getProducts(1); 
        res.render('realTimeProducts', {
            title: 'Real-Time Products',
            productos: allProducts,
        });
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).send('Error al obtener los productos');
    }
});

router.use('/productos', isAuthenticated);
router.use('/admin', isAuthenticated, isAdmin);
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});


export default router;