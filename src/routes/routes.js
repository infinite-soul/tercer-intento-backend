import express from 'express';
import ProductManager from '../services/productManager.js';
import CartManager from '../services/cartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Rutas para productos
router.get('/products', (req, res) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    res.json(products);
});

router.get('/products/:pid', (req, res) => {
    const product = productManager.getProductById(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post('/products', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/products/:pid', (req, res) => {
    const updatedProduct = req.body;
    const id = parseInt(req.params.pid);
    const updated = productManager.updateProduct(id, updatedProduct);
    if (!updated) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
});

router.delete('/products/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const deleted = productManager.deleteProduct(id);
    if (!deleted) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
});

// Rutas para carritos
router.post('/carts', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

router.post('/carts/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid); 
    const product = productManager.getProductById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedCart = cartManager.addProductToCart(cartId, product);
    if (!updatedCart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(updatedCart);
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;