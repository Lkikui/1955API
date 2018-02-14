/* ---------- modules ---------- */
//express
var express = require('express');
var app = express();

//mongoose
var mongoose = require('mongoose');

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//path
var path = require('path');

/* ---------- database ---------- */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/1955_API');

var personSchema = new mongoose.Schema ({
    name: {type: String, required: true, minlength: 2}
});
mongoose.model('Person', personSchema);
var Person = mongoose.model('Person');

/* ---------- routes ---------- */
//renders api data
app.get('/', function(req, res){
    Person.find({}, function(err, people){
        if(err){
            console.log('ERROR: could not fetch results');
        } else {
            console.log('result fetch successful');
            res.send(people);
        }
    })
});

//adds a person to the database
app.get('/new/:name', function(req, res){
    var person = new Person({name: req.params.name});
    person.save(function(err){
        if(err){
            console.log('something went wrong');
            res.send({errors: person.err});
        } else {
            console.log(`successfully added ${req.params.name}`);
            res.redirect('/');
        }
    })
});

//removes a person from the database
app.get('/remove/:name', function(req, res){
    console.log('initiating removal');
    Person.remove({name: req.params.name}, function(err, people){
        if(err){
            console.log('Error: unable to delete');
        } else {
            console.log(`successfully removed ${req.params.name}`);
        }
    })
    res.redirect('/');
});

//brings up particular person
app.get('/:name', function(req,res){
    console.log(`fetching ${req.params.name}`);
    Person.find({name: req.params.name}, function(err, person){
        if(err){
            console.log('ERROR: unable to fetch person');
        } else {
            console.log(`successfully fetched ${req.params.name}!`);
            res.send(person);
        }
    })
});

/* ---------- port ---------- */
app.listen(8000, function(){
    console.log("1955API Project listening on port 8000");
})