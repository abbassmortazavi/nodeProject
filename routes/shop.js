const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/' , shopController.getIndex);
router.get('/products' , shopController.getProducts);
// router.get('/cart' , shopController.getCart);
// router.post('/addCart' , shopController.postCart);
// router.post('/deleteCart' , shopController.deleteCart);
// router.get('/orders' , shopController.getOrders);
// router.post('/create-order' , shopController.postOrder);
// router.get('/checkout' , shopController.getCheckout);
router.get('/product-detail/:id' , shopController.getProductDetail);
module.exports = router;