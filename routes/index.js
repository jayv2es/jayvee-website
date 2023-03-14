// This is a routing for a given subpage
// It gets called by a request to /subpage

const express = require('express');
const router = express.Router()

// Instead of app.get we use router.get, using the router object from the express lib
router.get("/", (req,res) => {
    //Do something
    //e.g. render an .ejs file
    res.render('index')
})

// Export router object to the app (import as "require(./routes/subpage)")
module.exports = router;