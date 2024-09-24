import ProductDao from '../dao/productDao.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';


const productDao = new ProductDao();

class ProductService {
    async getProducts(limit = 10, page = 1, sort, query, category) {
        try {
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
            };

            const filter = {};
            if (query) {
                filter.$or = [
                    { title: { $regex: new RegExp(query, 'i') } },
                    { category: query },
                    { available: query === 'true' },
                ];
            }

            if (category) {
                filter.category = category;
            }

            const result = await productDao.getProducts(filter, options);

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.prevPage : null,
                nextPage: result.hasNextPage ? result.nextPage : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/productos?page=${result.prevPage}&limit=${limit}` : null,
                nextLink: result.hasNextPage ? `/api/productos?page=${result.nextPage}&limit=${limit}` : null,
            };
        } catch (err) {
            console.error('Error en el servicio al obtener los productos:', err);
            throw err;
        }
    }

    async getProductById(id) {
        return await productDao.getProductById(id);
    }

    async generateUniqueCode() {
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = uuidv4().substring(0, 8).toUpperCase(); // Genera un código de 8 caracteres
            const existingProduct = await productDao.getProductByCode(code);
            if (!existingProduct) {
                isUnique = true;
            }
        }
        return code;
    }

    async addProduct(productData) {
        try {
            const code = await this.generateUniqueCode();
            const productWithCode = { ...productData, code };
            logger.info(`Creando nuevo producto con código: ${code}`);
            return await productDao.addProduct(productWithCode);
        } catch (error) {
            logger.error('Error al crear producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedData) {
        return await productDao.updateProduct(id, updatedData);
    }

    async deleteProduct(id) {
        return await productDao.deleteProduct(id);
    }
}

export default ProductService;