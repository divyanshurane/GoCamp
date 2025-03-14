const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controller/user');

router.get('/',(req,res)=>{
    res.send('User Page');
})

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchAsync(users.login))

router.get('/logout', users.logout); 

module.exports = router;