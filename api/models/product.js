const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, reqired: true },
    price: { type: Number, required: true }
})

module.exports = mongoose.model('Product', productSchema)
