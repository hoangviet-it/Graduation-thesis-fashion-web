const Orders = require('../models/orderModel')
const Users = require('../models/userModel')
const StatusOrder = require('../models/statusOrderModel')
const Products = require('../models/productModel')

class APIsort {
    constructor (query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

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

const orderCtrl = {
    getOrder: async (req, res) =>{
        try {
            const features = new APIsort(Orders.find(), req.query).sorting().filtering().paginating()
            const order = await features.query
            res.json({
                status: 'thành công',
                result: order.length,
                orders: order
            })
            
            // const order = await Orders.find()
            // res.json(order)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createOrder: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            //res.json(user.name)  // lấy data của user đang đăng nhập

            const statusOrder = await StatusOrder.findOne({name: 'Đang xử lý'})
            const {order_id, email, address, phone, name_client, note, money, deliveryDate} = req.body;

            if(name_client==='') return res.status(400).json({msg: "Chưa nhập tên người nhận."})
            
            if(address==='') return res.status(400).json({msg: "Chưa nhập địa chỉ nhận hàng."})
            
            if(phone==='') return res.status(400).json({msg: "Chưa nhập số điện thoại."})

            if(phone.length!==10) return res.status(400).json({msg: "Số điện thoại Không hợp lệ."})

            if(email==='') return res.status(400).json({msg: "Chưa nhập Email."})

            const exist = await Orders.findOne({user_id: req.user.id, product: []})
            if(exist) return res.status(400).json({msg: "Thông tin đơn hàng đã tồn tại.  Hãy \"XÁC NHẬN ĐẶT HÀNG\" để hoàn tất đặt hàng!"})

            const newOrder = new Orders({order_id, email, address, phone, name_client, note, status_order: statusOrder.id, user_id: req.user.id, user_name: user.name, total: money, deliveryDate})
            await newOrder.save()

            res.json({msg: "Thông tin của bạn đã được tạo.  Nhấn \"XÁC NHẬN ĐẶT HÀNG\" để hoàn tất việc mua hàng !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateOrder: async (req, res) =>{
        try {
            const {status_order, arrPro} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {status_order})

            var a=[], b=[]
            arrPro.forEach(el=>{
                a.push(el.id)
                b.push({'id':el.id, 'quantity':el.quantity})
            })

            const products = await Products.find({_id: {$in: a}})
            products.forEach(k=>{
                b.forEach(async el=>{
                    if(el.id===k._id.toString()){
                        await Products.updateMany({_id: k._id}, {$set: {quantity_product: k.quantity_product + el.quantity}})
                    }
                })
            })

            res.json({msg: "Đã cập nhật thành công 1 đơn hàng.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async (req, res) =>{
        try {
            await Orders.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    addDataProductOrder: async (req, res) =>{
        try{
            await Orders.findOneAndUpdate({product: [], user_id: req.user.id}, {
                product: req.body.cart
            })

            return res.json({msg: "Đặt hàng thành công!   Bạn có thể theo dõi đơn hàng tại \"ĐƠN HÀNG CỦA TÔI\"!"})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    // api lấy đơn hàng theo id user đang đăng nhập (đơn hàng của tôi)
    getMyOrder: async (req, res) =>{
        try {

            const features = new APIsort(Orders.find({user_id: req.user.id}), req.query).sorting().filtering().paginating()
            const myorder = await features.query
            res.json({
                status: 'thành công',
                result: myorder.length,
                myorders: myorder
            })
            // const myorder = await Orders.find({user_id: req.user.id})
            // res.json(myorder)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check từng đơn hàng
    updateCheckOrder: async (req, res) =>{
        try {
            const {checked} = req.body;

            await Orders.findOneAndUpdate({_id: req.params.id}, {checked})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // check tất cả đơn hàng
    updateCheckAll: async (req, res) =>{
        try {
            await Orders.updateMany({checked: false}, {$set: {checked: true}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // bỏ check
    updateCancelCheck: async (req, res) =>{
        try {
            await Orders.updateMany({checked: true}, {$set: {checked: false}})

            res.json({msg: "Cập nhật thành công.!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật ngày chốt đơn
    updateOrder_Date: async (req, res) =>{
        try {
            const {order_date} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {order_date})

            res.json({msg: "Đã cập nhật ngày chốt đơn.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật trạng thái đã giao hàng trong danh sách hàng cần giao
    updateDelivered: async (req, res) =>{
        try {
            const {status_order} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {status_order})

            res.json({msg: "Cập nhật thành công.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật chờ giao => đang giao (chuyển danh sách đóng gói sang danh sách giao hàng)
    updateAwaitToDelivering: async (req, res) =>{
        try {
            const {listId} = req.body;
            await Orders.updateMany({_id: {$in: listId}}, {status_order: '632878d7a2e7052bc439f978'})

            res.json({msg: "Đã chuyển sang danh sách hàng cần giao!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật đang xử lý => chờ giao (duyệt đơn hàng)
    updateOrderBrowsing: async (req, res) =>{
        try {
            const {status_order} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {status_order})

            // const idPro_ord = await Orders.find({_id: req.params.id})
            // var a=[], b=[]
            // idPro_ord.forEach(el=>{
            //     el.product.forEach(i=>{
            //         a.push(i._id)
            //         b.push({'id':i._id, 'quantity':i.quantity})
            //     })
            // })

            // const products = await Products.find({_id: {$in: a}})
            // products.forEach(k=>{
            //     b.forEach(async el=>{
            //         if(el.id===k._id.toString()){
            //             await Products.updateMany({_id: k._id}, {$set: {quantity_product: k.quantity_product - el.quantity}})
            //         }
            //     })
            // })

            res.json({msg: "Đơn hàng đã được duyệt!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật ngày giao hàng và gười giao hàng
    updateUserAndDateDelivered: async (req, res) =>{
        try {
            const {user_delivery, delivered_date} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {user_delivery, delivered_date})

            res.json({msg: "Đã cập nhật!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật số lượng (trừ đi) sản phẩm khi khách đặt hàng (form mua ngay ở chi tiết sản phẩm)
    updateQuantityProductOrder: async (req, res) =>{
        try {
            const {quantity} = req.body;
            const pro = await Products.find({_id: req.params.id})

            var Quantity_product
            pro.forEach(el=>{
                Quantity_product = el.quantity_product
            })

            var newQuantity = Quantity_product - quantity
            await Products.findOneAndUpdate({_id: req.params.id}, {quantity_product: newQuantity})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật số lượng (trừ đi) khi đặt hàng từ giỏ hàng
    updateQuantityOrderCart: async (req, res) =>{
        try {
            const {listPro} = req.body

            // data test
            // const pro = [
            //     {"id": '63fedb24b200ba3ca0f49d5f', "quantity": 1},
            //     {"id": '63ff5e4660989b28681be1c0', "quantity": 1},
            //     {"id": '63ff5c5060989b28681be1bc', "quantity": 1}
            // ]

            var a=[], b=[]
            listPro.forEach(el=>{
                a.push(el.id)
                b.push({'id':el.id, 'quantity':el.quantity})
            })

            const products = await Products.find({_id: {$in: a}})
            products.forEach(k=>{
                b.forEach(async el=>{
                    if(el.id===k._id.toString()){
                        await Products.updateMany({_id: k._id}, {$set: {quantity_product: k.quantity_product - el.quantity}})
                    }
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật lại số lượng (trừ đi) sản phẩm khi đặt lại dơn hàng đã hủy
    updateReorder: async (req, res) =>{
        try {
            const {listPro} = req.body
            var a=[], b=[]
            listPro.forEach(el=>{
                a.push(el.id)
                b.push({'id':el.id, 'quantity':el.quantity})
            })

            const products = await Products.find({_id: {$in: a}})
            products.forEach(k=>{
                b.forEach(async el=>{
                    if(el.id===k._id.toString()){
                        await Products.updateMany({_id: k._id}, {$set: {quantity_product: k.quantity_product - el.quantity}})
                    }
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = orderCtrl