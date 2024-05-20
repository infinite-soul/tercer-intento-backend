import { CartModel } from '../dao/MongoDB/carts.model.js';
import { ProductModel } from '../dao/MongoDB/products.model.js';
import mongoose from 'mongoose';

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (err) {
            console.error('Error al crear el carrito:', err);
            throw err;
        }
    }

    async getCartById(cartId) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId); // Convertir el ID del carrito a ObjectId
            const cart = await CartModel.findById(objectId).populate('products.product');
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito:', err);
            throw err;
        }
    }

    async updateCart(cartId, updatedCartData) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId); // Convertir el ID del carrito a ObjectId
            const cart = await CartModel.findById(objectId);
            if (!cart) {
                return null;
            }
    
            // Actualizar campos específicos del carrito
            if (updatedCartData.products) {
                cart.products = updatedCartData.products;
            }
            // Agregar más campos según sea necesario
    
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (err) {
            console.error('Error al actualizar el carrito:', err);
            throw err;
        }
    }
    
    

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cartObjectId = new mongoose.Types.ObjectId(cartId); // Convertir el ID del carrito a ObjectId
            const productObjectId = new mongoose.Types.ObjectId(productId); // Convertir el ID del producto a ObjectId
            
            const cart = await CartModel.findById(cartObjectId);
            if (!cart) {
                return null;
            }

            const product = await ProductModel.findById(productObjectId);
            if (!product) {
                return null;
            }

            const existingProduct = cart.products.find((p) => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productObjectId, quantity });
            }

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err);
            throw err;
        }
    }

    async deleteCart(cartId) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId); // Convertir el ID del carrito a ObjectId
            const deletedCart = await CartModel.findByIdAndDelete(objectId);
            return deletedCart;
        } catch (err) {
            console.error('Error al eliminar el carrito:', err);
            throw err;
        }
    }
}

export default CartManager;
