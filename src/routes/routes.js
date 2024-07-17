import express from 'express';
import passport from 'passport';
import ProductManager from '../services/productManager.js';
import CartManager from '../services/cartManager.js';
import MessageManager from '../services/messageManager.js';
import { ProductModel } from '../dao/MongoDB/products.model.js';
import { CartModel } from '../dao/MongoDB/carts.model.js';
import { UserModel } from '../dao/MongoDB/User.model.js';
import bcrypt from 'bcrypt';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

router.get('/complete-registration', (req, res) => {
    res.render('complete-registration', { user: req.user });
  });
  
  router.post('/complete-registration', async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await UserModel.findById(req.user.id);
      user.name = name;
      user.email = email;
      await user.save();
      res.redirect('/productos');
    } catch (err) {
      console.error('Error al completar el registro:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

// Registro de usuario
router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/login',
    failureRedirect: '/register'
}));

// Inicio de sesión
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Autenticación con GitHub
router.get('/auth/github', passport.authenticate('github'));

router.get('/users/profile-github', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirigir al usuario a la página de completar registro si es necesario
    if (!req.user.name || !req.user.email) {
      return res.redirect('/complete-registration');
    }
    // Si no, redirigir a la página principal
    res.redirect('/api/productos');
  }
);

async function getUserData(sessionUserId) {
    try {
        const user = sessionUserId ? await UserModel.findById(sessionUserId).select('-password') : null;
        return user;
    } catch (error) {
        throw new Error('Error al obtener los datos del usuario: ' + error.message);
    }
}

router.get('/productos', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    try {
        // Obtener los datos del usuario
        const user = await getUserData(req.session.user?.id);

        // Obtener la lista de productos
        const result = await productManager.getProducts(limit, page, sort, query);
        res.render('productsPagination', { user, products: result.payload });
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


router.get('/products', async (req, res) => {
    const { limit, page, sort, query, category } = req.query;
    try {
        const response = await productManager.getProducts(limit, page, sort, query, category);
        if (response.payload.length === 0) {
            return res.status(404).json({ error: 'Página no encontrada' });
        }
        res.json(response);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
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
        res.render('productDetails', { product });
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
    const id = req.params.pid;
    try {
        const updated = await productManager.updateProduct(id, updatedProduct);
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updated);
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/products/:pid', async (req, res) => {
    const id = req.params.pid;
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

// Cambia la ruta de 'carts' a 'carritos'
router.get('/carritos/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Crea una nueva ruta 'carts' que devuelva el JSON de los carritos por ID
router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (err) {
        console.error('Error al obtener los carritos:', err);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

router.put('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al actualizar el carrito:', err);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

router.put('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const product = cart.products.find(p => p.id === pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error al obtener el producto del carrito:', err);
        res.status(500).json({ error: 'Error al obtener el producto del carrito' });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await cartManager.deleteCart(cartId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
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

router.get('/register', (req, res) => {
    res.render('register');
  });


  router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario es el administrador predefinido
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            req.session.user = {
                id: 'adminId', // ID ficticio para el administrador
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                role: 'admin'
            };
            return res.status(200).json({ message: 'Inicio de sesión exitoso como administrador' });
        }

        // Verificar en la base de datos para usuarios regulares
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: 'usuario' // Asignar el rol de usuario por defecto
        };

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
  
  // Ruta para cerrar sesión
//   router.post('/logout', (req, res) => {
//     req.session.destroy();
//     res.status(200).json({ message: 'Sesión cerrada correctamente' });
//   });

  // routes/routes.js

router.post('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        else { console.error('cerrar sesion');
        res.redirect('/login');
    }
    });
});

  
  // Ruta para obtener los datos del usuario autenticado
  router.get('/profile', isAuthenticated, (req, res) => {
    const user = req.session.user;
    res.json(user);
  });

  router.get('/profile', isAuthenticated, (req, res) => {
    if (req.user) {
        res.json({
            name: req.user.name,
            email: req.user.email,
            githubId: req.user.githubId
        });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});
  
  // Ruta protegida para administradores
  router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.json({ message: 'Área de administrador' });
  });

export default router;