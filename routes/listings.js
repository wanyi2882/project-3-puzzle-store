const express = require("express");
const router = express.Router();

// #1 import in the Puzzle model
const {  Puzzle, Theme, Size, AgeGroup, DifficultyLevel, Material, Tag, Frame  } = require('../models')

// Import in the Forms
const { bootstrapField, createPuzzleForm } = require('../forms');

router.get('/', async (req, res) => {
    // #2 - fetch all the puzzles (ie, SELECT * from products)
    let puzzles = await Puzzle.collection().fetch();
    res.render('listings/index', {
        'listings': puzzles.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', async (req, res) => {
    const themes = await Theme.fetchAll().map(theme => [theme.get('id'), theme.get('name')])
    const sizes = await Size.fetchAll().map(size => [size.get('id'), size.get('pieces')])
    const age_groups = await AgeGroup.fetchAll().map(age => [age.get('id'), age.get('name')])
    const difficulty_levels = await DifficultyLevel.fetchAll().map(level => [level.get('id'), level.get('name')])
    const materials = await Material.fetchAll().map(material =>[material.get('id'), material.get('type')])
    const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
    const frames = await Frame.fetchAll().map(frame => [frame.get('id'), frame.get('material')])

    const puzzleForm = createPuzzleForm(themes, sizes, age_groups, difficulty_levels, materials, tags, frames);
    res.render('listings/create',{
        'form': puzzleForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

module.exports = router;