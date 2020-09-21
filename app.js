let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose =require('mongoose');
//looks for yelpcamp or creates it
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() =>console.log('Connected to Db!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


//SCHEMA SET UP
let campgroundSchema = new mongoose.Schema({
    name:String,
    image:String
})

let Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//     {
//         name: 'Rowing Seasons', 
//         image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350'
//     }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else{
//         console.log('Newly created campground: ');
//         console.log(campground);
//     }
// });

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{ //send them to campgrounds.ejs file
            res.render('campgrounds', {campgrounds: allCampgrounds});
        }
    });
});

app.post('/campgrounds', function(req, res){
       //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let newcampground= {name:name, image:image};
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
    res.render('new');
});

app.listen(3000, function(){
    console.log('Yelp camp server is running');
})