const Roles = require('../models/roleModel')
const Users = require('../models/userModel')

const roleCtrl = {
    // Read
    getRole: async (req, res) =>{
        try {
            const roles = await Roles.find()
            res.json(roles)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

     // create
    createRole: async (req, res) =>{
        try {
            const {role_id, name} = req.body;
            const role = await Roles.findOne({name})
            const roleId = await Roles.findOne({role_id})
            
            if(role) return res.status(400).json({msg: "Tên bị trùng."})
            if(roleId) return res.status(400).json({msg: "Trùng mã vai trò."})
            if(name==='') return res.status(400).json({msg: "Chưa nhập tên."})

            const newRole = new Roles({role_id, name})
            await newRole.save()

            res.json({msg: "Đã tạo 1 vai trò quản trị mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateRole: async (req, res) => {
        try {
            const {name} = req.body

            if(name==='') return res.status(400).json({msg: "Chưa nhập dữ liệu chỉnh sửa."})

            await Roles.findOneAndUpdate({_id: req.params.id}, {name})
            res.json({msg: "Cập nhật thành công!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteRole: async (req, res) =>{
        try {
            const roleId = await Roles.findOne({_id: req.params.id})
            const role = await Users.find()
            var a=[]
            role.forEach(el => {
                a.push(el.role)
            })

            if(a.includes(roleId.role_id, 0)===true){
                return res.status(400).json({msg: "Không thể xóa. Phân quyền đang được sử dụng."})
            }
            else {
                await Roles.findByIdAndDelete(req.params.id)
                res.json({msg: "Đã xóa!"})
            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = roleCtrl