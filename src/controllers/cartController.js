import CartService from '../services/cartService.js';

const cartService = new CartService();

class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (err) {
            console.error('Error en el controlador al crear el carrito:', err);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();
            res.json(carts);
        } catch (err) {
            console.error('Error en el controlador al obtener los carritos:', err);
            res.status(500).json({ error: 'Error al obtener los carritos' });
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (err) {
            console.error('Error en el controlador al obtener el carrito:', err);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.addProductToCart(cid, pid, quantity, req.user.email, req.user.role);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
            res.json(updatedCart);
        } catch (err) {
            console.error('Error en el controlador al agregar el producto al carrito:', err);
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    }

    async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;
        try {
            const updatedCart = await cartService.deleteProductFromCart(cid, pid);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
            res.json(updatedCart);
        } catch (err) {
            console.error('Error en el controlador al eliminar el producto del carrito:', err);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartService.updateCart(cartId, updatedProducts);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (err) {
            console.error('Error en el controlador al actualizar el carrito:', err);
            res.status(500).json({ error: 'Error al actualizar el carrito' });
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
            res.json(updatedCart);
        } catch (err) {
            console.error('Error en el controlador al actualizar la cantidad del producto:', err);
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
        }
    }

    async deleteCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartService.deleteCart(cartId);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (err) {
            console.error('Error en el controlador al vaciar el carrito:', err);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    }
}

export default CartController;