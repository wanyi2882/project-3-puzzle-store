const { CartDetail } = require("../models")

// Retrieve items in cart belonging to specific user
async function getCart(userId) {
    return await CartDetail.collection().where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['puzzle']
    })
}

// Create one cart item
async function createCartDetail(userId, puzzleId, quantity) {
    let cartDetail = new CartDetail({
        'user_id': userId,
        'puzzle_id': puzzleId,
        'quantity': quantity    
    })

    await cartDetail.save()
    return cartDetail
}

// Check if item already exists in user's cart
async function getCartItemByPuzzleAndUser(userId, puzzleId) {
    return await CartDetail.where({
        'user_id': userId,
        'puzzle_id': puzzleId
    }).fetch({
        require: false
    })
}

// Update quantity in the cart
async function updateQuantity(userId, puzzleId, newQuantity) {
    
    let cartDetail = await getCartItemByPuzzleAndUser(userId, puzzleId)

    cartDetail.set('quantity', newQuantity);
    await cartDetail.save();
}

// Remove item from cart
async function removeFromCart (userId, puzzleId) {
    let cartDetail = await getCartItemByPuzzleAndUser(userId, puzzleId)

    await cartDetail.destroy()
}

module.exports = { getCart, getCartItemByPuzzleAndUser, createCartDetail, removeFromCart, updateQuantity }