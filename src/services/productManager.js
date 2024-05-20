import { ProductModel } from '../dao/MongoDB/products.model.js';
import mongoose from 'mongoose';

class ProductManager {
    async getProducts(limit) {
        try {
            const products = await ProductModel.find().limit(limit);
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
