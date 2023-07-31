const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product: {
        type: Array,
        default: []
    },
    order_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    name_client: {
        type: String,
        trim: true,
        required: true
    },
    note:{
        type: String,
        default: ''
    },
    status_order: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    deliveryDate: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    order_date: {
        type: String,
        default: '',
        trim: true
    },
    delivered_date: {
        type: String,
        default: '',
        trim: true
    },
    user_delivery: {
        type: String,
        default: '',
        trim: true
    }

}, {
    timestamps: true  
})

module.exports = mongoose.model('Order', orderSchema)