const mongoose = require('mongoose')

const discountShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    persent: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    code: {
        type: String,
        default: ')y@3k@*YUE*%^$#!&('
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Discount", discountShema)