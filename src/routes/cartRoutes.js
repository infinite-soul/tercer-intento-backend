import express from 'express';
import CartController from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
const cartController = new CartController();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Manejo de carritos de compra
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/', isAuthenticated, cartController.createCart);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.get('/', cartController.getCarts);

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/:cid', isAuthenticated, cartController.getCartById);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Añade un producto al carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto añadido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.post('/:cid/product/:pid', isAuthenticated, cartController.addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.delete('/:cid/products/:pid', isAuthenticated, cartController.deleteProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualiza todo el carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */
router.put('/:cid', isAuthenticated, cartController.updateCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualiza la cantidad de un producto en el carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad de producto actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.put('/:cid/products/:pid', isAuthenticated, cartController.updateProductQuantity);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Elimina todos los productos del carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrito no encontrado
 */
router.delete('/:cid', isAuthenticated, cartController.deleteCart);

export default router;