// src/controllers/productController.js

import ProductService from '../services/productService.js';
import { createError, CustomError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import mockingModule from '../utils/mockingModule.js';

const productService = new ProductService();

class ProductController {
    async getProducts(req, res) {
        const { limit, page, sort, query, category } = req.query;
        try {
            const response = await productService.getProducts(limit, page, sort, query, category);
            if (response.payload.length === 0) {
                throw createError('PRODUCT_NOT_FOUND');
            }
            res.json(response);
        } catch (err) {
            logger.error('Error en el controlador al obtener los productos:', err);
            if (err instanceof CustomError) {
                res.status(404).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'Error al obtener los productos' });
            }
        }
    }

    async getProductById(req, res) {
        const productId = req.params.pid;
        try {
            const product = await productService.getProductById(productId);
            if (!product) {
                throw createError('PRODUCT_NOT_FOUND');
            }
            res.render('productDetails', { product });
        } catch (err) {
            logger.error('Error en el controlador al obtener el producto:', err);
            if (err instanceof CustomError) {
                res.status(404).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'Error al obtener el producto' });
            }
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const requiredFields = ['title', 'description', 'price', 'thumbnail', 'stock', 'code', 'category'];
            const missingFields = requiredFields.filter(field => !newProduct[field]);
            if (missingFields.length > 0) {
                throw createError('MISSING_REQUIRED_FIELDS', { missingFields });
            }
            newProduct.owner = req.user.role === 'premium' ? req.user.email : 'admin';
            const product = await productService.addProduct(newProduct);
            res.status(201).json(product);
        } catch (err) {
            logger.error('Error en el controlador al agregar el producto:', err);
            if (err instanceof CustomError) {
                res.status(400).json({ error: err.message, details: err.details });
            } else {
                res.status(500).json({ error: 'Error al agregar el producto' });
            }
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
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            if (req.user.role === 'premium' && product.owner !== req.user.email) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
            }
            const deleted = await productService.deleteProduct(id);
            res.json({ message: 'Producto eliminado' });
        } catch (err) {
            console.error('Error en el controlador al eliminar el producto:', err);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }

    async getMockProducts(req, res) {
        try {
            const mockProducts = mockingModule.generateMockProducts(50);
            res.json(mockProducts);
        } catch (err) {
            logger.error('Error al generar productos mock:', err);
            res.status(500).json({ error: 'Error al generar productos mock' });
        }
    }
    async createMockProducts(req, res) {
        try {
            const mockProducts = mockingModule.generateMockProducts(50);
            const createdProducts = [];

            for (const product of mockProducts) {
                try {
                    const createdProduct = await productService.addProduct(product);
                    createdProducts.push(createdProduct);
                } catch (err) {
                    logger.error(`Error al crear producto mock: ${err.message}`);
                    // Continúa con el siguiente producto si hay un error
                }
            }

            res.status(201).json({
                message: `Se crearon ${createdProducts.length} productos de prueba`,
                products: createdProducts
            });
        } catch (err) {
            logger.error('Error al crear productos mock:', err);
            res.status(500).json({ error: 'Error al crear productos mock' });
        }
    }
}


export default new ProductController();