const { Order, OrderStatus } = require("../models")

// Get all OrderStatus
async function getOrderStatus() {
    return await OrderStatus.fetchAll().map(status => [status.get('id'), status.get('status')])
}

// Retrieve all orders (for Admin)
async function adminGetOrder() {
    return await Order.collection().fetch({
        require: false,
        withRelated: ['OrderStatus']
    })
}

// Retreive orders (Under individual user)
// Retrieve items in cart belonging to specific user
async function userGetOrder(userId) {
    return await Order.collection().where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['OrderStatus']
    })
}

// Create one order and order details
async function createOrder(shippingAddress, statusId, createDateTime, updateDateTime, totalCost, userId ) {
    let order = new Order({
        'shipping_address': shippingAddress,
        'order_status_id': statusId,
        'create_datetime': createDateTime,
        'update_datetime': updateDateTime,
        'total_cost': totalCost,
        'user_id': userId
    })

    return await order.save().then(function (newRow) {
        let {id} = newRow.toJSON();
    // Return the order id
    console.log(id); 
    })
}


module.exports = { adminGetOrder, userGetOrder, createOrder, getOrderStatus }