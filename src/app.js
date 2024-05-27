import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/routes.js';
import mongoose from 'mongoose';
import ProductManager from './services/productManager.js';
import MessageManager from './services/messageManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageManager = new MessageManager();

const productManager = new ProductManager();

const DB_URL = 'mongodb+srv://lordchingzo:coderhouse@product.n09ozpk.mongodb.net/ecommerce?retryWrites=true&w=majority';

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use('/api', router);

app.get('/api/realtimeproducts', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Real-Time Products',
            products: allProducts,
        });
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).send('Error al obtener los productos');
    }
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = new Server(server);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    try {
        const messages = await messageManager.getMessages();
        socket.emit('loadMessages', messages);

        // Obtener la lista inicial de productos y emitirla al cliente
        const allProducts = await productManager.getProducts();
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

    // Escuchar el evento 'nuevoProducto' desde el cliente
    socket.on('nuevoProducto', async (data) => {
        try {
            await productManager.addProduct(data);
            const allProducts = await productManager.getProducts();
            io.emit('actualizarLista', allProducts);
        } catch (err) {
            console.error('Error al agregar el producto:', err);
        }
    });

    // Escuchar el evento 'eliminarProducto' desde el cliente
    socket.on('eliminarProducto', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const allProducts = await productManager.getProducts();
            io.emit('actualizarLista', allProducts);
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

mongoose.connect(DB_URL)
    .then(() => console.log('Conexión establecida con MongoDB'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));