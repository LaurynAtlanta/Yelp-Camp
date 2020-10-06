let express = require('express');
let router = express.Router();
let Comment = require('../models/comment');
let Campground = require('../models/campground');

//THIS THE NEW COMMENTS PAGE
router.get('/campgrounds/:id/comments/new',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {campground: foundCampground});
        }
    })
});

//THIS CREATES THE COMMENTS
router.post('/campgrounds/:id/comments/',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

//MIDDLEWARE
//THIS CHECKS IF THE USER IS LOGGED IN
function isLoggedIn(req, res, next){ //putting this in both comments and index.js
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}


module.exports=router;