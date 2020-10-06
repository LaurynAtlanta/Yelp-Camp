let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');

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
            console.log(err);
            return res.render('register');
        } else{
            passport.authenticate('local')(req,res,function(){
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
    res.redirect('/campgrounds');
})

//MIDDLEWARE
//THIS CHECKS IF THE USER IS LOGGED IN 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}


module.exports=router;