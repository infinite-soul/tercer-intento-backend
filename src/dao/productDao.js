// src/dao/productDao.js

import { ProductModel } from './MongoDB/products.model.js';

class ProductDao {
    async getProducts(filter, options) {
        try {
            return await ProductModel.paginate(filter, options);
        } catch (err) {
            console.error('Error en DAO al obtener los productos:', err);
            throw err;
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (err) {
            console.error('Error en DAO al obtener el producto por ID:', err);
            throw err;
        }
    }

    async getProductByCode(code) {
        try {
            return await ProductModel.findOne({ code });
        } catch (err) {
            console.error('Error en DAO al obtener el producto por código:', err);
            throw err;
        }
    }

    async addProduct(productData) {
        try {
            const product = new ProductModel(productData);
            return await product.save();
        } catch (err) {
            console.error('Error en DAO al agregar el producto:', err);
            throw err;
        }
    }

    async updateProduct(id, updatedData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
        } catch (err) {
            console.error('Error en DAO al actualizar el producto:', err);
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (err) {
            console.error('Error en DAO al eliminar el producto:', err);
            throw err;
        }
    }
}

export default ProductDao;