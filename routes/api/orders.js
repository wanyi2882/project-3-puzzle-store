const express = require('express');
const router = express.Router();

// Import Middleware
const { checkIfAuthenticatedJWT } = require('../../middlewares');

const { Order, OrderStatus } = require("../../models");

const orderDataLayer = require("../../dal/order");

// Display all orders of user
router.get('/', [checkIfAuthenticatedJWT], async function (req, res) {
    let userId = req.user.id
    let userOrders = await orderDataLayer.userGetOrder(userId);
    res.status(200);
    res.send(userOrders);
})

// Display order details of each order
router.get('/:order_id/details', [checkIfAuthenticatedJWT], async function (req, res) {
    let orderDetail = await orderDataLayer.adminGetOrderDetails(req.params.order_id);
    res.status(200);
    res.send(orderDetail);
})


module.exports = router;