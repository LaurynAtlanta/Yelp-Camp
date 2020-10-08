let Campground = require('../models/campground');
let Comment = require('../models/comment');

//ALL MIDDLEWARE GOES HERE
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error', 'Campground not found');
                console.log(err);
                res.redirect('back')
                }else{
                    //does user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash('error', 'You dont have permission to do that');
                        res.redirect('back');
                    }
                }
        });
    } else{
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', 'Comment not found');
                console.log(err);
                res.redirect('back')
                }else{
                    //does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){ //use equals because its a mongo id
                        next();
                    }else{
                        req.flash('error', 'You dont have permission to do that');
                        res.redirect('back');
                    }
                }
        });
    } else{
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

//MIDDLEWARE
//THIS CHECKS IF THE USER IS LOGGED IN
middlewareObj.isLoggedIn = function(req, res, next){ //putting this in both comments and index.js
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'Please login first!')
        res.redirect('/login');
    }
}


//EXPORT THE MIDDLEWARE
module.exports = middlewareObj;