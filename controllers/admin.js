const Product = require('../model/product');

exports.getAddProduct = (req , res , next)=>{
    res.render('admin/add-product' , {path:'/admin/add-product' ,
     pageTitle:'Insert Product' ,
      activeProduct:true
    });
};

exports.addProduct = (req , res , next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price:price,
        description:description,
    }).then(result=>{
        console.log(result);
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
    // Product.create({
    //     title: title,
    //     imageUrl: imageUrl,
    //     price:price,
    //     description:description,
    //     userId: req.user.id
    // }).then(result=>{
    //     console.log(result);
    //     res.redirect('/admin/products');
    // }).catch(err=>{
    //     console.log(err);
    // });
    
};

exports.getProducts = (req , res , next)=>{
    req.user.getProducts()
    .then(result=>{
        res.render('admin/products' , {
            products: result ,
            pageTitle: 'Admin Products' ,
            path:'/admin/products' ,
        });
    }).catch(err=>{
        console.log(err);
    });
    // Product.findAll()
    //     .then(result=>{
    //         res.render('admin/products' , {
    //             products: result ,
    //             pageTitle: 'Admin Products' ,
    //             path:'/admin/products' ,
    //         });
    //     }).catch(err=>{
    //         console.log(err);
    //     });
//    Product.fetchAll()
//    .then(([rows , fileData]) =>{
//     console.log(rows);
//     res.render('admin/products' , {
//         products: rows ,
//         pageTitle: 'Admin Products' ,
//         path:'/admin/products' ,
//     });
//    }).catch(err=>{
//        console.log(err);
//    });
    
    
};
exports.deleteProduct = (req , res , next)=>{
    const id = req.body.id;
    Product.destroy({where: {id:id}});
    res.redirect('/admin/products');
    // Product.destroy({where: {id:id}})
    // .then(result=>{
    //     const products = Product.findAll();
    //     res.render('admin/products' , {
    //         pageTitle: 'Admin Products' ,
    //         path:'/admin/products' ,
    //         products: products 
    //     });
    // }).catch(err=>{
    //     console.log(err);
    // });
};
