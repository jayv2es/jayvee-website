const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const structure = require('../../models/structure.js')
dotenv.config();

// Set up default mongoose connection on localhost
var mongoDB = "mongodb+srv://joelvonarburg:aKjZhzwhDt2HHBEc@jvwebsitecluster.i40poy2.mongodb.net/jayvee-website?retryWrites=true&w=majority";
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
            "divisionTitle": "PROFILE",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisionTitle": "STUDIES",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisionTitle": "CREATIVE",
            "divisionIntro": "",
            "divisionMenu": []
        },{
            "divisionTitle": "CONTACT",
            "divisionIntro": "",
            "divisionMenu": []
        }]
    });
    console.log("New structure created successfully!");
};

createStructure();