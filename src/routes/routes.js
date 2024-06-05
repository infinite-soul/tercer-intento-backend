import express from 'express';
import ProductManager from '../services/productManager.js';
import CartManager from '../services/cartManager.js';
import MessageManager from '../services/messageManager.js';
import { ProductModel } from '../dao/MongoDB/products.model.js';
import { CartModel } from '../dao/MongoDB/carts.model.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

// Rutas para productos
router.get('/productos', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    try {
        const result = await productManager.getProducts(limit, page, sort, query);
        res.render('productsPagination', result);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/products', async (req, res) => {
    const { limit, page, sort, query, category } = req.query;
    try {
        const response = await productManager.getProducts(limit, page, sort, query, category);
        if (response.payload.length === 0) {
            return res.status(404).json({ error: 'Página no encontrada' });
        }
        res.json(response);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.render('productDetails', { product });
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/products', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/products/:pid', async (req, res) => {
    const updatedProduct = req.body;
    const id = req.params.pid;
    try {
        const updated = await productManager.updateProduct(id, updatedProduct);
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updated);
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/products/:pid', async (req, res) => {
    const id = req.params.pid;
    try {
        const deleted = await productManager.deleteProduct(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Rutas para carritos
router.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Cambia la ruta de 'carts' a 'carritos'
router.get('/carritos/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Crea una nueva ruta 'carts' que devuelva el JSON de los carritos por ID
router.get('/carts/:cid', async (req, res) => {
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

router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (err) {
        console.error('Error al obtener los carritos:', err);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

router.put('/carts/:cid', async (req, res) => {
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

router.put('/carts/:cid/products/:pid', async (req, res) => {
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

router.delete('/carts/:cid', async (req, res) => {
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

router.delete('/carts/:cid/products/:pid', async (req, res) => {
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

// Rutas para chat
router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await messageManager.getMessages();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
});

router.post('/messages', async (req, res) => {
    const messageData = req.body;
    try {
        const newMessage = await messageManager.addMessage(messageData);
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el mensaje' });
    }
});

export default router;