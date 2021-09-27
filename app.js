const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const User = require('./model/user');
const flash = require('connect-flash');

const dbConnect = 'mongodb://localhost:27017/complete-node';
const store = new MongoDBStore({
    uri : dbConnect,
    collation: 'sessions'
});

const csrfProtection = csrf();

const app = express();
const errorController = require('./controllers/error');




app.set('view engine' , 'ejs');
app.set('views' , 'views');

const adminRoutes = require('./routes/admin');
const adminShop = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(session({secret: 'my secret' , resave: false , saveUninitialized: false , store:store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
        });
});
// app.use((req, res, next) => {
//     if (!req.session.user) {
//         return next();
//     }
//     User.findById(req.session.user._id)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//route
app.use('/admin',adminRoutes);
app.use(adminShop);
app.use(authRoutes);


app.use(errorController.get404Page);

mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected');
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });



