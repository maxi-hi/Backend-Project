const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints para las vistas
app.get('/', (req, res) => {
    res.render('home', { title: 'Home', products: [] }); // Aquí deberías pasar la lista de productos reales
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Real-Time Products', products: [] }); // Aquí también
});

// Manejo de websockets
io.on('connection', (socket) => {
    console.log('a user connected');

    // Enviar lista de productos actualizada
    socket.emit('updateProducts', { products: [] }); // Aquí también

    socket.on('newProduct', (product) => {
        // Lógica para añadir producto a la lista
        // Luego emitir el evento para actualizar la lista
        io.emit('updateProducts', { products: [] }); // Aquí también
    });

    socket.on('deleteProduct', (productId) => {
        // Lógica para eliminar producto de la lista
        // Luego emitir el evento para actualizar la lista
        io.emit('updateProducts', { products: [] }); // Aquí también
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
