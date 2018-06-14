//importing modules
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
//var passport = require('passport');

var app = express();

//mongodb links
var MONGODB_URI = "mongodb://neerajnegi:crack1514@ds241869.mlab.com:41869/user-dir";

//importing routes
const user = require('./routes/user');

//connect to MongoDB
mongoose.connect(MONGODB_URI);
// on successful connection
mongoose.connection.on('connected',()=>{
	console.log('Connected to MongoDB @ 27017');
});
//on connection error
mongoose.connection.on('error',(err)=>{
	if(err){
		console.log('Error in DB connection: ' + err);
	}
});

//port no;
const port = process.env.PORT || 3000;

//adding middleware
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));
app.use(bodyparser.json());

//passport
//require('./config/passport');
//app.use(passport.initialize());


//static files
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/', (res, req)=>{
	res.render('index');
});

//routes
app.use('/api/user', user);

app.listen(port,()=>{
	console.log("Server running at port: " + port);
});