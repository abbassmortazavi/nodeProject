exports.get404Page = (req , res , next)=>{
    res.render('shop/404Page', {
        pageTitle: '404',
        path: ['/', '/products', '/cart', '/admin/add-product', '/orders'],
        isAuthenticated: req.isLoggedIn
    });
};
