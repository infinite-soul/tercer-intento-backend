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

    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err);
            throw err;
        }
    }

    async getCartById(cartId) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId);
            const cart = await CartModel.findById(objectId).populate('products.product');
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito:', err);
            throw err;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cartObjectId = new mongoose.Types.ObjectId(cartId);
            const productObjectId = new mongoose.Types.ObjectId(productId);
            
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

    async deleteProductFromCart(cartId, productId) {
        try {
            const cartObjectId = new mongoose.Types.ObjectId(cartId);
            const productObjectId = new mongoose.Types.ObjectId(productId);

            const cart = await CartModel.findById(cartObjectId);
            if (!cart) {
                return null;
            }

            cart.products = cart.products.filter((p) => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err);
            throw err;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId);
            const cart = await CartModel.findById(objectId);
            if (!cart) {
                return null;
            }

            cart.products = updatedProducts.map((p) => ({
                product: new mongoose.Types.ObjectId(p.product),
                quantity: p.quantity,
            }));

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (err) {
            console.error('Error al actualizar el carrito:', err);
            throw err;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cartObjectId = new mongoose.Types.ObjectId(cartId);
            const productObjectId = new mongoose.Types.ObjectId(productId);

            const cart = await CartModel.findById(cartObjectId);
            if (!cart) {
                return null;
            }

            const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
            if (productIndex === -1) {
                return null;
            }

            cart.products[productIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err);
            throw err;
        }
    }

    async deleteCart(cartId) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId);
            const cart = await CartModel.findById(objectId);
            if (!cart) {
                return null;
            }

            cart.products = [];
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (err) {
            console.error('Error al vaciar el carrito:', err);
            throw err;
        }
    }
}

export default CartManager;