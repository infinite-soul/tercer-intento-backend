import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cartsFilePath = path.join(__dirname, '..', '..', 'memory', 'carts.json');

class CartManager {
    constructor() {
        this.carts = [];
        this.lastCartId = 0;
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(cartsFilePath, 'utf-8');
            this.carts = JSON.parse(data);
            this.lastCartId = this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) : 0;
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado, crear uno nuevo
                fs.writeFileSync(cartsFilePath, '[]');
                this.carts = [];
            } else {
                console.error('Error al leer el archivo de carritos:', err);
            }
        }
    }

    saveCarts() {
        try {
            const data = JSON.stringify(this.carts, null, 2);
            fs.writeFileSync(cartsFilePath, data);
        } catch (err) {
            console.error('Error al escribir el archivo de carritos:', err);
        }
    }

    createCart() {
        const newCartId = ++this.lastCartId;
        const newCart = {
            id: newCartId,
            products: [],
        };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(cartId) {
        return this.carts.find((cart) => cart.id === cartId);
    }

    addProductToCart(cartId, product) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            return null;
        }

        const existingProduct = cart.products.find((p) => p.product === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: product.id, quantity: 1 });
        }

        this.saveCarts();
        return cart;
    }
}

export default CartManager;