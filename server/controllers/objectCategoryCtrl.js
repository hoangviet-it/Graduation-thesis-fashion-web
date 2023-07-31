const ObjectCategory = require('../models/objectCategoryModel')
const Categories = require('../models/categoryModel')

const objsctCategoryCtrl = {
    // Read ObjsctCategory
    objsctCategorys: async (req, res) =>{
        try {
            const ob = await ObjectCategory.find()
            res.json(ob)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create category
    createObjsctCategory: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật ObjsctCategory
            const {name} = req.body;
            const ob = await ObjectCategory.findOne({name})
            
            if(ob) return res.status(400).json({msg: "Tên đối tượng bị trùng! Hãy chọn tên khác."})
            if(name==='') return res.status(400).json({msg: "Chưa nhập tên cần thêm."})

            const newCategory = new ObjectCategory({name})
            await newCategory.save()

            res.json({msg: "Đã thêm 1 đối tượng thể loại mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // xóa ObjsctCategory
    deleteObjsctCategory: async (req, res) =>{
        try {
            const category = await Categories.findOne({object: req.params.id})
            if(category) return res.status(400).json({msg: "Vui lòng xóa hết các thể loại liên quan."})
            
            await ObjectCategory.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật ObjsctCategory
    updateObjsctCategory: async (req, res) =>{
        try {
            const {name} = req.body;
            await ObjectCategory.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Đã cập nhật thành công 1 đối tượng thể loại.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = objsctCategoryCtrl