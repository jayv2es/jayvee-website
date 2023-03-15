const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const structure = require('../../public/assets/models/structure.js')
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
const createStructure = async () => {
    await structure.create({
        "indexTitle": "HI THERE!",
        "indexIntro": "Welcome to my personal website! Feel free to explore my work or to get to know me better on my profile page. Peace!",
        "indexMenu": [{
            "divisonTitle": "PROFILE",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisonTitle": "STUDIES",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisonTitle": "CREATIVE",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisonTitle": "CONTACT",
            "divisionIntro": "",
            "divisionMenu": []
        }]
    });
    console.log("New structure created successfully!");
};

createStructure();