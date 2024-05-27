import express from 'express';
import ProductManager from '../services/productManager.js';
import CartManager from '../services/cartManager.js';
import MessageManager from '../services/messageManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

// Rutas para productos
router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;

    try {
        const products = await productManager.getProducts(limit, skip, sort, query);
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const payload = products;
        const response = {
            status: 'success',
            payload,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `http://localhost:8080/api/products?page=${page - 1}&limit=${limit}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/api/products?page=${page + 1}&limit=${limit}` : null,
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


router.post('/products', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/products/:pid', async (req, res) => {
    const updatedProduct = req.body;
    const id = req.params.pid; // Mantener el ID como una cadena (string)
    try {
        const updated = await productManager.updateProduct(id, updatedProduct);
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updated); // Respondemos con el producto actualizado
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


router.delete('/products/:pid', async (req, res) => {
    const id = req.params.pid; // Mantener el ID como una cadena (string)
    try {
        const deleted = await productManager.deleteProduct(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


// Rutas para carritos
router.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});



router.put('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});


router.put('/carts/:cid', async (req, res) => {
    const updatedCartData = req.body;
    const cartId = req.params.cid;
    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedCartData);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const deletedCart = await cartManager.deleteCart(cartId);
        if (!deletedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado' });
    } catch (err) {
        console.error('Error al eliminar el carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});


router.delete('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al eliminar el producto del carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});




// Eliminar un producto específico de un carrito
router.delete('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al eliminar el producto del carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar un carrito con un arreglo de productos
router.put('/carts/:cid', async (req, res) => {
    const updatedCartData = req.body;
    const cartId = req.params.cid;
    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedCartData);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Actualizar la cantidad de un producto en un carrito
router.put('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar todos los productos de un carrito
router.delete('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const deletedCart = await cartManager.deleteCart(cartId);
        if (!deletedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado' });
    } catch (err) {
        console.error('Error al eliminar el carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});











router.get('/api/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// router.get('/realtimeproducts', (req, res) => {
//     res.render('realTimeProducts');
// });



// Rutas para chat
router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await messageManager.getMessages();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
});

router.post('/messages', async (req, res) => {
    const messageData = req.body;
    try {
        const newMessage = await messageManager.addMessage(messageData);
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el mensaje' });
    }
});


export default router;