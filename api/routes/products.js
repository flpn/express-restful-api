const express = require('express')
const mongoose = require('mongoose')

const Product = require('../models/product')

const router = express.Router()

const fullPath = 'http://localhost:3000/api/products/'

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(products => {
            let response = {
                count: products.length,
                products: products.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        request: {
                            type: 'GET',
                            url: fullPath + product._id
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
        .then(product => {
            res.status(201).json({
                message: 'Product created!',
                createdProduct: {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    request: {
                        type: 'GET',
                        url: fullPath + product._id
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
        .then(product => {
            if(product)
                res.status(200).json(product)
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

    Product.findById(id)
        .exec()
        .then(product => {
            if(!product) {
                return res.status(404).json({ message: 'No valid entry found for the provided ID' })
            }

            let updatedProperties = {}

            for(let prop of req.body) {
                updatedProperties[prop.propName] = prop.value
            }

            return Product.update({_id: id}, {$set: updatedProperties}).exec()
        })
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

    Product.findById(id)
        .exec()
        .then(product => {
            if(!product) {
                return res.status(404).json({ message: 'No valid entry found for the provided ID' })
            }

            return Product.remove({_id: id}).exec()
        })
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
