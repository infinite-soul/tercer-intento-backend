// src/dao/cartDao.js

import { CartModel } from './MongoDB/carts.model.js';
import { ProductModel } from './MongoDB/products.model.js';
import mongoose from 'mongoose';

class CartDao {
    async createCart() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    }

    async getCarts() {
        return await CartModel.find();
    }

    async getCartById(cartId) {
        const objectId = new mongoose.Types.ObjectId(cartId);
        return await CartModel.findById(objectId).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity) {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        
        const cart = await CartModel.findById(cartObjectId);
        const product = await ProductModel.findById(productObjectId);
        
        if (!cart || !product) {
            return null;
        }

        const existingProduct = cart.products.find((p) => p.product.toString() === productId);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productObjectId, quantity });
        }

        return await cart.save();
    }

    async deleteProductFromCart(cartId, productId) {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const cart = await CartModel.findById(cartObjectId);
        
        if (!cart) {
            return null;
        }

        cart.products = cart.products.filter((p) => p.product.toString() !== productId);
        return await cart.save();
    }

    async updateCart(cartId, updatedProducts) {
        const objectId = new mongoose.Types.ObjectId(cartId);
        const cart = await CartModel.findById(objectId);
        
        if (!cart) {
            return null;
        }

        cart.products = updatedProducts.map((p) => ({
            product: new mongoose.Types.ObjectId(p.product),
            quantity: p.quantity,
        }));

        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const cart = await CartModel.findById(cartObjectId);
        
        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
        if (productIndex === -1) {
            return null;
        }

        cart.products[productIndex].quantity = quantity;
        return await cart.save();
    }

    async deleteCart(cartId) {
        const objectId = new mongoose.Types.ObjectId(cartId);
        const cart = await CartModel.findById(objectId);
        
        if (!cart) {
            return null;
        }

        cart.products = [];
        return await cart.save();
    }
}

export default CartDao;