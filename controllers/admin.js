const Product = require('../model/product');

exports.getAddProduct = (req , res , next)=>{
    res.render('admin/add-product' , {path:'/admin/add-product' ,
        pageTitle:'Insert Product' ,
        activeProduct: true

    });
};

exports.addProduct = (req , res , next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const data = {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user._id
    };
    const product = new Product(data);
    product.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req , res , next)=>{
    Product.find({userId:req.user._id})
        // .select('title description price -_id')=>fetch without id
        .select('title description price')
        .populate('userId' , 'name')
        .then(result => {
        console.log(result);
        res.render('admin/products' , {
            products: result ,
            pageTitle: 'Admin Products' ,
            path: '/admin/products'
        });
    }).catch(err=>{
        console.log(err);
    });
};
exports.deleteProduct = (req , res , next)=>{
    const id = req.body.id;
    Product.destroy({where: {id:id}});
    res.redirect('/admin/products');
};
