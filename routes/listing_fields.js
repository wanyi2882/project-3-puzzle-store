const express = require('express')
const router = express.Router();

// Import in the Puzzle model
const { Theme, Size, AgeGroup, DifficultyLevel, Material, Tag, Frame } = require('../models')

// Import Middleware
const { checkIfAuthenticatedAdminAndManager } = require('../middlewares');

// Display all Listing Fields
router.get('/', [checkIfAuthenticatedAdminAndManager], async function (req, res) {
    let field = ["theme", "age group"]

    res.render('listing_fields/index', {
        fields: field
    })
})

// Get Theme Field
router.get('/theme', [checkIfAuthenticatedAdminAndManager], async function (req, res) {

    let getThemesField = await Theme.collection().fetch()

    res.render('listing_fields/view', {
        title: "theme",
        fields: getThemesField.toJSON()
    })
})

// Create New Theme
router.get('/theme/create', [checkIfAuthenticatedAdminAndManager], async function (req, res) {
    res.render('listing_fields/create', {
        title: "theme"
    })
})

// Process New Theme
router.post('/theme/create', [checkIfAuthenticatedAdminAndManager], async function (req, res) {
    let theme = new Theme({"name": req.body.theme})
    theme.save()

    // Success Flash Message
    req.flash("success_messages", `New theme ${req.body.theme} has been created`)

    res.redirect('/listing_fields/theme');
})

// Update Theme
router.get('/theme/:theme_id/update', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    const theme = await Theme.where({
        id: req.params.theme_id
    }).fetch({
        require: true
    })

    res.render('listing_fields/update', {
        title: "theme",
        field: theme.toJSON()
    })
})

// Process Update Theme
router.post('/theme/:theme_id/update', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    const theme = await Theme.where({
        id: req.params.theme_id
    }).fetch({
        require: true
    })

    theme.set({
        "name": req.body.theme
    })
    theme.save()

    // Success Flash Message
    req.flash("success_messages", `Theme ID ${req.params.theme_id} has been updated`)

    res.redirect('/listing_fields/theme');

})

// Delete Theme
router.get('/theme/:theme_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    const theme = await Theme.where({
        id: req.params.theme_id
    }).fetch({
        require: true
    })

    res.render('listing_fields/delete', {
        title: "theme",
        field: theme.toJSON()
    })
})

// Process Delete Theme
router.post('/theme/:theme_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    const theme = await Theme.where({
        id: req.params.theme_id
    }).fetch({
        require: true
    })
    req.flash("success_messages", `${theme.get('name')} has been deleted`)

    await theme.destroy()
    res.redirect('/listing_fields/theme')

})

module.exports = router;