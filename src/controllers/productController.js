// src/controllers/productController.js

import ProductService from '../services/productService.js';

const productService = new ProductService();

class ProductController {
    async getProducts(req, res) {
        const { limit, page, sort, query, category } = req.query;
        try {
            const response = await productService.getProducts(limit, page, sort, query, category);
            if (response.payload.length === 0) {
                return res.status(404).json({ error: 'Página no encontrada' });
            }
            res.json(response);
        } catch (err) {
            console.error('Error en el controlador al obtener los productos:', err);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    async getProductById(req, res) {
        const productId = req.params.pid;
        try {
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.render('productDetails', { product });
        } catch (err) {
            console.error('Error en el controlador al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.status(201).json(product);
        } catch (err) {
            console.error('Error en el controlador al agregar el producto:', err);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }

    async updateProduct(req, res) {
        const updatedProduct = req.body;
        const id = req.params.pid;
        try {
            const updated = await productService.updateProduct(id, updatedProduct);
            if (!updated) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(updated);
        } catch (err) {
            console.error('Error en el controlador al actualizar el producto:', err);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            const deleted = await productService.deleteProduct(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado' });
        } catch (err) {
            console.error('Error en el controlador al eliminar el producto:', err);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
}

export default new ProductController();