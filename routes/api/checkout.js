const express = require('express');
const router = express.Router();

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const cartServices = require('../../services/cart')

// STRIPE checkout route
router.post('/create-checkout-session', async function (req, res) {
    // Retrieve all items from user shopping cart
    let userId = req.body.userId

    let items = await cartServices.getShoppingCart(userId)
    let allCartItems = []
    let metadata = []

    for (let item of items) {
        // Individual Cart Item object
        const cartItem = {
            'name': item.related('Puzzle').get('title'),
            'amount': item.related('Puzzle').get('cost'),
            ['images']: [item.related('Puzzle').get('image')],
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }

        // Store individual cart item object inside allCartItems Array
        allCartItems.push(cartItem)

        // Create object that remembers for a given puzzle id how many was ordered
        // And push it into metadata
        metadata.push({
            'user_id': userId,
            'puzzle_id': item.related('Puzzle').get('id'),
            'quantity': item.get('quantity'),
            'price': item.related('Puzzle').get('cost')
        })
    }

    // Create stripe payment session (session id will be sent to user)
    // Convert metadata array to a json string (As required by Stripe)
    let metadataJSON = JSON.stringify(metadata)

    let payment = {
        'payment_method_types': ['card'],
        'shipping_address_collection': {
            allowed_countries: ['SG'],
        },
        'line_items': allCartItems,
        'success_url': process.env.STRIPE_SUCCESS_URL,
        'cancel_url': process.env.STRIPE_CANCEL_URL,
        'metadata': {
            'orders': metadataJSON
        }
    }
    // 3. register the session with stripe
    let stripeSession = await Stripe.checkout.sessions.create(payment);

    // 4. send back to the browser the id of the session
    res.redirect(303, stripeSession.url);

})

module.exports = router;