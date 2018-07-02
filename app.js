const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const checkAuth = require('./api/middlewares/check-auth')
const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')
const userRouter = require('./api/routes/user')

const app = express()

mongoose.connect(`mongodb://shoppingadmin:${process.env.MONGO_PW}@localhost:27017/shopping`)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))
app.use('/api/products', productRouter)
app.use('/api/orders', checkAuth, orderRouter)
app.use('/api/user', userRouter)

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