const fs = require('fs');
const path = require('path');
const cartsPath = path.join(__dirname, '../../data/carts.json');
const productsPath = path.join(__dirname, '../../data/products.json');

const createCart = (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
    const newCart = {
        id: carts.length + 1,
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
    res.json(newCart);
};

const getCartProducts = (req, res) => {
    const { cid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
    const cart = carts.find(c => c.id == cid);
    cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
};

const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const cart = carts.find(c => c.id == cid);
    const product = products.find(p => p.id == pid);

    if (cart && product) {
        const productInCart = cart.products.find(p => p.product == pid);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
        res.json(cart);
    } else {
        res.status(404).json({ error: "El carrito o el producto no fue encontrado" });
    }
};

module.exports = { createCart, getCartProducts, addProductToCart };
