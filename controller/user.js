const CampGround = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('user/register');
}

module.exports.register = async(req,res)=>{
    try {
        const {email,username,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }    
}

module.exports.renderLogin = (req,res)=>{
    res.render('user/login');
}

module.exports.login = async(req,res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/campgrounds');
}

module.exports.logout =(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}