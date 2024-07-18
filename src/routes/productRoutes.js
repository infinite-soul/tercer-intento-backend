import express from 'express';
import ProductManager from '../services/productManager.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
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

router.get('/:pid', async (req, res) => {
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

router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:pid', isAuthenticated, isAdmin, async (req, res) => {
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

router.delete('/:pid', isAuthenticated, isAdmin, async (req, res) => {
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

export default router;