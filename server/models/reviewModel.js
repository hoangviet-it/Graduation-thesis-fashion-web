const mongoose = require('mongoose')

const reviewShema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    product: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Review", reviewShema)