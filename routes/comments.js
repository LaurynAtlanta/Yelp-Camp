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
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

//edit comment route
router.get('/campgrounds/:id/comments/:comment_id/edit', function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else{
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//update comment route
router.put('/campgrounds/:id/comments/:comment_id', function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back')
        } else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    })
})

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