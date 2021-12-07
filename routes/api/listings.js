const express = require('express')
const router = express.Router();

// Import getAllPuzzles from DAL
const productDataLayer = require('../../dal/listings')

const { Puzzle } = require('../../models')

// Get all puzzles
// Search and filter
router.get('/', async (req, res) => {

    try {

        let keyword = req.query.keyword;
        let min_cost = req.query.min_cost;
        let max_cost = req.query.max_cost;
        let size = req.query.size;
        let difficulty_level = req.query.difficulty_level;
        let age_group = req.query.age_group;
        let material = req.query.material;
        let brand = req.query.brand;
        let theme = req.query.theme;
        let tags = req.query.tags;
        let frames = req.query.frames;

        // create a query that is the eqv. of "SELECT * FROM products WHERE 1"
        // this query is deferred because we never call fetch on it.
        // we have to execute it by calling fetch on the query
        let query = Puzzle.collection();

        // Find by Title or Description
        if (keyword) {
            query
            .where(keyword => keyword.where('title', 'like', `%${keyword}%`)
            .orWhere('description', 'like', `%${keyword}%`))
        }

        // Find by min and/or max cost
        if (min_cost) {
            query.where('cost', '>=', min_cost);
        }

        if (max_cost) {
            query.where('cost', '<=', max_cost);
        }

        // Find by Size
        if (size) {
            let selectedSize = size.split(",");
            query.where('size_id', 'in', selectedSize);
        }

        // Find by Difficulty Level
        if (difficulty_level) {
            let selectedLevel = difficulty_level.split(",")
            query.where('difficulty_level_id', 'in', selectedLevel)
        }

        // Find by Age Group
        if (age_group) {
            let selectedAge = age_group.split(",")
            query.where('age_group_id', 'in', selectedAge)
        }

        // Find by material
        if (material) {
            let selectedMaterial = material.split(",")
            query.where('material_id', 'in', selectedMaterial)
        }

        // Find by Brand Name
        if (brand) {
            query.where('brand', 'like', `%${brand}%`)
        }

        // Find by Theme
        if (theme) {
            query.where('theme', '=', theme)
        }

        // If tags is not empty
        if (tags) {
            let selectedTags = tags.split(',');
            query.query('join', 'puzzles_tags', 'puzzles.id', 'puzzle_id')
                .where('tag_id', 'in', selectedTags);
        }

        // If Frames is not empty
        if (frames) {
            let selectedFrames = frames.split(',');
            query.query('join', 'frames_puzzles', 'puzzles.id', 'puzzle_id')
                .where('frame_id', 'in', selectedFrames);
        }

        let listings = await query.fetch({
            withRelated: ['Theme', 'Size', 'AgeGroup', 'DifficultyLevel', 'Material', 'Tag', 'Frame']
        })

        res.status(200);
        res.send(listings);
    } catch (e) {
        res.status(500);
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})


module.exports = router;