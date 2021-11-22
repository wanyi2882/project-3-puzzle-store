const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// Create an instance of express app
let app = express();

// Set up the view engine
app.set("view engine", "hbs");

// Set up static folder
app.use(express.static("public"));

// Setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// Enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// Import in routes
const cloudinaryRoutes = require('./routes/cloudinary.js')
const landingRoutes = require('./routes/landing');
const listingsRoutes = require('./routes/listings');

async function main() {
    // Use Landing Routes
    app.use('/', landingRoutes);
    app.use('/listings', listingsRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});