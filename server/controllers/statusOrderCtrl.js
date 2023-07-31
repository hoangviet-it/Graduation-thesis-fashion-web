
const statusOrder = require('../models/statusOrderModel')
const Orders = require ('../models/orderModel')

const statusOrderCtrl = {
    // Read
    statusOrder: async (req, res) =>{
        try {
            const st = await statusOrder.find()
            res.json(st)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create status
    createStatusOrder: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật
            const {name} = req.body;
            const st = await statusOrder.findOne({name})
            
            if(st) return res.status(400).json({msg: "Tên trạng thái bị trùng! Hãy nhập tên khác."})
            if(name==='') return res.status(400).json({msg: "Chưa nhập dữ liệu."})

            const newStatusOrder = new statusOrder({name})
            await newStatusOrder.save()

            res.json({msg: "Đã tạo 1 trạng thái đơn hàng mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateStatusOrder: async (req, res) =>{
        try {
            const {name} = req.body;
            await statusOrder.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Đã cập nhật thành công 1 trạng thái đơn hàng !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteStatusOrder: async (req, res) => {
        try {
            const order = await Orders.findOne({status_order: req.params.id})
            if(order) return res.status(400).json({msg: "Vui lòng xóa hết các đơn hàng liên quan."})

            await statusOrder.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = statusOrderCtrl