//npm i express, express-session, ejs, https, fs, mkcert, express-session-json, cookie-parser, jquery, assert, jquery-ui, compression, dotenv, jquerykeyframes
//npm i -g browserify   (This is to bundle the external JS file which use Node.js functions (e.g. require) so they can be used client-side).
//                      (Use: browserify myscript.js -o bundle.js within the directory where myscript.js is located. The bundle.js can be used in the HTML then.)

/* -------------------------------------------------------------------------------
 --------------------------------- INITIALIZE APP --------------------------------
 ------------------------------------------------------------------------------- */

//Import own functions
const fun = require('./public/assets/functions/functions.js')

//Declare packages used
const $ = require('jquery')
const express = require('express')
const compression = require('compression')
const dotenv = require('dotenv')
const fs = require('fs')
const session = require('express-session')
const ejs = require('ejs')
const assert = require('assert')
const { vary } = require('express/lib/response');
var app = module.exports = express();
const mongoose = require('mongoose');

// Config env variables for development (in production, vars are set in host, e.g. Heroku)
if(process.env.NODE_ENV !== 'production') {
    console.log('Environment is: ' + process.env.NODE_ENV + ' --- Using .env variables...');
    dotenv.config();
}

// Declare port
const port = process.env.PORT || 5000;

// Initialize session
app.use(express.urlencoded());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    })
);
app.set('trust proxy', 1);

// Compress all routes
app.use(compression());

// Serve static files
app.use(express.static('views'));
app.use(express.static('routes'));
app.use(express.static('node_modules'));
app.use('/public', express.static('public'));

// Set ejs as viewing engine
app.set('view engine', 'ejs');

/* -------------------------------------------------------------------------------
 --------------------------- INITIALIZE MONGO DATABASE ---------------------------
 ------------------------------------------------------------------------------- */

 // Set up default mongoose connection on localhost
 var mongoDB = process.env.MONGODB_CONNECT_HTTPENCODE;
 mongoose.connect(mongoDB, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 });
 
 // Get default connection
 var db = mongoose.connection;

 //Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Load structure Schema
const structure = require('models/structure.js');


/* -------------------------------------------------------------------------------
 ------------------------------------ ROUTING ------------------------------------
 ------------------------------------------------------------------------------- */

// Seperate case for landing page GET-req
app.get('/', (req,res) => {
    res.render('index');
})

// Import all routes from the routes-folder (don't forget to export from the corresp. route files)
const indexRoute = require('./routes/index');

// Tell app to use the routes (handle requests GET, POST, ... within the corresp. files)
app.use('/index', indexRoute);


/* -------------------------------------------------------------------------------
 ----------------------------------- LISTENER ------------------------------------
 ------------------------------------------------------------------------------- */
// Use port 80 for HTTP, port 5000 for localhost
app.listen(port, () => {
    console.log('Listening...');
})
