const express = require("express");
const router = express.Router();

// Import Middleware
const { checkIfAuthenticatedAdminAndManager } = require('../middlewares');

// Import in the Puzzle model
const { Puzzle, Theme, Size, AgeGroup, DifficultyLevel, Material, Tag, Frame } = require('../models')

// Import in Listing DAL
const { getAllPuzzles, getThemes, getSizes, getAgeGroups, getDifficultyLevels, getMaterials, getTags, getFrames } = require('../dal/listings')

// Import in Order DAL
const { getOrderByPuzzleId } = require('../dal/order')

//import in Cart DAL
const { getCartByPuzzleId } = require('../dal/cart')

// Import in the Forms
const { bootstrapField, createPuzzleForm, createSearchListingForm } = require('../forms');

router.get('/', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    const themes = await getThemes()
    const sizes = await getSizes()
    const age_groups = await getAgeGroups()
    const difficulty_levels = await getDifficultyLevels()
    const materials = await getMaterials()

    let searchForm = createSearchListingForm(themes, sizes, age_groups, difficulty_levels, materials);

    searchForm.handle(req, {
        'empty': async (form) => {
            let listings = await getAllPuzzles()

            res.render('listings/index', {
                'listings': listings.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            let query = Puzzle.collection();

            if (form.data.title) {
                // add a where clause to its back
                query.where('title', 'like', `%${form.data.title}%`);
            }

            if (form.data.min_cost) {
                query.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost) {
                query.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.stock) {
                query.where('stock', '<=', form.data.stock);
            }

            if (form.data.theme_id) {
                query.where('theme_id', '=', form.data.theme_id);
            }

            if (form.data.size_id) {
                query.where('size_id', '=', form.data.size_id);
            }

            if (form.data.age_group_id) {
                query.where('age_group_id', '=', form.data.age_group_id);
            }

            if (form.data.difficulty_level_id) {
                query.where('difficulty_level_id', '=', form.data.difficulty_level_id)
            }

            if (form.data.material_id) {
                query.where('material_id', '=', form.data.material_id)
            }
            // execute the query
            let listings = await query.fetch({
                withRelated: ['Theme', 'Size', 'AgeGroup', 'DifficultyLevel', 'Material', 'Tag', 'Frame']
            });

            res.render('listings/index', {
                'listings': listings.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let listings = await getAllPuzzles()

            res.render('listings/index', {
                'listings': listings.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        }
    })
})

// Displaying Create Form
router.get('/create', [checkIfAuthenticatedAdminAndManager], async (req, res) => {
    const themes = await getThemes()
    const sizes = await getSizes()
    const age_groups = await getAgeGroups()
    const difficulty_levels = await getDifficultyLevels()
    const materials = await getMaterials()
    const tags = await getTags()
    const frames = await getFrames()

    const puzzleForm = createPuzzleForm(themes, sizes, age_groups, difficulty_levels, materials, tags, frames);

    res.render('listings/create', {
        'form': puzzleForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

// Process Submitted form
router.post('/create', [checkIfAuthenticatedAdminAndManager], async (req, res) => {
    const themes = await getThemes()
    const sizes = await getSizes()
    const age_groups = await getAgeGroups()
    const difficulty_levels = await getDifficultyLevels()
    const materials = await getMaterials()
    const tags = await getTags()
    const frames = await getFrames()

    const puzzleForm = createPuzzleForm(themes, sizes, age_groups, difficulty_levels, materials, tags, frames);

    puzzleForm.handle(req, {
        'success': async (form) => {
            // Seperate out tags and frames
            let { tags, frames, ...puzzleData } = form.data

            // Save data into a new puzzle instance
            const puzzle = new Puzzle(puzzleData)
            await puzzle.save()

            // Save many to many relationships
            if (tags) {
                await puzzle.Tag().attach(tags.split(","));
            }

            if (frames) {
                await puzzle.Frame().attach(frames.split(","));
            }

            // Success Flash Message
            req.flash("success_messages", `New Product ${puzzle.get('title')} has been created`)

            res.redirect('/listings');
        },
        'error': async (form) => {
            res.render('listings/create', {
                'form': form.toHTML(bootstrapField),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

// Get update form
router.get('/:listing_id/update', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch the data to update
    const listing = await Puzzle.where({
        id: req.params.listing_id
    }).fetch({
        require: true,
        withRelated: ['Tag', 'Frame']
    })

    // Fetch all the tables related to Puzzle
    const themes = await getThemes()
    const sizes = await getSizes()
    const age_groups = await getAgeGroups()
    const difficulty_levels = await getDifficultyLevels()
    const materials = await getMaterials()
    const tags = await getTags()
    const frames = await getFrames()

    const puzzleForm = createPuzzleForm(themes, sizes, age_groups, difficulty_levels, materials, tags, frames);

    // Fill in the existing values
    puzzleForm.fields.title.value = listing.get('title')
    puzzleForm.fields.cost.value = listing.get('cost')
    puzzleForm.fields.description.value = listing.get('description')
    puzzleForm.fields.stock.value = listing.get('stock')
    puzzleForm.fields.length.value = listing.get('length')
    puzzleForm.fields.breadth.value = listing.get('breadth')
    puzzleForm.fields.brand.value = listing.get('brand')
    puzzleForm.fields.theme_id.value = listing.get('theme_id')
    puzzleForm.fields.size_id.value = listing.get('size_id')
    puzzleForm.fields.age_group_id.value = listing.get('age_group_id');
    puzzleForm.fields.difficulty_level_id.value = listing.get('difficulty_level_id');
    puzzleForm.fields.material_id.value = listing.get('material_id');
    puzzleForm.fields.image.value = listing.get('image')

    // Fill in the multi-select for the tags
    let selectedTags = await listing.related('Tag').pluck('id');
    puzzleForm.fields.tags.value = selectedTags;

    let selectedFrames = await listing.related('Frame').pluck('id');
    puzzleForm.fields.frames.value = selectedFrames;

    res.render('listings/update', {
        'form': puzzleForm.toHTML(bootstrapField),
        'listing': listing.toJSON(),
        // 2 - send to the HBS file the cloudinary information
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

// Process update form
router.post('/:listing_id/update', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch the data to update
    const listing = await Puzzle.where({
        id: req.params.listing_id
    }).fetch({
        require: true,
        withRelated: ['Tag', 'Frame']
    })

    // Fetch all the tables related to Puzzle
    const themes = await getThemes()
    const sizes = await getSizes()
    const age_groups = await getAgeGroups()
    const difficulty_levels = await getDifficultyLevels()
    const materials = await getMaterials()
    const tags = await getTags()
    const frames = await getFrames()

    // Process the Form
    const puzzleForm = createPuzzleForm(themes, sizes, age_groups, difficulty_levels, materials, tags, frames);
    puzzleForm.handle(req, {
        'success': async (form) => {

            // Seperate out tags and frames
            let { tags, frames, ...puzzleData } = form.data;
            listing.set(puzzleData);
            listing.save();

            // Update Tags
            let tagIds = tags.split(",");
            let existingTagIds = await listing.related('Tag').pluck('id');

            // Remove all the tags that aren't selected anymore
            let tagsToRemove = existingTagIds.filter(id => tagIds.includes(id) == false);
            await listing.Tag().detach(tagsToRemove);

            // Add in all the tags selected in the form
            await listing.Tag().attach(tagIds);

            // Update Frames
            let frameIds = frames.split(",")
            let existingFrameIds = await listing.related("Frame").pluck('id');

            // Remove all the frames that are not selected anymore
            let framesToRemove = existingFrameIds.filter(id => frameIds.includes(id) == false);
            await listing.Frame().detach(framesToRemove)

            // Add in all the frames selected in the form
            await listing.Frame().attach(frameIds)

            // Success Flash Message
            req.flash("success_messages", `Puzzle ${listing.get('title')} has been updated`)

            res.redirect('/listings')
        },
        'error': async (form) => {
            res.render('listings/update', {
                'form': form.toHTML(bootstrapField),
                'listing': listing.toJSON()
            })
        }
    })
})

// Delete a listing
router.get('/:listing_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch the data to delete
    const listing = await Puzzle.where({
        id: req.params.listing_id
    }).fetch({
        require: true
    })

    res.render('listings/delete', {
        'listing': listing.toJSON()
    })
})

// Process delete listing
router.post('/:listing_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch data to delete
    const listing = await Puzzle.where({
        id: req.params.listing_id
    }).fetch({
        require: true
    })

    // check if puzzle exists in shopping cart and orders
    const existInCart = await getCartByPuzzleId(req.params.listing_id)

    const existInOrder = await getOrderByPuzzleId(req.params.listing_id)

    if (!existInCart && !existInOrder) {
        // Success Flash Message (Does not exist)
        req.flash("success_messages", `${listing.get('title')} has been deleted`)

        await listing.destroy()
        res.redirect('/listings')
    } else {
        // Error Flash Message (Exist so cannot delete)
        req.flash("error_messages", `${listing.get('title')} cannot be deleted`)
        res.redirect('/listings');
    }
})

module.exports = router;