import { ProductModel } from '../dao/MongoDB/products.model.js';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class ProductManager {
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
                    { title: { $regex: new RegExp(query, 'i') } }, // busca productos cuyo nombre contenga 'query' (ignorando mayúsculas y minúsculas)
                    { category: query },
                    { available: query === 'true' },
                ];
            }
    
            if (category) {
                filter.category = category;
            }
    
            const result = await ProductModel.paginate(filter, options);
    
            const response = {
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
    
            return response;
        } catch (err) {
            console.error('Error al obtener los productos:', err);
            throw err;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            return product;
        } catch (err) {
            console.error('Error al obtener el producto:', err);
            throw err;
        }
    }

    async addProduct(productData) {
        try {
            const product = new ProductModel(productData);
            await product.save();
            console.log('Producto agregado con éxito.');
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            throw err;
        }
    }

    async updateProduct(idProduct, updatedData) {
        try {
            const objectId = new mongoose.Types.ObjectId(idProduct); // Convertir el número a ObjectId
            const updatedProduct = await ProductModel.findByIdAndUpdate(objectId, updatedData, { new: true });
            console.log('Producto actualizado con éxito.');
            return updatedProduct;
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            throw err;
        }
    }

    async deleteProduct(idProduct) {
        try {
            // Convertir el ID del producto a ObjectId
            const objectId = new mongoose.Types.ObjectId(idProduct);
            
            // Eliminar el producto por su ID convertido a ObjectId
            const deletedProduct = await ProductModel.findByIdAndDelete(objectId);
    
            // Verificar si el producto fue eliminado correctamente
            if (!deletedProduct) {
                // Si no se encontró el producto, imprimir un mensaje
                console.log('Producto no encontrado.');
                return false; // Producto no encontrado
            }
    
            // Si el producto fue eliminado correctamente, imprimir un mensaje
            console.log('Producto eliminado con éxito.');
            return true; // Producto eliminado exitosamente
        } catch (err) {
            // Manejar cualquier error que pueda ocurrir durante la eliminación del producto
            console.error('Error al eliminar el producto:', err);
            throw err;
        }
    }
    
    
    
    
}

export default ProductManager;
