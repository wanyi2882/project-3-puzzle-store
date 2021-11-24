const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require("cors")
require("dotenv").config();

// Set up CSRF
const csrf = require('csurf')

// For sessions and flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// Create an instance of express app
let app = express();

// Set up the view engine
app.set("view engine", "hbs");

// Use CORS
app.use(cors())

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

// Enable CSRF
app.use(csrf());

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});

// Share CSRF with hbs files
app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

// Set up flash messages
app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// Share the admin user data with hbs files
app.use(function(req,res,next){
  res.locals.admin_user = req.session.admin_user;
  next();
})

// Import in routes
const cloudinaryRoutes = require('./routes/cloudinary.js')
const landingRoutes = require('./routes/landing');
const listingsRoutes = require('./routes/listings');
const adminRoutes = require('./routes/admin_user');

// Import in API routes
const api = {
  'listings': require('./routes/api/listings')
}

// Register routes
async function main() {
    app.use('/', landingRoutes);
    app.use('/listings', listingsRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/admin', adminRoutes)
}

// Register the API routes
app.use('/api/listings', express.json(), api.listings)

main();

app.listen(3000, () => {
  console.log("Server has started");
});