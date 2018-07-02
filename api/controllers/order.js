const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(orders => {
            let response = {
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: fullPath + order._id
                        }
                    }
                })
            }

            res.status(200).json(response)
        })
}

exports.get_order = (req, res, next) => {
    let id = req.params.orderId

    Order.findById(id)
        .select('_id product quantity')
        .populate('product', 'name price')        
        .exec()
        .then(order => {
            if(order)
                res.status(200).json(order)
            else
                res.status(404).json({ message: 'None order with the given ID was found!' })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.create_order = (req, res, next) => {
    Product.findById(req.body.product)
        .exec()
        .then(product => {
            console.log(product)
            if(!product) {
                return res.status(404).json({ message: 'Product not found!' })
            }

            let order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.product,
                quantity: req.body.quantity
            })
        
            return order.save()
        })
        .then(order => {
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: fullPath + order._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({ 
                error: err
            })
        })
}

exports.update_order = (req, res, next) => {
    let id = req.params.orderId
    
    Order.findById(id)
        .exec()
        .then(order => {
            if(!order) 
                return res.status(404).json({ message: 'None order with the given ID was found!' })
            
            let updatedProperties = {}
        
            for(let prop of req.body) {
                updatedProperties[prop.propName] = prop.value
            }
            
            return Order.update({ _id: id }, { $set: updatedProperties }).exec()
        })
        .then(result => {
            res.status(200).json({
                message: 'Order updated!',
                request: {
                    type: 'GET',
                    url: fullPath + id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.delete_order = (req, res, next) => {
    let id = req.params.orderId

    Order.findById(id)
        .exec()
        .then(order => {
            if(!order)
                return res.status(404).json({ message: 'None order with the given ID was found!' })
            
            return Order.remove({ _id: id }).exec()
        })
        .then(result => {
            res.status(200).json({
                message: `Order ${id} was deleted!`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
