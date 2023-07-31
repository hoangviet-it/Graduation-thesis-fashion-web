
const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')

const authShipper = async (req, res, next) =>{
    try {
        const user = await Users.findOne({
            _id: req.user.id
        })
        
        if(user.role !== 1 && user.role !== 2 && user.role !== 4) return res.status(400).json({msg: "Quyền truy cập quản trị viên bị từ chối!"})

        next()
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authShipper