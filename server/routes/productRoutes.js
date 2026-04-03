const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Handles: http://localhost:5001/api/products
router.get('/products', productController.getAllProducts);
router.post('/products', productController.createProduct);

// Handles: http://localhost:5001/api/products/:id
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Handles: http://localhost:5001/api/search?q=xyz
router.get('/search', productController.searchProducts);

module.exports = router;