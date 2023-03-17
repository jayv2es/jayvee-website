const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('../../models/colors.js')
dotenv.config();

// Set up default mongoose connection on localhost
var mongoDB = process.env.MONGODB_CONNECT_HTTPENCODE;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// CREATES A NEW STRUCTURE ON THE MONGODB
const createColorScheme = async () => {
    await colors.create({
        "themeName": "Light",
        "BackgroundColor": {
            "red": 255,
            "green": 255,
            "blue": 255
        },
        "ContentColor": {
            "red": 0,
            "green": 0,
            "blue": 0
        },
        "FirstColor": {
            "red": 255,
            "green": 0,
            "blue": 0
        },
        "SecondColor": {
            "red": 0,
            "green": 255,
            "blue": 0
        },
        "ThirdColor": {
            "red": 0,
            "green": 0,
            "blue": 255
        },
        "FourthColor": {
            "red": 255,
            "green": 0,
            "blue": 255
        }
    });
    console.log("New color scheme created successfully!");
};

createColorScheme();