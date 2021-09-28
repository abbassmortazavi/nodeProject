const express = require('express');
const {body , check} = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth');




router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignUp);
router.post('/signup',
    body('email').isEmail().withMessage('Email is not valid!!') , 
    body('password').isLength({ min: 3 , max: 5}).withMessage('Password must be 5 charecters and Numbers'),
    body('confirmPassword').custom((value , {req})=>{
        if (value !== req.body.password) {
            throw new Error('Password Have to match');
        }
        return true;
    })

, authController.postSignUp);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/link');
router.get('/reset/:token' , authController.getNewPassword);
router.post('/new-password' , authController.postNewPassword);


module.exports = router;