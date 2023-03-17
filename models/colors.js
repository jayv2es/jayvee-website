/* Schema for MongoDB
Cluster name: JVWebsiteCluster
Database name: jayvee_website
Collection name: colors
*/

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var rgbSchema = new Schema({
  red: Number,
  green: Number,
  blue: Number,
});

var colorScheme = new Schema({
  themeName: String, // How many images next to each other
  BackgroundColor: rgbSchema, // Which position in split
  ContentColor: rgbSchema,
  FirstColor: rgbSchema,
  SecondColor: rgbSchema,
  ThirdColor: rgbSchema,
  FourthColor: rgbSchema,
});

module.exports = mongoose.model("colors", colorScheme);
