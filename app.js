let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let campgrounds = [
    {name: 'Salmon Creek', image:'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&h=350'},
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