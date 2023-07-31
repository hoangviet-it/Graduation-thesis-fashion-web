const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    dissable: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true  
})

module.exports = mongoose.model('User', userSchema)