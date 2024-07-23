const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../../data/products.json');

const getProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
};

const getProductById = (req, res) => {
    const { pid } = req.params;
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const product = products.find(p => p.id === pid);
    product ? res.json(product) : res.status(404).json({ error: "Product not found" });
};

const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    products = products.map(product => product.id === pid ? { ...product, ...updateData, id: product.id } : product);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ message: "Producto actualizado" });
};

const deleteProduct = (req, res) => {
    const { pid } = req.params;
    let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    products = products.filter(product => product.id !== pid);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ message: "Producto eliminado" });
};

module.exports = { getProducts, getProductById, updateProduct, deleteProduct };
