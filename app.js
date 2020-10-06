//REQUIRING PACKAGES
let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose =require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local')
    Campground = require('./models/campground'),
    methodOverride = require('method-override'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

//REQUIRING ROUTES
let commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

//MONGOOSE CONNECTING TO OWN YELPCAMP DATABASE
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser:true,
    useUnifiedTopology:true
}) 
     .then(() =>console.log('Connected to Db!'))
    .catch(error => console.log(error.message));


//THE USE AND SETS
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname +"/public"));
    app.use(methodOverride('_method'));
    app.set('view engine', 'ejs');
    // seedDB(); //Seed the database

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

//THIS USES THE REQUIRED ROUTES CREATED ABOVE
    app.use(indexRoutes);
    app.use(campgroundRoutes);
    app.use(commentRoutes);


//LISTENS ON LOCAL HOST 3000
app.listen(3000, function(){
    console.log('Yelp camp server is running');
})