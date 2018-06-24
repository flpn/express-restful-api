const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

app.use((req, res, next) => {
    const error = new Error('URL not found!')
    error.status = 404
    
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app