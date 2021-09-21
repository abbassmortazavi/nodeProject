const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const adminRoutes = require('./routes/admin');
const adminShop = require('./routes/shop');
const path = require('path');
const expressHbs = require('express-handlebars');
//const db = require('./utils/database');
const sequelize = require('./utils/database');
const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-item');
const Order = require('./model/order');
const OrderItem = require('./model/order-item');


const app = express();
const errorController = require('./controllers/error');



// app.engine(
//     "hbs",
//     expressHbs({
//       extname: "hbs",
//       defaultLayout: 'main-layout',
//       layoutsDir: "views/layouts/"
//     })
//   );

// app.set('view engine' , 'hbs');
// app.set('views' , 'views');


app.set('view engine' , 'ejs');
app.set('views' , 'views');

app.use(bodyparser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));

app.use((req , res , next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user = user;
        next();
    }).catch(err=>{
        console.log(err);
    });
});

//route
app.use('/admin',adminRoutes);
app.use(adminShop);



//404 page
// app.use((req , res , next)=>{
//     res.render('404' , {pageTitle: "404 Page"})
// });


app.use(errorController.get404Page);

const server = http.createServer(app);


Product.belongsTo(User , {constraints: true , onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product , {through: CartItem});
Product.belongsToMany(Cart , {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , {through: OrderItem});

sequelize
.sync()
//.sync({force: true})
.then((result) => {
    return User.findByPk(1);
}).then(user=>{
    if(!user){
        return User.create({name: 'Abbass' , email: 'abbassMOrtazavi@gmail.com'})
    }
    return user;
}).then(user=>{
    //console.log(user);
    return user.createCart();
}).then(cart=>{
    server.listen(3000);
}).catch((err) => {
    console.log(err);
});


