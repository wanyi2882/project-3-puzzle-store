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
        let min_cost = parseInt(req.query.min_cost) * 100;
        let max_cost = parseInt(req.query.max_cost) * 100;
        let size = req.query.size;
        let difficulty_level = req.query.difficulty_level;
        let age_group = req.query.age_group;
        let theme = req.query.theme;
        let tags = req.query.tags;

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

        // Find by Theme
        if (theme) {
            let selectedTheme = theme.split(",")
            query.where('theme_id', 'in', selectedTheme)
        }

        // If tags is not empty
        if (tags) {
            let selectedTags = tags.split(',');
            query.query('join', 'puzzles_tags', 'puzzles.id', 'puzzle_id')
                .where('tag_id', 'in', selectedTags);
        }

        let listings = await query.fetch({
            withRelated: ['Theme', 'Size', 'AgeGroup', 'DifficultyLevel', 'Material', 'Tag']
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

// Get Themes Table API Route
router.get('/get_themes', async (req, res) => {
    try {
        let themes = await productDataLayer.getThemes();
        res.status(200);
        res.send(themes)
    }
    catch (e) {
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

// Get Themes Table API Route
router.get('/get_difficulty_levels', async (req, res) => {
    try {
        let levels = await productDataLayer.getDifficultyLevels();
        res.status(200);
        res.send(levels)
    }
    catch (e) {
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

// Get Size Table API Route
router.get('/get_sizes', async (req, res) => {
    try {
        let sizes = await productDataLayer.getSizes();
        res.status(200);
        res.send(sizes)
    }
    catch (e) {
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

// Get Tags Table API Route
router.get('/get_tags', async (req, res) => {
    try {
        let tags = await productDataLayer.getTags();
        res.status(200);
        res.send(tags)
    }
    catch (e) {
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

// Get Age Group Table API Route
router.get('/get_age_groups', async (req, res) => {
    try {
        let ageGroup = await productDataLayer.getAgeGroups();
        res.status(200);
        res.send(ageGroup)
    }
    catch (e) {
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})
module.exports = router;