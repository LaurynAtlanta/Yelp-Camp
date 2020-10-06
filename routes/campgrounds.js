let express = require('express');
let router = express.Router();
let Campground=require('../models/campground');


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
router.post('/campgrounds', function(req, res){
       //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newcampground= {name:name, image:image, description:description};
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

//NEW CAMPGROUNDS PAGE
router.get('/campgrounds/new', function(req, res){
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
    })
});

module.exports=router;
