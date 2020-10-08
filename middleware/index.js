let Campground = require('../models/campground');
let Comment = require('../models/comment');

//ALL MIDDLEWARE GOES HERE
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect('back')
                }else{
                    //does user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }else{
                        res.redirect('back');
                    }
                }
        });
    } else{
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect('back')
                }else{
                    //does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){ //use equals because its a mongo id
                        next();
                    }else{
                        res.redirect('back');
                    }
                }
        });
    } else{
        res.redirect('back');
    }
}

//MIDDLEWARE
//THIS CHECKS IF THE USER IS LOGGED IN
middlewareObj.isLoggedIn = function(req, res, next){ //putting this in both comments and index.js
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}


//EXPORT THE MIDDLEWARE
module.exports = middlewareObj;