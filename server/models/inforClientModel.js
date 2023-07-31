const mongoose = require('mongoose')

const inforClientShema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name_client: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    pays: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model("Infor_client", inforClientShema)