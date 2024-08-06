const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para leer productos desde el archivo JSON
const getProducts = () => {
    const data = fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf-8');
    return JSON.parse(data);
};

// Ruta para la vista principal
app.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { title: 'Home', products });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    const products = getProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', products });
});

// Manejo de websockets
io.on('connection', (socket) => {
    console.log('a user connected');

    // Enviar lista de productos actualizada
    const products = getProducts();
    socket.emit('updateProducts', { products });

    socket.on('newProduct', (product) => {
        // Lógica para añadir producto a la lista
        const products = getProducts();
        products.push(product);
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
        io.emit('updateProducts', { products });
    });

    socket.on('deleteProduct', (productId) => {
        // Lógica para eliminar producto de la lista
        let products = getProducts();
        products = products.filter(p => p.id !== productId);
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2));
        io.emit('updateProducts', { products });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
