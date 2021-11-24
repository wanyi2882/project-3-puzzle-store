const cartDataLayer = require('../dal/cart');

// Retrieve all cart items under user
async function getShoppingCart(userId) {
    return await cartDataLayer.getCart(userId);
}

// Add cart item to cart
async function addItemToCart(userId, puzzleId) {
    try {
        let cartItem = await cartDataLayer.getCartItemByPuzzleAndUser(userId, puzzleId);

        // Check if the user has already added the puzzle to the cart
        if (cartItem) {
            // Increase quantity by 1 if exist in cart (update)
            await cartDataLayer.updateQuantity(userId, puzzleId, cartItem.get('quantity') + 1);
            return true;
        } else {
            // Create new cart detail if does not exist yet
            await cartDataLayer.createCartDetail(userId, puzzleId, 1);
            return true;
        }
    } catch (e) {
        return false
    }
}

// Update quantity inside cart
async function updateQuantityInCart(userId, puzzleId, newQuantity) {
    if (newQuantity > 0) {
        await cartDataLayer.updateQuantity(userId, puzzleId, newQuantity);
        return true;
    } else {
        return false;
    }
}

// Remove item from cart
async function removeFromCart(userId, puzzleId) {
    await cartDataLayer.removeFromCart(userId, puzzleId);
    return true;
}

module.exports = { getShoppingCart, addItemToCart, updateQuantityInCart, removeFromCart }
