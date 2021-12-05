const { Order, OrderStatus, OrderDetail } = require("../models")

// Get all OrderStatus
async function getOrderStatus() {
    return await OrderStatus.fetchAll().map(status => [status.get('id'), status.get('status')])
}

// Get order by puzzle Id
async function getOrderByPuzzleId(puzzleId) {
    return await OrderDetail.collection().where({
        'puzzle_id': puzzleId
    }).fetch({
        require: false,
        withRelated: ['Puzzle']
    })
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

// Create one order
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
        return id            
    })
}

// Create One Order Detail
async function createOrderDetail(individualCost, quantity, createDateTime, orderId, puzzleId){
    let orderDetail = new OrderDetail({
        'individual_cost': individualCost,
        'quantity': quantity,
        'create_datetime': createDateTime,
        'order_id': orderId,
        'puzzle_id': puzzleId
    })
    return await orderDetail.save()
}

// Retrieve all order details of one order
async function adminGetOrderDetails(orderId) {
    return await OrderDetail.collection().where({
        'order_id': orderId
    }).fetch({
        require: false
    })
}

module.exports = { adminGetOrder, userGetOrder, createOrder, getOrderStatus, createOrderDetail, adminGetOrderDetails, getOrderByPuzzleId }