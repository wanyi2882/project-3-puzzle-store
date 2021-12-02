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

// Process update quantity in cart
router.post('/quantity/update', [checkIfAuthenticatedJWT], async function (req, res) {
    let status = await cartServices.updateQuantityInCart(
        req.user.id,
        req.body.puzzle_id,
        req.body.newQuantity
    );
    if (status) {
        res.send(status);
    } else {
        res.send(status);
    }
});

// Process remove from cart
router.post('/remove', [checkIfAuthenticatedJWT], async function (req, res) {
    let status = await cartServices.removeFromCart(
        req.user.id, 
        req.body.puzzle_id
    )

    if (status) {
        res.send(status);
    } else {
        res.send(status);
    }
})

module.exports = router;