const News = require('../models/newsModel')


// filter, sort, paginating
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

const newsCtrl = {
    // Read
    getNews: async (req, res) =>{
        try {
            const features = new APIfeatures(News.find(), req.query).filtering().sorting().paginating()
            const news = await features.query
            res.json({
                status: 'thành công',
                result: news.length,
                news: news
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create
    createNews: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật
            const {news_id, title, description, content, images, view} = req.body;
            const news = await News.findOne({title})
            
            if(news) return res.status(400).json({msg: "Tên bài biết bị trùng! Hãy nhập tên khác."})
            if(!images) return res.status(400).json({msg: "Chưa thêm hình ảnh bài viết.!"})
            if(description==='') return res.status(400).json({msg: "Chưa nhập mô tả bài viết.!"})
            if(content==='') return res.status(400).json({msg: "Chưa nhập nội dung bài viết.!"})
            if(title==='') return res.status(400).json({msg: "Chưa nhập tên thể loại.!"})

            const newNews = new News({news_id, title, description, content, images, view})
            await newNews.save()

            res.json({msg: "Đã thêm 1 bài viết mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // xóa
    deleteNews: async (req, res) =>{
        try {
            await News.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật
    updateNews: async (req, res) =>{
        try {
            const {title, description, content, images} = req.body;
            await News.findOneAndUpdate({_id: req.params.id}, {title, description, content, images})

            res.json({msg: "Đã cập nhật thành công 1 bài viết.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật lượt xem
    UpdateView: async (req, res) =>{
        try {
            const {view} = req.body;
            await News.findOneAndUpdate({_id: req.params.id}, {view})

            res.json({msg: "Đã cập nhật 1 view.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check từng bài viết
    updateCheckNews: async (req, res) =>{
        try {
            const {checked} = req.body;

            await News.findOneAndUpdate({_id: req.params.id}, {checked})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check tất cả bài viết
    updateCheckAll: async (req, res) =>{
        try {
            await News.updateMany({checked: false}, {$set: {checked: true}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // bỏ check
    updateCancelCheck: async (req, res) =>{
        try {
            await News.updateMany({checked: true}, {$set: {checked: false}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = newsCtrl