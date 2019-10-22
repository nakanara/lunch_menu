// server.js

var express    = require('express');
var app        = express();
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
const config = require('./config.json');


var MONGO_DB_URI = config['test']['MONGODB_URI'];

// Database
mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGO_DB, {useMongoClient: true});
const dbconfig = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_DB_URI, dbconfig);
var db = mongoose.connection;
db.once('open', function () {
   console.log('DB connected!');
});
db.on('error', function (err) {
  console.log('DB ERROR:', err);
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) { //1
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

app.set("view engine","ejs"); // 1
app.use(express.static(__dirname + '/public'));

// 2
app.get("/hello", function(req,res){
  res.render("hello", {name:req.query.nameQuery});
}); 

// 3
app.get("/hello/:nameParam", function(req,res){ 
  res.render("hello", {name:req.params.nameParam});
});

// API
app.use('/api/heroes', require('./api/heroes'));
// API
app.use('/api/lunch_menu', require('./api/lunch_menu'));


// Server
var port = 3000;
app.listen(port, function(){
  console.log('listening on port:' + port);
});