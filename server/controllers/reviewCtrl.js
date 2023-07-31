const Review = require('../models/reviewModel')
const User = require('../models/userModel')

class APIfeatures {
    constructor (query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    // Lọc dữ liệu theo thuộc tính = giá trị
    filtering(){
        const queryObj = {...this.queryString}
        console.log({before: queryObj})
        const excludedFields = ['page', 'sort', 'limit']    // mảng (loại trừ các giá trị này)
        excludedFields.forEach(el => delete(queryObj[el]))      // duyệt qua mảng và xóa các giá trị trên query có trong mảng
       
        console.log({after: queryObj})

        let queryStr = JSON.stringify(queryObj)
        // console.log({queryObj, queryStr})

        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        console.log({queryStr})

        // gte : lớn hơn hoặc bằng (theo giá)
        // lte : nhỏ hơn hoặc bằng (theo giá)
        // gt : lớn hơn (theo giá)
        // lt : nhỏ hơn (theo giá)
        // regex : theo ký tự bất kỳ (theo thuộc tính kiểu chuổi ký tự)

        this.query.find(JSON.parse(queryStr))


        return this;
    }

    // Sắp xếp dữ liệu theo tên thuộc tính
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')       // tách ngay dấu phẩy và thay bằng khoẳng trắng
            console.log(sortBy)
            this.query =  this.query.sort(sortBy)

        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
    
    // phân trang
    paginating(){
        const page = this.queryString.page * 1 || 1         // số trang
        const limit = this.queryString.limit * 1 //|| 9     // giới hạn trong 1 trang
        const skip = (page - 1) * limit;                    // bước nhảy (bỏ qua phần tử ở trang đầu)

        this.query = this.query.skip(skip).limit(limit)     
        // skip(): bỏ qua số phần tử đầu, limit(): lưu số phần tử đầu tiếp theo sao khi skip bỏ qua

        return this;
    }
}

const reviewCtrl = {
     // Read
     reviews: async (req, res) =>{
        try {
            const features = new APIfeatures(Review.find(), req.query).filtering().sorting().paginating()
            const reviews = await features.query
            res.json({
                status: 'thành công',
                result: reviews.length,
                reviews: reviews
            })

            // const reviews = await Review.find()
            // res.json(reviews)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createReview: async (req, res) =>{
        try {

            // do khách hàng tạo
            const {product, star, content} = req.body;
            //if(!star) return res.status(400).json({msg: "Chưa chọn đánh giá."})
            if(!content) return res.status(400).json({msg: "Chưa nhập nội dung nhận xét."})

            const user_name = await User.findOne({_id: req.user.id})

            const newRiview = new Review({username: user_name.name, user_id: req.user.id, star, content, product})
            await newRiview.save()

            res.json({msg: "Đăng nhận xét thành công!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteReview: async (req, res) =>{
        try {
            await Review.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check từng đánh giá
    updateCheckReview: async (req, res) =>{
        try {
            const {checked} = req.body;

            await Review.findOneAndUpdate({_id: req.params.id}, {checked})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check tất cả đánh giá
    updateCheckAll: async (req, res) =>{
        try {
            await Review.updateMany({checked: false}, {$set: {checked: true}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // bỏ check
    updateCancelCheck: async (req, res) =>{
        try {
            await Review.updateMany({checked: true}, {$set: {checked: false}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = reviewCtrl
