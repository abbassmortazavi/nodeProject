const express = require('express');
const path = require('path');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const rootDir = require('../utils/path');
const adminController = require('../controllers/admin');


router.get('/add-product' , isAuth , adminController.getAddProduct);
router.get('/products' , isAuth , adminController.getProducts);
router.post('/add-product' , isAuth , adminController.addProduct);
// router.post('/delete-product' , adminController.deleteProduct);
module.exports = router;
// exports.routes = router;
// exports.products = products;