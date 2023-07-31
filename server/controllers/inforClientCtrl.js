const InforClient = require('../models/inforClientModel')

// filter, sort, paginating
// class APIfeatures {
//     constructor (query, queryString){
//         this.query = query;
//         this.queryString = queryString;
//     }

//     // Lọc dữ liệu theo thuộc tính = giá trị
//     filtering(){
//         const queryObj = {...this.queryString}
//         console.log({before: queryObj})
//         const excludedFields = ['page', 'sort', 'limit']    // mảng (loại trừ các giá trị này)
//         excludedFields.forEach(el => delete(queryObj[el]))      // duyệt qua mảng và xóa các giá trị trên query có trong mảng
       
//         console.log({after: queryObj})

//         let queryStr = JSON.stringify(queryObj)
//         // console.log({queryObj, queryStr})

//         queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
//         console.log({queryStr})

//         // gte : lớn hơn hoặc bằng (theo giá)
//         // lte : nhỏ hơn hoặc bằng (theo giá)
//         // gt : lớn hơn (theo giá)
//         // lt : nhỏ hơn (theo giá)
//         // regex : theo ký tự bất kỳ (theo thuộc tính kiểu chuổi ký tự)

//         this.query.find(JSON.parse(queryStr))


//         return this;
//     }

//     // Sắp xếp dữ liệu theo tên thuộc tính
//     sorting(){
//         if(this.queryString.sort){
//             const sortBy = this.queryString.sort.split(',').join(' ')       // tách ngay dấu phẩy và thay bằng khoẳng trắng
//             console.log(sortBy)
//             this.query =  this.query.sort(sortBy)

//         } else {
//             this.query = this.query.sort('-createdAt')
//         }

//         return this;
//     }
    
//     // phân trang
//     paginating(){
//         const page = this.queryString.page * 1 || 1         // số trang
//         const limit = this.queryString.limit * 1 //|| 9     // giới hạn trong 1 trang
//         const skip = (page - 1) * limit;                    // bước nhảy (bỏ qua phần tử ở trang đầu)

//         this.query = this.query.skip(skip).limit(limit)     
//         // skip(): bỏ qua số phần tử đầu, limit(): lưu số phần tử đầu tiếp theo sao khi skip bỏ qua

//         return this;
//     }
// }

const inforClientCtrl = {
    // Read
    inforClient: async (req, res) =>{
        try {

            const inforClient = await InforClient.find()
            res.json(inforClient)

            // const features = new APIfeatures(InforClient.find(), req.query).filtering().sorting().paginating()
            // const inforClient = await features.query
            // res.json({
            //     status: 'thành công',
            //     result: inforClient.length,
            //     inforClient: inforClient
            // })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createInforClient: async (req, res) =>{
        try {
            
            const {name_client, address, phone, email} = req.body;

            const newClient = new InforClient({user_id: req.user.id, name_client, address, phone, email})
            await newClient.save()

            res.json({msg: "Đã tạo 1 thông tin khách hàng mới!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateInforClient: async (req, res) =>{
        try {
            const {name_client, address, phone, email} = req.body;
            const user = await InforClient.findOne({user_id: req.user.id})
            if(!user) return res.status(400).json({msg: "Không thể cập nhật do chưa có thông tin cá nhân. Hãy tiếp tục mua hàng để cập nhật thông tin tài khoản!"})
            
            await InforClient.findOneAndUpdate({user_id: req.user.id}, {name_client, address, phone, email})

            res.json({msg: "Đã cập nhật thành công !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteInforClient: async (req, res) =>{
        try {
            
            await InforClient.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updatePays: async (req, res) => {
        try {
            const {pays} = req.body;
            await InforClient.findOneAndUpdate({user_id: req.user.id}, {pays})
            res.json({msg: "Đã cập nhật!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = inforClientCtrl