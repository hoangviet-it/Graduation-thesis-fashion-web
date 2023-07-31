
const Products = require('../models/productModel')


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

// controller of product
const productCtrl = {

    getProducts: async (req, res) =>{
        try {
            //console.log(req.query)

            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status: 'thành công',
                result: products.length,
                products: products
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createProduct: async (req, res) =>{
        try {
            const {product_id, title, price, description, content, images, images1, images2, images3, color, color1, color2, color3, size1, size2, size3, size4, size5, size6, size7, size8, size9, size10, category, status, quantity_product} = req.body;
            
            // if((color===color1&&color!==''&&color1!=='')||(color===color2&&color!==''&&color2!=='')||(color===color3&&color!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color1===color&&color1!==''&&color!=='')||(color1===color2&&color1!==''&&color2!=='')||(color1===color3&&color1!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color2===color&&color2!==''&&color!=='')||(color2===color1&&color2!==''&&color1!=='')||(color2===color3&&color2!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color3===color&&color3!==''&&color!=='')||(color3===color1&&color3!==''&&color1!=='')||(color3===color2&&color3!==''&&color2!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }

            if(!images) return res.status(400).json({msg: "Chưa thêm đầy đủ hình ảnh.!"})
            if(color==='') return res.status(400).json({msg: "Chưa nhập màu hình 1 (Màu hình 1 là bắt buộc và không thể bỏ qua)."})
            if(size1===''&&size2===''&&size3===''&&size4===''&&size5===''&&size6===''&&size7===''&&size8===''&&size9===''&&size10==='') return res.status(400).json({msg: "Chưa chọn Kích cỡ sản phẩm."})
            if(title==='') return res.status(400).json({msg: "Chưa nhập tên sản phẩm."})
            if(description==='') return res.status(400).json({msg: "Chưa thêm chất liệu sản phẩm."})
            if(content===''||content==='<p><br></p>') return res.status(400).json({msg: "Chưa thêm mô tả sản phẩm."})
            if(category==='') return res.status(400).json({msg: "Chưa chọn thể loại."})
            if(status==='') return res.status(400).json({msg: "Chưa thêm trạng thái."})
            if(price==='') return res.status(400).json({msg: "Chưa nhập giá."})
            if(isNaN(price)) return res.status(400).json({msg: "Giá sản phẩm không hợp lệ."})
            if(quantity_product==='') return res.status(400).json({msg: "Chưa nhập số lượng sản phẩm."})
            if(isNaN(quantity_product)) return res.status(400).json({msg: "Số lượng sản phẩm không hợp lệ."})
            
            const product = await Products.findOne({product_id})
            if(product) return res.status(400).json({msg: "Sản phẩm này đã tồn tại (bị trùng product_id)."})

            const newProduct = new Products({product_id, title: title.toLowerCase(), price, description, content, images, images1, images2, images3, color, color1, color2, color3, size: [size1, size2, size3, size4, size5, size6, size7, size8, size9, size10], category, status, quantity_product})
            await  newProduct.save()

            res.json({msg: "Đã thêm 1 sản phẩm mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async (req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateProduct: async (req, res) =>{
        try {
            const {title, price, description, content, images, images1, images2, images3, color, color1, color2, color3, size1, size2, size3, size4, size5, size6, size7, size8, size9, size10, category, status, discount, quantity_product} = req.body;
            if(!images) return res.status(400).json({msg: "Chưa thêm hình ảnh.!"})

            // if((color===color1&&color!==''&&color1!=='')||(color===color2&&color!==''&&color2!=='')||(color===color3&&color!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color1===color&&color1!==''&&color!=='')||(color1===color2&&color1!==''&&color2!=='')||(color1===color3&&color1!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color2===color&&color2!==''&&color!=='')||(color2===color1&&color2!==''&&color1!=='')||(color2===color3&&color2!==''&&color3!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }
            // if((color3===color&&color3!==''&&color!=='')||(color3===color1&&color3!==''&&color1!=='')||(color3===color2&&color3!==''&&color2!=='')){
            //     return res.status(400).json({msg: "Màu sản phẩm bị trùng."})
            // }

            if(color==='') return res.status(400).json({msg: "Chưa nhập màu hình 1 (Màu hình 1 là bắt buộc và không thể bỏ qua)."})
            if(size1===''&&size2===''&&size3===''&&size4===''&&size5===''&&size6===''&&size7===''&&size8===''&&size9===''&&size10==='') return res.status(400).json({msg: "Chưa chọn Kích cỡ sản phẩm."})
            if(title==='') return res.status(400).json({msg: "Chưa nhập tên sản phẩm."})
            if(description==='') return res.status(400).json({msg: "Chưa thêm chất liệu sản phẩm."})
            if(content===''||content==='<p><br></p>') return res.status(400).json({msg: "Chưa thêm mô tả sản phẩm."})
            if(category==='') return res.status(400).json({msg: "Chưa chọn thể loại."})
            if(status==='') return res.status(400).json({msg: "Chưa thêm trạng thái."})
            if(price==='') return res.status(400).json({msg: "Chưa nhập giá."})
            if(isNaN(price)) return res.status(400).json({msg: "Giá sản phẩm không hợp lệ."})
            if(quantity_product==='') return res.status(400).json({msg: "Chưa nhập số lượng sản phẩm."})
            if(isNaN(quantity_product)) return res.status(400).json({msg: "Số lượng sản phẩm không hợp lệ."})

            await Products.findOneAndUpdate({_id: req.params.id}, {title: title.toLowerCase(), price, description, content, images, images1, images2, images3, color, color1, color2, color3, size: [size1, size2, size3, size4, size5, size6, size7, size8, size9, size10], category, status, discount, quantity_product})

            res.json({msg: "Cập nhật thành công.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getPriceLT100000: async (req, res) =>{
        try {
            // const proPrice = await Products.find({price: { $lt: 100000 }})
            // res.json(proPrice)

            const features = new APIfeatures(Products.find({price: { $lt: 100000 }}), req.query).filtering().sorting().paginating()
            const proPrice = await features.query
            res.json({
                status: 'thành công',
                result: proPrice.length,
                proPrice: proPrice
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getPrice_IN100_IN199: async (req, res) =>{
        try {
            // const proPrice = await Products.find({price: { $gte: 100000, $lte:199000 }})
            // res.json(proPrice)

            const features = new APIfeatures(Products.find({price: { $gte: 100000, $lte:199000 }}), req.query).filtering().sorting().paginating()
            const proPrice = await features.query
            res.json({
                status: 'thành công',
                result: proPrice.length,
                proPrice: proPrice
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getPrice_IN200_IN500: async (req, res) =>{
        try {
            // const proPrice = await Products.find({price: { $gte: 200000, $lte:500000 }})
            // res.json(proPrice)

            const features = new APIfeatures(Products.find({price: { $gte: 200000, $lte:500000 }}), req.query).filtering().sorting().paginating()
            const proPrice = await features.query
            res.json({
                status: 'thành công',
                result: proPrice.length,
                proPrice: proPrice
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getPriceGT500: async (req, res) =>{
        try {
            // const proPrice = await Products.find({price: { $gt: 500000 }})
            // res.json(proPrice)

            const features = new APIfeatures(Products.find({price: { $gt: 500000 }}), req.query).filtering().sorting().paginating()
            const proPrice = await features.query
            res.json({
                status: 'thành công',
                result: proPrice.length,
                proPrice: proPrice
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getDiscountPro: async (req, res) =>{
        try {
            const features = new APIfeatures(Products.find({discount: {$gt: 0}}), req.query).filtering().sorting().paginating()
            const proDiscount = await features.query
            res.json({
                status: 'thành công',
                result: proDiscount.length,
                proDiscount: proDiscount
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check từng sản phẩm
    updateCheckDeleteAll: async (req, res) =>{
        try {
            const {checked} = req.body;

            await Products.findOneAndUpdate({_id: req.params.id}, {checked})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check tất cả sản phẩm
    updateCheckAll: async (req, res) =>{
        try {
            await Products.updateMany({checked: false}, {$set: {checked: true}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // bỏ check
    updateCancelCheck: async (req, res) =>{
        try {
            await Products.updateMany({checked: true}, {$set: {checked: false}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }

    // gte : lớn hơn hoặc bằng (theo giá)
    // lte : nhỏ hơn hoặc bằng (theo giá)
    // gt : lớn hơn (theo giá)
    // lt : nhỏ hơn (theo giá)
    // regex : theo ký tự bất kỳ (theo thuộc tính kiểu chuổi ký tự)
}

module.exports = productCtrl