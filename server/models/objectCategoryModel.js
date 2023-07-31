
const mongoose = require('mongoose')

const objectCategoryShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Object_Category", objectCategoryShema)