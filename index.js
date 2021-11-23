const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// For sessions and flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

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

// Set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

// Set up flash messages
app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

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