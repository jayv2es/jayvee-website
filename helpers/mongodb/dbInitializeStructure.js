const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const structure = require('../../models/structure.js')
dotenv.config()

// Set up default mongoose connection on localhost
var mongoDB = process.env.MONGODB_CONNECT_HTTPENCODE;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// CREATES A NEW STRUCTURE ON THE MONGODB
structure.create({
    
})
