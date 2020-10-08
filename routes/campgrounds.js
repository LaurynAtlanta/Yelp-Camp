let express = require('express');
let router = express.Router();
let Campground=require('../models/campground');
let middleware = require('../middleware');


//CAMPGROUNDS HOME PAGE
router.get('/campgrounds', function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{ //send them to campgrounds.ejs file
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//POST TO HOME PAGE
router.post('/campgrounds',middleware.isLoggedIn, function(req, res){
    //we only move on to this if id logged in is true.
       //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newcampground= {name:name, image:image, description:description, author: author};
    //create a new campground and save to database
    Campground.create(newcampground, function(err, newlycreated){
        if(err){
            console.log(err)
        } else{
            //redirect back to campgrounds page if it worked to see the added campground
            res.redirect('/campgrounds');
        }
    })
});

//CREATE NEW CAMPGROUNDS PAGE
router.get('/campgrounds/new',middleware.isLoggedIn, function(req, res){
    //only passed through if isLoggedIn is true
    res.render('campgrounds/new');
});


//THIS GETS THE SHOW PAGE FOR THE SPECIFIC CAMPGROUNDS
router.get('/campgrounds/:id', function(req, res){
    //FIND CAMPGROUND WITH PROVIDED ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //RENDER SHOW TEMPLATE WITH THAT CAMPGORUND
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get('/campgrounds/:id/edit',middleware.checkCampgroundOwnership, function(req, res){
    //you only get to this code if you passed through checkCampgroundOwnership
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
     });
});

//UPDATE CAMPGROUND ROUTE
router.put('/campgrounds/:id',middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        } else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    })
})
//DELETE CAMPGROUND ROUTE
router.delete('/campgrounds/:id',middleware.checkCampgroundOwnership, function (req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    })
})


module.exports = router;
