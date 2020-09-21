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

let campgrounds = [
    {name: 'Salmon Creek', image:'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Rowing Seasons', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Robery Downey Lake', image:'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Salmon Creek', image:'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Rowing Seasons', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Robery Downey Lake', image:'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Salmon Creek', image:'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Rowing Seasons', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Robery Downey Lake', image:'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350'}
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let newcampground= {name:name, image:image};
    campgrounds.push(newcampground);
    res.redirect('/campgrounds');
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

app.listen(3000, function(){
    console.log('Yelp camp server is running');
})