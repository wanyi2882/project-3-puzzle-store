// Middleware to check if user is login before they can view page

const checkIfAuthenticated = (req, res, next) => {

    if (req.session.admin_user) {
        next();
    } else {
        req.flash('error_messages', 'You need to sign in to access this page');
        res.redirect('/admin/login');
    }
}

module.exports = { checkIfAuthenticated }