let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');
let middleware = require('../middleware');

//THIS IS THE ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing');
});

//THIS GETS THE SIGN UP REGISTRATION PAGE
router.get('/register', function(req, res){
    res.render('register');
})

//THIS IS THE POST FOR THE REGISTER THAT AUTHENTICATES AND REDIRECTS
router.post('/register', function(req, res){
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.render('register');
        } else{
            passport.authenticate('local')(req,res,function(){
                req.flash('success', 'Welcome to yelp camp ' + user.username);
                res.redirect('/campgrounds');
            })
        }
    })
})

//THIS IS THE FORM FOR THE LOGIN
router.get('/login', function(req, res){
    res.render('login');
})

//THIS CHECKS THE LOGIN WITH THE DATABASE AND DIRECTS ACCORDINGLY
router.post('/login',passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
    
});

// THIS IS THE LOGOUT ROUTE
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Logged you out!");
    res.redirect('/campgrounds');
})


module.exports=router;