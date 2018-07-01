const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')

const app = express()

mongoose.connect(`mongodb://shoppingadmin:${process.env.MONGO_PW}@localhost:27017/shopping`)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))
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