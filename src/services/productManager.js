import { ProductModel } from '../dao/MongoDB/products.model.js';
import mongoose from 'mongoose';


class ProductManager {
    async getProducts(limit, skip, sort, query) {
        try {
            let products;
    
            const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
            const queryOption = query ? { category: query } : {}; // Ejemplo de filtro por categoría
    
            if (limit && skip) {
                products = await ProductModel.find(queryOption).sort(sortOption).skip(skip).limit(limit);
            } else {
                products = await ProductModel.find(queryOption).sort(sortOption);
            }
    
            return products;
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
