const bcrypt = require('bcryptjs');
const User = require('../model/user');
exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login' , {
        path: '/login',
        pageTitle: 'Login'
    });
};
exports.postLogin = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({email:email})
        .then(user=>{
            console.log(user);
            if (!user){
                return res.redirect('/login');
            }
            bcrypt.compare(password , user.password)
                .then(doMatch=>{
                    if (doMatch){
                        req.session.isLoggedIn=true;
                        req.session.user = user;
                        return req.session.save(err=>{
                             res.redirect('/');
                        });
                            res.redirect('/');
                    }
                     res.redirect('/login');
                }).catch(err=>{
                    console.log(err);
                return res.redirect('/login');
            });
        }).catch(err=>{
            console.log(err);
    });
};

exports.postLogout = (req , res , next)=>{
   req.session.destroy(err=>{
       console.log(err);
       res.redirect('/');
   });
};

exports.getSignUp = (req , res , next)=>{
    res.render('auth/signup' , {
        pageTitle: 'Sign Up',
        path: '/signup'
    });
};
exports.postSignUp = (req , res , next)=>{
    const password = req.body.password;
    const email = req.body.email;
    const cart = {item:[]};
    const passwordConfirm = req.body.passwordConfirm;

    User.findOne({email:req.body.email})
        .then(userExist=>{
            if (userExist){
                return res.redirect('/signup');
            }
            //create User
            return bcrypt.hash(password , 12)
                .then(hashPassword=>{
                const user = new User({
                    email:email,
                    password:hashPassword,
                    cart:cart
                });
                user.save();
        })
    }).then(user=>{
            res.redirect('/login');
    }).catch(err=>{
            console.log(err);
    });

};