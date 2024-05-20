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

const productManager = new ProductManager(); // Crear una instancia de ProductManager


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
        const allProducts = await productManager.getProducts(); // Llamar al método getProducts en la instancia
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
        const messages = await messageManager.getMessages(); // Usar el método del manager
        socket.emit('loadMessages', messages);
    } catch (err) {
        console.error('Error al obtener los mensajes:', err);
    }

    socket.on('chatMessage', async (data) => {
        try {
            const newMessage = await messageManager.addMessage(data); // Usar el método del manager
            io.emit('newMessage', newMessage);
        } catch (err) {
            console.error('Error al agregar el mensaje:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

mongoose.connect(DB_URL)
    .then(() => console.log('Conexión establecida con MongoDB'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));
