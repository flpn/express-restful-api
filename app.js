const express = require('express')
const app = express()

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')

app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

module.exports = app