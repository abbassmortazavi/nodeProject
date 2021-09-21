const db = require('../utils/database1');
const products = [];
module.exports = class Product {
    constructor(title , price , description , imgUrl) {
        this.title = title,
        this.imgUrl = imgUrl,
        this.description = description,
        this.price = price
    }
    save (){
        return db.execute('INSERT INTO products (title , price , description , imgUrl) values (?,?,?,?)' , 
        [this.title , this.price , this.description , this.imgUrl]);
    }
    static fetchAll(){
        return db.execute('SELECT * FROM products');
    }
    static findById(id){
        return db.execute('SELECT * FROM products WHERE id = ?', [id])
    }
};