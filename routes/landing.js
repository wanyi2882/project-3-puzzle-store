// #1 Require in express and create express router
const express = require("express");
const router = express.Router(); 

// #2 Add new route to express router
router.get('/', (req,res)=>{
    res.render('landing/index')
})

// #3 Export router
module.exports = router; 