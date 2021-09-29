exports.get404Page = (req , res , next)=>{
    res.render('shop/404Page', {
        pageTitle: '404',
        path: ['/', '/products', '/cart', '/admin/add-product', '/orders'],
        isAuthenticated: req.isLoggedIn
    });
};

exports.get500 = (req , res , next)=>{
    res.render('errorPage/500', {
        pageTitle: 'Server Error',
        path: ['/', '/products', '/cart', '/admin/add-product', '/orders'],
        isAuthenticated: req.isLoggedIn
    });
};