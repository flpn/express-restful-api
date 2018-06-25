const express = require('express')
const mongoose = require('mongoose')

const Product = require('../models/product')

const router = express.Router()

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
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
                product: result
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
            res.status(200).json(result)
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
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router
