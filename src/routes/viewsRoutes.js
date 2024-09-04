import express from 'express';
import passport from 'passport';
import { UserModel } from '../dao/MongoDB/User.model.js';
import ProductService from '../services/productService.js';
import bcrypt from 'bcrypt';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
const productService = new ProductService();

/**
 * @swagger
 * tags:
 *   name: Views
 *   description: Rutas para renderizar vistas
 */

/**
 * @swagger
 * /realtimeproducts:
 *   get:
 *     summary: Renderiza la página de productos en tiempo real
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página renderizada exitosamente
 *       500:
 *         description: Error al obtener los productos
 */
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

/**
 * @swagger
 * /forgot-password:
 *   get:
 *     summary: Renderiza la página de olvidé mi contraseña
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página renderizada exitosamente
 */
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Olvidé mi contraseña' });
});

/**
 * @swagger
 * /reset-password/{token}:
 *   get:
 *     summary: Renderiza la página de restablecimiento de contraseña
 *     tags: [Views]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Página renderizada exitosamente
 */
router.get('/reset-password/:token', (req, res) => {
    res.render('reset-password', { token: req.params.token });
});

router.use('/productos', isAuthenticated);
router.use('/admin', isAuthenticated, isAdmin);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Renderiza la página de inicio de sesión
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página renderizada exitosamente
 */
router.get('/login', (req, res) => {
    res.render('login');
});

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Renderiza la página de registro
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página renderizada exitosamente
 */
router.get('/register', (req, res) => {
    res.render('register');
});

export default router;