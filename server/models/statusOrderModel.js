const mongoose = require('mongoose')

const statusOrderShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Status_Order", statusOrderShema)