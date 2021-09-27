const bcrypt = require('bcryptjs');
const User = require('../model/user');
const crypto = require('crypto');
const user = require('../model/user');
exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login' , {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
};
exports.postLogin = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({email:email})
        .then(user=>{
            console.log(user);
            if (!user){
                req.flash('error' , 'Invalid email or password...');
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
                    }
                    req.flash('error' , 'Invalid password...');
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
        path: '/signup',
        errorMessage: req.flash('error')
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
                req.flash('error' , 'User exists...');
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

exports.getReset = (req , res , next) =>{
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset',{
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    });
};
exports.postReset = (req , res , next)=>{
    let email = req.body.email;
    crypto.randomBytes(32,(err , buf)=>{
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buf.toString('hex');
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                req.flash('error' , 'No Account with this Email');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result=>{
            let url = `http://localhost:3000/reset/${token}`;
            res.render('auth/passwordLink',{
                pageTitle: 'Reset Password',
                path: '/link',
                urlLink: url 
            });
        }).catch(err=>{
            console.log(err);
        });

    });
}
exports.getNewPassword = (req , res , next)=>{
    let token = req.params.token;
    User.findOne({resetToken:token , resetTokenExpiration: {$gt: Date.now()}})
    .then((user) => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        }else{
            message = null;
        }
        res.render('auth/new-password' , {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            token: token
        });
    }).catch((err) => {
        console.log(err);
    });
}
exports.postNewPassword = (req , res , next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.token;

    let resetUser;
    User.findOne({resetToken: token , resetTokenExpiration: {$gt: Date.now()} , _id: userId})
    .then((user) => {
        resetUser = user;
        return bcrypt.hash(newPassword , 12);
    }).then(hashPassword=>{
        resetUser.password = hashPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = null;
        return resetUser.save();
    }).then(result=>{
        res.redirect('/login');
    }).catch((err) => {
        console.log(err);
    });

};