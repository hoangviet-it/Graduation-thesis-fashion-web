
const mongoose = require('mongoose')

const roleShema = new mongoose.Schema({
    role_id: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

}, {
    timestamps: true
})

module.exports =  mongoose.model("Role", roleShema)