let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose =require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local')
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');


//looks for yelpcamp or creates it
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() =>console.log('Connected to Db!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));
app.set('view engine', 'ejs');
seedDB();


//passport configuration
app.use(require('express-session')({
    secret: 'Once again charlotte is cute',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    next();
})


//routes
app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{ //send them to campgrounds.ejs file
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

app.post('/campgrounds', function(req, res){
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

app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//SHOW shows more info about one campground
//campgrounds/any single word. 
app.get('/campgrounds/:id', function(req, res){
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

//========================================
// COMMENTS ROUTES
//========================================

app.get('/campgrounds/:id/comments/new',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {campground: foundCampground});
        }
    })
});

app.post('/campgrounds/:id/comments/',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});


//Auth routes
app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
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

//login form
app.get('/login', function(req, res){
    res.render('login');
})

app.post('/login',passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
});

//logout route
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}


app.listen(3000, function(){
    console.log('Yelp camp server is running');
})