const express = require("express");
const router = express.Router();

// Import in the User model
const { AdminUser } = require('../models');

// Import in forms
const { createAdminRegistrationForm, bootstrapField, createAdminLoginForm } = require('../forms');

// Create Hash Password
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// Display admin registration form
router.get('/register', (req, res) => {

    // Display the admin registration form
    const adminRegisterForm = createAdminRegistrationForm();

    res.render('admin_users/register', {
        'adminRegisterForm': adminRegisterForm.toHTML(bootstrapField)
    })
})

// Process admin registration form
router.post('/register', (req, res) => {

    // Fetch the admin registration form
    const adminRegisterForm = createAdminRegistrationForm();

    adminRegisterForm.handle(req, {
        'success': async (form) => {
            let admin_user = new AdminUser({
                'username': form.data.username,
                'email': form.data.email,
                'password': getHashedPassword(form.data.password)
            })

            await admin_user.save()
            req.flash('success_messages', "Admin user Successfully created.")
            res.redirect("/admin/login")
        },
        'error': (form) => {
            res.render('admin_users/register', {
                'adminRegisterForm': form.toHTML(bootstrapField)
            })
        }
    })
})

// Create Login Page
router.get('/login', (req,res)=>{
    const adminLoginForm = createAdminLoginForm();

    res.render('admin_users/login',{
        'adminLoginForm': adminLoginForm.toHTML(bootstrapField)
    })
})

// Process Login and compare password at Login
router.post('/login', (req, res) => {
    const adminLoginForm = createAdminLoginForm();

    adminLoginForm.handle(req, {
        'success': async(form) => {
            // Fetch admin user by email
            let admin_user = await AdminUser.where({
                'email': form.data.email
            }).fetch({
                'require': false
            })

            // If admin user exists, check if password matches
            if(admin_user) {
                if(admin_user.get('password') == getHashedPassword(form.data.password)) {
                    // Proceed to login
                    req.session.admin_user = {
                        'id': admin_user.get('id'),
                        'email': admin_user.get('email'),
                        'username': admin_user.get('username')
                    }

                    req.flash("success_messages", `Welcome back ${admin_user.get('username')} !`)

                    res.redirect('/admin/profile');
                }
                else {
                    // Login has failed when password mis match
                    req.flash('error_messages', 'Login failed')
                    res.redirect('/admin/login')
                }
            }
            else {
                // Login has failed when user does not exist
                req.flash('error_messages', 'Login failed')
                res.redirect('/admin/login')
            }
        },
        'error': (form) => {
            res.render('admin_users/login', {
                'adminLoginForm': form.toHTML(bootstrapField)
            })
        }
    })
})

// Display Profile page
router.get('/profile', (req, res) => {
    res.render('admin_users/profile', {
        admin_user: req.session.admin_user
    })
})



module.exports = router;