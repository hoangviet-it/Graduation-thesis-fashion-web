
const mongoose = require('mongoose')

const newsShema = new mongoose.Schema({
    news_id: {
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
    view: {
        type: Number,
        default: 0
    },
    checked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

module.exports =  mongoose.model("News", newsShema)