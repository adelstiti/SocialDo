const express = require("express");
const {signup,signin,signout,forgotPassword,resetPassword,socialLogin} = require('../controllers/auth')
const {userById} = require('../controllers/user')
const validatorMiddleware = require('../validator')
const {check} = require('express-validator');

const router = express.Router();

router.post("/social-login", socialLogin); 

// password forgot and reset routes
router.put("/forgot-password",
[
    check('email','Please enter a Valid Email').isEmail(),

],validatorMiddleware,forgotPassword);

router.put("/reset-password",
[
    check('newPassword','Password Is Required').not().isEmpty(),
    check('newPassword')
    .isLength({min : 6}).withMessage('Please Enter a password with 6 or More charcters')
    .matches(/\d/).withMessage('Password must contain a number')
],validatorMiddleware, resetPassword);

router.post("/signup",
[
    check('name','Name Is Required').not().isEmpty(),
    check('email','Please enter a Valid Email').isEmail(),
    check('password')
    .isLength({min : 6}).withMessage('Please Enter a password with 6 or More charcters')
    .matches(/\d/).withMessage('Password must contain a number')
],validatorMiddleware,signup);

router.post("/signin",signin)
router.get("/signout",signout);

// any route containing :userid , our app will first excute userbyID()
router.param("userId",userById);

module.exports = router