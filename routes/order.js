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

//Display order details of each order
router.get('/:order_id/details', async function (req, res) {
    let orderDetail = await orderDataLayer.adminGetOrderDetails(req.params.order_id);

    res.render('orders/details', {
        'orderDetails': orderDetail.toJSON()
    })

})

module.exports = router;