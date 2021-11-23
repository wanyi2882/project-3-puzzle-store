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
        'form': adminRegisterForm.toHTML(bootstrapField)
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
                adminRegisterForm: form.toHTML(bootstrapField)
            })
        }
    })
})

// Create Login Page
router.get('/login', (req,res)=>{
    const adminLoginForm = createAdminLoginForm();
    res.render('admin_users/login',{
        adminLoginForm: adminLoginForm.toHTML(bootstrapField)
    })
})



module.exports = router;