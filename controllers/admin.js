const Product = require('../model/product');

exports.getAddProduct = (req , res , next)=>{
    res.render('admin/add-product' , {path:'/admin/add-product' ,
        pageTitle:'Insert Product' ,
        activeProduct: true,
        errorMessage: null

    });
};

exports.addProduct = (req , res , next)=>{
    const title = req.body.title;
    const imageUrl = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!imageUrl) {
        return res.status(422).render('admin/add-product' ,{
            pageTitle: 'Add Product',
            path: 'admin/add-product',
            errorMessage : 'Attach file is not an image',
            validationErrors: []
        });
    }
    const data = {
        title: title,
        imageUrl: imageUrl.path,
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
            res.redirect('/500');
            console.log(err);
        });
};

exports.getProducts = (req , res , next)=>{
    Product.find({userId:req.user._id})
        // .select('title description price -_id')=>fetch without id
        .select('title description price imageUrl')
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
