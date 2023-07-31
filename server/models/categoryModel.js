
const mongoose = require('mongoose')

const categoryShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    images: {
        type: Object,
        required: true
    },
    object: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Category", categoryShema)