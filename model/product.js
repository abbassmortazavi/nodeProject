const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product' , productSchema);




// const mongodb = require('mongodb');
// const getDb = require('../utils/database').getDb;

// class Product{
//     constructor(title, price, description, imgUrl) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imgUrl = imgUrl;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('products')
//             .insertOne(this)
//             .then(result => {
//                 console.log(result);
//             }).catch(error => {
//                 console.log(error);
//             });
//     }
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 return products;
//             }).catch(error => {
//                 console.log(error);
//             });
//     }
//     static productDetail(id) {
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id: new mongodb.ObjectId(id) })
//             .next()
//             .then(product => {
//                 return product;
//             }).catch(error => {
//                 console.log(error);
//             });
//     }
// }
// module.exports = Product;