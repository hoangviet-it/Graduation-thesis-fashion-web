const Discount = require('../models/discountModel')

const discountCtrl = {
    // Read discounts
    discounts: async (req, res) =>{
        try {
            const discounts = await Discount.find()
            res.json(discounts)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create status
    createDiscount: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật discount
            const {name, persent} = req.body;

            const discount_name = await Discount.findOne({name})           
            if(discount_name) return res.status(400).json({msg: "Tên khuyến mãi bị trùng!."})

            const discount_persent = await Discount.findOne({persent})
            if(discount_persent) return res.status(400).json({msg: "Số phần trăm khuyến mãi bị trùng!."})

            const newDiscount = new Discount({name, persent})
            await newDiscount.save()

            res.json({msg: "Đã tạo 1 khuyến mãi mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật category
    updateDiscount: async (req, res) =>{
        try {
            const {code} = req.body;

            const code_name = await Discount.findOne({code})           
            if(code_name) return res.status(400).json({msg: "Mã khuyến mãi bị trùng!."})

            // const discount_persent = await Discount.findOne({persent})
            // if(discount_persent) return res.status(400).json({msg: "Số phần trăm discount đã tồn tại!."})

            await Discount.findOneAndUpdate({_id: req.params.id}, {code})

            res.json({msg: "Đã cập nhật thành công 1 mã khuyến mãi.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteDiscount: async (req, res) =>{
        try {
            await Discount.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = discountCtrl