/* Schema for MongoDB
Cluster name: JVWebsiteCluster
Database name: jayvee_website
Collection name: structures
*/

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Level 0 = Index page
var index = new Schema({
  indexTitle: String,
  indexIntro: String,
  indexMenu: [divisions], // e.g. [Profile, Studies, ...]
});

// Level 1 = Divisions, e.g. "Creative"
var divisions = new Schema({
  divisionTitle: String,
  divisionIntro: String,
  divisionMenu: [subdivisions], // e.g. [University, Tutoring, ...]
});

// Level 2 = Subdivisions, e.g. "Creative -> Photography"
var subdivisions = new Schema({
  subdivTitle: String,
  subdivArticles: [articles],
  subdivInfobox: infoboxSubdiv,
});

// Level 3 = Articles, e.g. "Creative" -> "Photography" -> "Ticino"
var articles = new Schema({
  articleTitle: String,
  articleIntro: String,
  articleText: [articleText],
  articleDate: Date,
  articleHeaderImage: String, // HowTo: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
  articleAdditionalImages: [articleImage],
  articleInfobox: infoboxArticle,
});

// Article Texts (Each paragraph with subtitle; If no subtitle, only new paragraph)
var articleText = new Schema({
  subtitles: [String],
  paragraphs: [String],
});

// Article Images (not Header image)
var articleImage = new Schema({
  linkToImage: [String],
  caption: [String],
  formatting: [articleImageFormat], // see below
});

// Formatting of article images
var articleImageFormat = new Schema({
  split: Number, // How many images next to each other
  position: Number, // Which position in split
  // Example:
  // articleImageFormat = [3,1] means a formatting of three images next to each other,
  // with the current image placed on the left-most position (2 would be mid, 3 right in the case of split=3)
});

// Infoboxes to be displayed on side of subdivs and articles
var infoboxArticle = new Schema({
  downloads: [String], // Links to DLs
  links: [String], // Links to featured websites
});

var infoboxSubdiv = new Schema({
  // GET CREATIVE
});

module.exports = mongoose.model("index", index);
