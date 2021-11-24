const express = require('express')
const router = express.Router();

// Import getAllPuzzles from DAL
const productDataLayer = require('../../dal/listings')

router.get('/', async(req,res)=>{
    res.send(await productDataLayer.getAllPuzzles())
})

module.exports = router;