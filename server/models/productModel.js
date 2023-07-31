
const mongoose = require('mongoose')

const productShema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    images1: {
        type: Object,
        required: true
    },
    images2: {
        type: Object,
        required: true
    },
    images3: {
        type: Object,
        required: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    color1: {
        type: String,
        trim: true
    },
    color2: {
        type: String,
        trim: true
    },
    color3: {
        type: String,
        trim: true
    },
    size: {
        type: Array,
        default: []
    },
    category: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    quantity_product: {
        type: Number,
        required: true,
        trim: true
    }

}, {
    timestamps: true
})

module.exports =  mongoose.model("Product", productShema)
