const express = require('express')
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

const router = express.Router()

const fullPath = 'http://localhost:3000/api/orders/'

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id productId quantity')
        .populate('productId', 'name')
        .exec()
        .then(docs => {
            let response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: fullPath + doc._id
                        }
                    }
                })
            }

            res.status(200).json(response)
        })
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(result => {
            if(!result) {
                return res.status(404).json({ message: 'Product not found!' })
            }

            let order = new Order({
                _id: mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            })
        
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: fullPath + result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({ 
                error: err
            })
        })
})

router.get('/:orderId', (req, res, next) => {
    let id = req.params.orderId

    Order.findById(id)
        .select('_id productId quantity')
        .populate('productId')        
        .exec()
        .then(result => {
            if(result)
                res.status(200).json(result)
            else
                res.status(404).json({ message: 'None order with the given ID was found!' })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.patch('/:orderId', (req, res, next) => {
    let id = req.params.orderId
    let updatedProperties = {}

    for(let prop of req.body) {
        updatedProperties[prop.propName] = prop.value
    }

    Order.update({ _id: id }, { $set: updatedProperties })
        .exec()
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
})

router.delete('/:orderId', (req, res, next) => {
    let id = req.params.orderId

    Order.remove({ _id: id })
        .exec()
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

    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    })
})


module.exports = router