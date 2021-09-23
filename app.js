const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const adminRoutes = require('./routes/admin');
const adminShop = require('./routes/shop');
const path = require('path');
const expressHbs = require('express-handlebars');
// const mongoConnect = require('./utils/database').mongoConnect;
const mongoose = require('mongoose');
const User = require('./model/user');


const app = express();
const errorController = require('./controllers/error');





app.set('view engine' , 'ejs');
app.set('views' , 'views');

app.use(bodyparser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));

app.use((req, res, next) => {
    User.findById('614c141adca040697ef8c158')
        .then((user) => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
        });
    
});

//route
app.use('/admin',adminRoutes);
app.use(adminShop);


app.use(errorController.get404Page);

//mongo connect 
// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose.connect('mongodb://localhost:27017/complete-node', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected');
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Abbass',
                        email: 'abbassMortazavi@gmail.com',
                        cart: {
                            items: []
                        }
                    });;
                    user.save();
                }
            }).catch(error => {
                console.log(error);
            });
        
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });



