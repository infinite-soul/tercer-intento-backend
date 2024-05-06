import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import router from './routes/routes.js';
import ProductManager from './services/productManager.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 8080;
const productManager = new ProductManager();

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Configurar socket.io
const io = new Server(server);

// Manejar conexiones de socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar la lista inicial de productos al cliente
    const productos = productManager.getProducts();
    socket.emit('actualizarLista', productos);

    // Escuchar eventos de socket.io
    socket.on('nuevoProducto', (producto) => {
        productManager.addProduct(producto);
        const productos = productManager.getProducts();
        io.emit('actualizarLista', productos);
    });

    socket.on('eliminarProducto', (id) => {
        productManager.deleteProduct(id);
        const productos = productManager.getProducts();
        io.emit('actualizarLista', productos);
    });
});