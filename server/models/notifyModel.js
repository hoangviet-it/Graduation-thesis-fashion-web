const mongoose = require('mongoose')

const notifyShema = new mongoose.Schema({
    newOrder: {
        type: Number,
        required: true
    },
    cancelOrder: {
        type: Number,
        required: true
    },
    newReview: {
        type: Number,
        required: true
    },
    slide: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 1
    },
    idCategory1: {
        type: String,
        trim: true
    },
    idCategory2: {
        type: String,
        trim: true
    },
    intro: {
        type: String,
        trim: true
    },
    policy: {
        type: String,
        trim: true
    },
    rules: {
        type: String,
        trim: true
    },
    instruct: {
        type: String,
        trim: true
    },
    imagesSlide1: {
        type: Object,
        required: true
    },
    imagesSlide2: {
        type: Object,
        required: true
    },
    imagesSlide3: {
        type: Object,
        required: true
    }
    
}, {
    timestamps: true
})

module.exports =  mongoose.model("Notify", notifyShema)