import express from 'express';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './dao/passport/passportConfig.js';
import authRoutes from './routes/authRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
// import router from './routes/routes.js';

import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

import viewsRoutes from './routes/viewsRoutes.js';

import mongoose from 'mongoose';
import ProductService from './services/productService.js';
import MessageManager from './services/messageManager.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { isAuthenticated, isAdmin } from './middlewares/auth.middleware.js';
import "dotenv/config";

import logger from './utils/logger.js';

import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageManager = new MessageManager();
const productService = new ProductService();

// Acá se comenta o descomenta dependiendo de si se va a usar la base de datos de QA o de PDN

const DB_URL = process.env.DB_URL;
// const DB_URL = process.env.DB_URL_QA;

const app = express();
const PORT = process.env.PORT || 8080;

// Función de conexión a la base de datos
export const connectDB = async (url = DB_URL) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Conectado a MongoDB');
  } catch (err) {
    logger.error('Error al conectar a MongoDB:', err);
    throw err;
  }
};

app.use('/api/users', userRoutes);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

// app.use('/api', router);

configurePassport();

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/', viewsRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// app.use('/productos', isAuthenticated);
// app.use('/admin', isAuthenticated, isAdmin);

// app.get('/login', (req, res) => {
//     res.render('login');
// });

// app.get('/api/realtimeproducts', async (req, res) => {
//     try {
//         const allProducts = await productService.getProducts(1); 
//         res.render('realTimeProducts', {
//             title: 'Real-Time Products',
//             productos: allProducts,
//         });
//     } catch (err) {
//         console.error('Error al obtener los productos:', err);
//         res.status(500).send('Error al obtener los productos');
//     }
// });

// app.get('/register', (req, res) => {
//     res.render('register');
// });

app.get('/', (req, res) => {
    res.redirect('/login');
  });

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = new Server(server);

let currentPage = 1;
const productsPerPage = 10;

io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    try {
        const messages = await messageManager.getMessages();
        socket.emit('loadMessages', messages);

        const allProducts = await productService.getProducts(productsPerPage, currentPage);
        socket.emit('actualizarLista', allProducts);
    } catch (err) {
        console.error('Error al obtener los mensajes o los productos:', err);
    }

    socket.on('chatMessage', async (data) => {
        try {
            const newMessage = await messageManager.addMessage(data);
            io.emit('newMessage', newMessage);
        } catch (err) {
            console.error('Error al agregar el mensaje:', err);
        }
    });

    socket.on('nuevoProducto', async (data) => {
        try {
            await productService.addProduct(data);
            const allProducts = await productService.getProducts(productsPerPage, currentPage);
            io.emit('actualizarLista', allProducts);
        } catch (err) {
            console.error('Error al agregar el producto:', err);
        }
    });

    socket.on('eliminarProducto', async (productId) => {
        try {
            await productService.deleteProduct(productId);
            const allProducts = await productService.getProducts(productsPerPage, currentPage);
            io.emit('actualizarLista', allProducts);
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
        }
    });

    socket.on('cambiarPagina', async (direccion) => {
        currentPage += direccion;
        currentPage = Math.max(currentPage, 1);
        try {
            const response = await productService.getProducts(productsPerPage, currentPage);
            socket.emit('actualizarLista', response);
        } catch (err) {
            console.error('Error al cambiar de página:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('Conectado a MongoDB'))
.catch((err) => logger.error('Error al conectar a MongoDB:', err));

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Error en el servidor' });
  });

export default app;