const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../utils/path');
const adminController = require('../controllers/admin');


router.get('/add-product' , adminController.getAddProduct);
router.get('/products' , adminController.getProducts);
router.post('/add-product' , adminController.addProduct);
// router.post('/delete-product' , adminController.deleteProduct);
module.exports = router;
// exports.routes = router;
// exports.products = products;