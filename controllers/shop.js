
const Product = require('../model/product');
// const Order = require('../model/order');

exports.getIndex = (req , res , next)=>{
    Product.find()
    .then(result=>{
        res.render('shop/productList' , {
            products: result ,
            pageTitle: 'Shop Me' ,
            path: '/'
        });
    }).catch(err=>{
        console.log(err);
    });
   
    
};

exports.getProducts = (req , res , next)=>{
    Product.find({userId:req.user._id})
        .then(result => {
        res.render('shop/productList' , {
            products: result ,
            pageTitle: 'Shop Me' ,
            path: '/'
        });
    }).catch(err=>{
        console.log(err);
    });
};

exports.getProductDetail = (req , res , next) =>{
    const id = req.params.id;
    Product.findById(id)
    .then(result => {
            console.log(result);
            res.render('shop/product-detail', {
                pageTitle: 'Product Detail',
                path: '/product-detail',
                product: result
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getCart = (req , res , next)=>{
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart' , {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
};

exports.postCart = (req,res,next)=>{
    const productId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user
    .getCart()
    .then(cart=>{
        fetchCart = cart;
        return cart.getProducts({where: {id:productId}});
    }).then(products=>{
        let product;
        if(products.length > 0){
            product = products[0];
        }
       if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
       }
       return Product.findByPk(productId)
    }).then(product=>{
            return fetchCart.addProduct(product , {
                through: { 
                    quantity: newQuantity 
                }
            });
       }).then(()=>{
        res.redirect('/cart');
    }).catch(err=>{
        console.log(err);
    });
};

exports.deleteCart = (req , res , next)=>{
    const productId = req.body.productId;
    req.user
    .getCart()
    .then(cart=>{
        return cart.getProducts({ where: { id: productId } });
    }).then(products=>{
        const product = products[0];
        return product.cartItem.destroy();
    }).then(result=>{
        res.redirect('/cart');
    }).catch(err=>{
        console.log(err);
    });
};

exports.getCheckout = (req , res , next)=>{
    res.render('shop/checkout' , {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include : ['products']})
        .then(orders => {
            console.log(orders);
            res.render('shop/order', {
                pageTitle: 'Orders Page',
                path: '/orders',
                orders:orders
            });
        }).catch(err => {
            console.log(err);
        });
    
};

exports.postOrder = (req, res, next) => {
    let fetchCart;
    req.user
    .getCart()
        .then(cart => {
            fetchCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder().then(order=>{
            return order.addProducts(products.map(product=>{
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
            }));
        }).catch(err=>{
            console.log(err);
        });
    }).then(result => {
        return fetchCart.setProducts(null);
    }).then(result => {
        res.redirect('/orders');
    }).catch(err=>{
        console.log(err);
    });
};

