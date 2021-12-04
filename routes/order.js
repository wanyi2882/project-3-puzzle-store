const express = require('express');
const router = express.Router();

const { Order, OrderStatus } = require("../models")

const orderDataLayer = require("../dal/order")

// Display all orders
router.get('/', async function (req, res) {
    let allOrders = await orderDataLayer.adminGetOrder();
    res.render('orders/index', {
        'allOrders': allOrders.toJSON()
    })
})

module.exports = router;