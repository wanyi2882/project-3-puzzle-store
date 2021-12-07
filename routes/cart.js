const express = require('express');
const router = express.Router();

// Import cart in services
const cartServices = require('../services/cart');

// Import Middleware
const { checkIfAuthenticatedAdmin } = require('../middlewares');

// Display all items in the cart
router.get('/', [checkIfAuthenticatedAdmin], async function (req, res) {
    let userId = req.session.user.id;
    let cartDetails = await cartServices.getShoppingCart(userId);
    res.render('cart/index', {
        'cartDetails': cartDetails.toJSON()
    })
})

// Add item to cart
router.get('/:puzzle_id/add', [checkIfAuthenticatedAdmin], async function (req, res) {
    let userId = req.session.user.id;
    let puzzleId = req.params.puzzle_id;

    let status = await cartServices.addItemToCart(userId, puzzleId);
    if (status) {
        req.flash("success_messages", "Item successfully added to cart");
        res.redirect('/listings');
    } else {
        req.flash("error_messages", "Failed to add item to shopping cart");
        res.redirect('/listings');
    }
})

// Process update quantity in cart
router.post('/:puzzle_id/quantity/update', [checkIfAuthenticatedAdmin], async function (req, res) {
    let status = await cartServices.updateQuantityInCart(req.session.user.id,
        req.params.puzzle_id,
        req.body.newQuantity
    );
    if (status) {
        req.flash("success_messages", "Product quantity has been updated");
    } else {
        req.flash("error_messages", "Failed to update product quantity");
    }
    res.redirect('/cart');
});

// Remove item from cart
router.post('/:puzzle_id/remove', [checkIfAuthenticatedAdmin], async function (req, res) {
    let status = await cartServices.removeFromCart(req.session.user.id, req.params.puzzle_id)

    if (status) {
        req.flash("success_messages", "Item has been successfully removed");
    } else {
        req.flash("error_messages", "Failed to delete item");
    }

    res.redirect('/cart');
})

module.exports = router;