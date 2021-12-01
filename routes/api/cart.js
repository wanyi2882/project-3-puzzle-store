const express = require('express');
const router = express.Router();

const { checkIfAuthenticatedJWT } = require('../../middlewares');

// Import cart in services
const cartServices = require('../../services/cart');

// Display all items in the cart
router.get('/', [checkIfAuthenticatedJWT], async function (req, res) {
    let userId = req.user.id
    res.send(await cartServices.getShoppingCart(userId))
})

// Add item to cart
router.get('/add', [checkIfAuthenticatedJWT], async function (req, res) {

    let userId = req.user.id
    let puzzleId = req.query.puzzle_id

    let status = await cartServices.addItemToCart(userId, puzzleId);
    if (status) {
        res.send(status);
    } else {
        res.send(status);
    }
})
module.exports = router;