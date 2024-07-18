import express from 'express';
import CartManager from '../services/cartManager.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', isAuthenticated, async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (err) {
        console.error('Error al obtener los carritos:', err);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

router.put('/:cid', isAuthenticated, async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

router.delete('/:cid', isAuthenticated, async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await cartManager.deleteCart(cartId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

router.put('/:cid/products/:pid', isAuthenticated, async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const product = cart.products.find(p => p.id === pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error al obtener el producto del carrito:', err);
        res.status(500).json({ error: 'Error al obtener el producto del carrito' });
    }
});

router.delete('/:cid/products/:pid', isAuthenticated, async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al eliminar el producto del carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

export default router;