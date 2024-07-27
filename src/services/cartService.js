// src/services/cartService.js

import CartDao from '../dao/cartDao.js';

const cartDao = new CartDao();

class CartService {
    async createCart() {
        try {
            return await cartDao.createCart();
        } catch (err) {
            console.error('Error en el servicio al crear el carrito:', err);
            throw err;
        }
    }

    async getCarts() {
        try {
            return await cartDao.getCarts();
        } catch (err) {
            console.error('Error en el servicio al obtener los carritos:', err);
            throw err;
        }
    }

    async getCartById(cartId) {
        try {
            return await cartDao.getCartById(cartId);
        } catch (err) {
            console.error('Error en el servicio al obtener el carrito:', err);
            throw err;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            return await cartDao.addProductToCart(cartId, productId, quantity);
        } catch (err) {
            console.error('Error en el servicio al agregar el producto al carrito:', err);
            throw err;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            return await cartDao.deleteProductFromCart(cartId, productId);
        } catch (err) {
            console.error('Error en el servicio al eliminar el producto del carrito:', err);
            throw err;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            return await cartDao.updateCart(cartId, updatedProducts);
        } catch (err) {
            console.error('Error en el servicio al actualizar el carrito:', err);
            throw err;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await cartDao.updateProductQuantity(cartId, productId, quantity);
        } catch (err) {
            console.error('Error en el servicio al actualizar la cantidad del producto:', err);
            throw err;
        }
    }

    async deleteCart(cartId) {
        try {
            return await cartDao.deleteCart(cartId);
        } catch (err) {
            console.error('Error en el servicio al vaciar el carrito:', err);
            throw err;
        }
    }
}

export default CartService;