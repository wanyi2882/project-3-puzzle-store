// Middleware to check if user is login before they can view page

const jwt = require('jsonwebtoken');

const checkIfAuthenticated = (req, res, next) => {

    if (req.session.user) {
        next();
    } else {
        req.flash('error_messages', 'You need to sign in to access this page');
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedJWT = (req,res,next) => {
    // Try to get authorization headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err,user)=>{
            if (err) {
                res.sendStatus(403);
            } else {
                // Store the current logged in user inside req.user
                req.user = user;
                next();
            }
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { checkIfAuthenticated, checkIfAuthenticatedJWT }