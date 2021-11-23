const express = require("express");
const router = express.Router();

// Import in the Puzzle model
const { Puzzle, Theme, Size, AgeGroup, DifficultyLevel, Material, Tag, Frame } = require('../models')

// Import in DAL
const { getThemes, getSizes, getAgeGroups, getDifficultyLevels, getMaterials, getTags, getFrames } = require('../dal/listings')

// Import in the Forms
const { bootstrapField, createPuzzleForm } = require('../forms');

router.get('/', async (req, res) => {
    // #2 - fetch all the puzzles (ie, SELECT * from products)
    let puzzles = await Puzzle.collection().fetch({
        withRelated:['Theme', 'Size', 'AgeGroup', 'DifficultyLevel', 'Material', 'Tag', 'Frame']
    });
    res.render('listings/index', {
        'listings': puzzles.toJSON() // #3 - convert collection to JSON
    })
})

// Displaying Create Form
router.get('/create', async (req, res) => {
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
router.post('/create', async (req, res) => {
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

module.exports = router;