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
// app.use(csrf());

const csrfInstance = csrf();
app.use(function(req,res,next){

  console.log("Checking for csrf exclusion")

  if (req.url == "/checkout/process_payment" || req.url.slice(0,5) == "/api/" ) {
    // For above url don't perform csrf checks
    next();
  } else {
    // If it is any other routes, then perform csrf check
    csrfInstance(req,res,next);
  }
})

// Global middleware 
// Share CSRF with hbs files
app.use(function(req,res,next){
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
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

// Share the user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

// Import in routes
const cloudinaryRoutes = require('./routes/cloudinary.js')
const landingRoutes = require('./routes/landing');
const listingsRoutes = require('./routes/listings');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')
const orderRoutes = require('./routes/order')

// Import API routes
const api = {
  'listings': require('./routes/api/listings'),
  'users': require('./routes/api/users'),
  'cart': require('./routes/api/cart'),
  'checkout': require('./routes/api/checkout'),
  'orders': require('./routes/api/orders')
}

// Register routes
async function main() {
    app.use('/', landingRoutes);
    app.use('/listings', listingsRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/users', userRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/orders', orderRoutes)
}

//  Register API routes
app.use('/api/listings', express.json(), api.listings)
app.use('/api/users', express.json(), api.users)
app.use('/api/cart', express.json(), api.cart)
app.use('/api/checkout', express.json(), api.checkout)
app.use('/api/orders', express.json(), api.orders)

main();

// Testing port: 3000
// Deployed poert: process.env.PORT
app.listen(3000, () => {
  console.log("Server has started");
});