const express = require('express');
const router = express.Router();

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const cartServices = require('../services/cart')

const { OrderStatus } = require("../models")
const orderDataLayer = require("../dal/order")

// Display checkout route
router.get('/', async function (req, res) {
    // Retrieve all items from user shopping cart
    let items = await cartServices.getShoppingCart(req.session.user.id)
    let allCartItems = []
    let metadata = []

    for (let item of items) {
        // Individual Cart Item object
        const cartItem = {
            'name': item.related('puzzle').get('title'),
            'amount': item.related('puzzle').get('cost'),
            ['images']: [item.related('puzzle').get('image')],
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }

        // Store individual cart item object inside allCartItems Array
        allCartItems.push(cartItem)

        // Create object that remembers for a given puzzle id how many was ordered
        // And push it into metadata
        metadata.push({
            'user_id': req.session.user.id,
            'puzzle_id': item.related('puzzle').get('id'),
            'quantity': item.get('quantity'),
            'price': item.related('puzzle').get('cost')
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
    res.render('checkout/index', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

// Post route for Stripe payment (Called by STRIPE)
router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
    let payload = req.body

    let endpoint_secret = process.env.STRIPE_ENDPOINT_SECRET

    // Extract the signature header
    let sigHeader = req.headers['stripe-signature']

    // Verify that the signature is actually from stripe
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpoint_secret)
        if (event.type == "checkout.session.completed") {
            let stripeSession = event.data.object
            console.log(stripeSession)
            let metadata = JSON.parse(stripeSession.metadata.orders);
            let paymentStatus = stripeSession.payment_status

            let status = await OrderStatus.where({
                'status': paymentStatus
            }).fetch({
                'require': false
            })

            let shippingAddress = stripeSession.shipping.name + "," 
            + stripeSession.shipping.address.line1 + "," 
            + stripeSession.shipping.address.line2 + "," 
            + stripeSession.shipping.address.country + " "
            + stripeSession.shipping.address.postal_code
            let statusId = status.id
            let createDateTime = new Date()
            let updateDateTime = new Date()
            let totalCost = stripeSession.amount_total
            let userId = metadata[0].user_id
        
            let order_id = await orderDataLayer.createOrder(shippingAddress, statusId, createDateTime, updateDateTime, totalCost, userId)

            // Create order details
            await metadata.map(async eachOrderDetail => {
                let individualCost = eachOrderDetail.price
                let quantity = eachOrderDetail.quantity
                let createDateTime =  new Date()
                let orderId = order_id
                let puzzleId = eachOrderDetail.puzzle_id

                await orderDataLayer.createOrderDetail(individualCost, quantity, createDateTime, orderId, puzzleId)
            })

            res.send({
                'received': true
            })
        }
    } catch (e) {
        res.send({
            'error': e.message
        })
        console.log(e.message)
    }
})

// Payment Success route
router.get('/success', function (req, res) {
    res.send("Thank your order. Your order has been processed");
})

// Payment failed route
router.get('/cancel', function (req, res) {
    res.send("Your order has failed or has been cancelled");
})

module.exports = router;