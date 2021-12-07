const express = require('express');
const router = express.Router();

// Import Middleware
const { checkIfAuthenticatedAdminAndManager } = require('../middlewares');

const { User, Order, OrderStatus, OrderDetail } = require("../models");

const orderDataLayer = require("../dal/order");
const listingDataLayer = require("../dal/listings")

// Import in the Forms
const { bootstrapField, createUpdateOrderForm, createSearchOrderForm } = require('../forms');

// Display all orders
router.get('/', [checkIfAuthenticatedAdminAndManager], async function (req, res) {

    let status = await orderDataLayer.getOrderStatus()
    let puzzle = await listingDataLayer.getPuzzleIDandTitle()
    let users = await User.fetchAll().map(user => [user.get('id'), user.get('username')])

    let searchForm = createSearchOrderForm(status, puzzle, users);

    searchForm.handle(req, {
        'empty': async (form) => {

            let allOrders = await orderDataLayer.adminGetOrder();

            res.render('orders/index', {
                'allOrders': allOrders.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {

            let status = form.data.order_status_id;
            let puzzle = form.data.puzzle_id;
            let user = form.data.user_id;

            let query = Order.collection();
            let queryOrderDetails = OrderDetail.collection()

            // Find Order Status in Orders Table
            if (status) {
                query.where('order_status_id', '=', status);
            }

            // Find User in Orders Table
            if (user) {
                query.where('user_id', '=', user);
            }

            // Find Puzzle ID in Order Details Table
            if (puzzle) {
                queryOrderDetails.where('puzzle_id', '=', puzzle)
            }

            // Fetch Order Details with matching Puzzle Id
            let orderDetails = await queryOrderDetails.fetch()

            // Set Order ID from order details in an Array
            let orderId = orderDetails.toJSON().map(order => order.order_id)

            // Search for Order Id in Orders Table
            if (orderId) {
                query.where('id', 'in', orderId);
            }

            // Execute all the query
            let allOrders = await query.fetch({
                withRelated: ['OrderStatus']
            });
            res.render('orders/index', {
                'allOrders': allOrders.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {

            let allOrders = await orderDataLayer.adminGetOrder();

            res.render('orders/index', {
                'allOrders': allOrders.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        }
    })
})

// Display order details of each order
router.get('/:order_id/details', [checkIfAuthenticatedAdminAndManager], async function (req, res) {
    let orderDetail = await orderDataLayer.adminGetOrderDetails(req.params.order_id);

    res.render('orders/details', {
        'orderDetails': orderDetail.toJSON()
    })
})

// Update status of order
router.get('/:order_id/update', [checkIfAuthenticatedAdminAndManager], async function (req, res) {

    // Fetch the data to update
    const order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['OrderStatus']
    })

    let status = await OrderStatus.fetchAll().map(status => [status.get('id'), status.get('status')])

    const orderForm = createUpdateOrderForm(status);

    orderForm.fields.shipping_address.value = order.get('shipping_address')
    orderForm.fields.status.value = order.get('order_status_id')

    res.render('orders/update', {
        'orderForm': orderForm.toHTML(bootstrapField),
        'orderById': order.toJSON()
    })
})

// Process order update
router.post('/:order_id/update', [checkIfAuthenticatedAdminAndManager], async function (req, res) {

    // Fetch the data to update
    const order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['OrderStatus']
    })

    const currentOrder = order.toJSON()
    const currentOrderStatus = currentOrder.order_status_id

    let status = await OrderStatus.fetchAll().map(status => [status.get('id'), status.get('status')])

    const orderForm = createUpdateOrderForm(status);

    orderForm.handle(req, {
        'success': async (form) => {

            // Order status can only move one step forward
            if (currentOrderStatus + 1 == form.data.status) {
                order.set({
                    "shipping_address": form.data.shipping_address,
                    "order_status_id": form.data.status,
                    "update_datetime": new Date()
                })
                order.save()

                // Success Flash Message
                req.flash("success_messages", `Order ID ${order.get('id')} has been updated`)

                res.redirect('/orders')
            }

            // If update order status to an earlier status, it will be rejected
            else if (currentOrderStatus - 1 == form.data.status) {

                req.flash("error_messages", `Order ID ${order.get('id')} cannot be updated to an earlier status`)

                res.redirect('/orders')

            }

            // If update too many status forward also cannot
            else {
                req.flash("error_messages", `Order ID ${order.get('id')} cannot be updated`)

                res.redirect('/orders')
            }
        },
        'error': async (form) => {
            res.render('orders/update', {
                'orderForm': form.toHTML(bootstrapField),
                'orderById': order.toJSON()
            })
        }
    })
})

// Delete an order
router.get('/:order_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch the data to delete
    const order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['OrderStatus']
    })

    res.render('orders/delete', {
        'order': order.toJSON()
    })
})

// Process delete listing
router.post('/:order_id/delete', [checkIfAuthenticatedAdminAndManager], async (req, res) => {

    // Fetch the data to delete
    const order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['OrderStatus']
    })

    // Success Flash Message
    req.flash("success_messages", `Order No. ${order.get('id')} has been deleted`)

    await order.destroy()

    res.redirect('/orders')

})

module.exports = router;