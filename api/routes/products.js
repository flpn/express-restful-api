const express = require('express')
const mongoose = require('mongoose')

const Product = require('../models/product')

const router = express.Router()

const fullPath = 'http://localhost:3000/api/products'

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            let response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: fullPath + doc._id
                        }
                    }
                })
            }

            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save()
        .then(result => {
            res.status(200).json({
                message: 'Product created!',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
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

router.get('/:productId', (req, res, next) => {
    let id = req.params.productId

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if(doc)
                res.status(200).json(doc)
            else
                res.status(404).json({message: 'No valid entry found for the provided ID'})
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.put('/:productId', (req, res, next) => {
    let id = req.params.productId
    let updatedProperties = {}

    for(let prop of req.body) {
        updatedProperties[prop.propName] = prop.value
    }

    Product.update({_id: id}, {$set: updatedProperties})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated!',
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

router.delete('/:productId', (req, res, next) => {
    let id = req.params.productId

    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Product ${id} deleted!`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router
