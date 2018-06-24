const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
})

router.post('/', (req, res, next) => {
    let product = {
        name: req.body.name,
        price: req.body.price
    }

    res.status(200).json({
        message: 'Handling POST requests to /products',
        product: product
    })
})

router.get('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to a specific product',
        id: req.params.productId
    })
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updating a specific product',
        id: req.params.productId
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleting a specific product',
        id: req.params.productId
    })
})

module.exports = router
