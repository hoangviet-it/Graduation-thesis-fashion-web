const Notify = require('../models/notifyModel')

const notifyCtrl = {

    getNotify: async (req, res) =>{
        try {
            const notify = await Notify.find()
            res.json(notify)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateNewOrder: async (req, res) =>{
        try {
            const {newOrder} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {newOrder})

            res.json({msg: "Có đơn hàng mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateNewReview: async (req, res) =>{
        try {
            const {newReview} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {newReview})

            res.json({msg: "Có đánh giá mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createNotify: async (req, res) =>{
        try {
            const {newOrder, newReview} = req.body;

            const newNotify = new Notify({newOrder, newReview})
            await newNotify.save()

            res.json({msg: "Đã tạo 1 notify mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateSlide: async (req, res) =>{
        try {
            const {slide} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {slide})

            res.json({msg: "Đã cập nhật slide!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateDiscount: async (req, res) =>{
        try {
            const {discount} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {discount})

            res.json({msg: "Đã cập nhật khuyến mãi!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateCancelOrder: async (req, res) =>{
        try {
            const {cancelOrder} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {cancelOrder})

            res.json({msg: "Đã Hủy đơn hàng!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateIdCategory: async (req, res) =>{
        try {
            const {idCategory1, idCategory2} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {idCategory1, idCategory2})

            res.json({msg: "Đã cập nhật 1 danh mục khuyến mãi!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateIntro: async (req, res) =>{
        try {
            const {intro} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {intro})

            res.json({msg: "Đã cập nhật thông tin giới thiệu website!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updatePolicy: async (req, res) =>{
        try {
            const {policy} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {policy})

            res.json({msg: "Đã cập nhật chính sách bảo mật website!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateRules: async (req, res) =>{
        try {
            const {rules} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {rules})

            res.json({msg: "Đã cập nhật điều khoản & điều kiện website!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateInstruct: async (req, res) =>{
        try {
            const {instruct} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {instruct})

            res.json({msg: "Đã cập nhật hướng dẫn đặt hàng!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật hình slide ở trang chủ
    updateCtrlSlide: async (req, res) =>{
        try {
            const {imagesSlide1, imagesSlide2, imagesSlide3} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {imagesSlide1, imagesSlide2, imagesSlide3})

            res.json({msg: "Đã cập nhật hình ảnh slide!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = notifyCtrl