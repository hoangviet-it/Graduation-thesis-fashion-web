
const Users = require('../models/userModel')
const inforClient = require('../models/inforClientModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "Email đã tồn tại."})

            if(password.length<6)
                return res.status(400).json({msg: "Password không được ngắn hơn 6 ký tự."})

            var a=[], b='', c=0, d=''
            const userId = await Users.find()
            userId.forEach(el=>{
                if(el.role===0){
                    a.push(el)
                }
            })
            
            if(a.length!==0){
                a.forEach((el, i)=>{
                    if(i===a.length-1){
                        b = el.user_id
                    }
                })

                c = (Number.parseInt((b.slice(2)),10)+1)
                if(c<10){
                    d = ('KH0'+ c.toString())
                }
                else if(c>=10) {
                    d = ('KH'+ c.toString())
                }
            }
            else {
                d = 'KH01'
            }


            // mã hóa (băm password)
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                user_id: d, name, email, password:  passwordHash
            })
            
            //res.json({password, passwordHash})    //test passwordhash
            //res.json(newUser)     //test user
            
            // save user to mongodb
            await newUser.save()

            // sau đó tạo jsonwebtoken để xác thực (authentication)
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000  // 7 ngày
            })

            res.json({accesstoken})
            //res.json({msg: "Tạo tài khoản thành công !!!"})

        } catch (err){
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "Tài khoản không tồn tại! Hãy kiểm tra email hoặc tạo tài khoản mới."})
            
            // so sánh mật khẩu băm với mật khẩu văn bản người dùng nhập
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Mật khẩu không đúng! Xin hãy nhập lại."})
            
            // res.json({msg: "Đăng nhập thành công !"})        // test đăng nhập
            
            // nếu login thành công, tạo access token và frefesh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000  // 7 ngày
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "đã đăng xuất!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    refreshToken: (req, res) =>{   
        try {
            const rf_token = req.cookies.refreshtoken;

            if(!rf_token) return res.status(400).json({msg: "Hãy đăng nhập hoặc tạo tài khoản."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
                if(err) return res.status(400).json({msg: "Hãy đăng nhập hoặc tạo tài khoản."})
                const accesstoken = createAccessToken({id: user.id})
                res.json({accesstoken})
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUser: async (req, res) =>{
        try {
            // res.json(req.user)       // test id user khi đã xác thực (trả về giá trị của payload)
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "Tài khoản không tồn tại."})

            res.json(user)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    addCart: async (req, res) =>{
        try{
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "Người dùng không tồn tại."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })
            return res.json({msg: "Đã thêm vào giỏ hàng!"})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    updatePassword: async (req, res) => {
        try {
            const {password} = req.body;

            if(password.length<6)
                return res.status(400).json({msg: "Password không được ngắn hơn 6 ký tự."})

            // mã hóa (băm password)
            const passwordHash = await bcrypt.hash(password, 10)

            await Users.findOneAndUpdate({_id: req.user.id}, {password: passwordHash})
            res.json({msg: "Đổi mật khẩu thành công !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    readUser: async (req, res) => {
        try {
            const features = new APIfeatures(Users.find({role: {$lt: 1}}).select('-password'), req.query).filtering().paginating().sorting()
            const user = await features.query
            res.json({
                status: 'thành công',
                result: user.length,
                users: user
            })

            // const user = await Users.find()
            // res.json(user)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    readAdmin: async (req, res) => {
        try {
            const features = new APIfeatures(Users.find({role: {$gt: 0}}).select('-password'), req.query).filtering().paginating().sorting()
            const user = await features.query
            res.json({
                status: 'thành công',
                result: user.length,
                users: user
            })

            // const user = await Users.find()
            // res.json(user)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserPayed: async (req, res) => {
        try {
            const client = await inforClient.find()
            var a=[]
            client.forEach(el=>{
                a.push(el.user_id)
            })

            const features = new APIfeatures(Users.find({_id: {$in: a}}).select('-password'), req.query).filtering().paginating()
            const userPayed = await features.query
            res.json({
                status: 'thành công',
                result: userPayed.length,
                userPayed: userPayed
            })


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserNotPay: async (req, res) => {
        try {
            const users = await Users.find()
            const client = await inforClient.find()

            var a = []
            users.forEach(el=>{
                if(el.role<1){
                    a.push(el._id.toString())
                }
            })
    
            var b = []
            client.forEach(el=>{
                b.push(el.user_id)
            })

            var c = (a.filter(value => -1 === b.indexOf(value)))    // lấy phần tử giống nhau

            const features = new APIfeatures(Users.find({_id: {$in: c}}).select('-password'), req.query).filtering().paginating()
            const userNotPay = await features.query
            res.json({
                status: 'thành công',
                result: userNotPay.length,
                userNotPay: userNotPay
            })


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateDissable: async (req, res) => {
        try {
            const {dissable} = req.body

            await Users.findOneAndUpdate({_id: req.params.id}, {dissable})
            res.json({msg: "Đã khóa tài khoản!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteUser: async (req, res) => {
        try {

            await Users.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa tài khoản!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // tạo tài khoản admin
    registerAdmin: async (req, res) => {
        try {
            const {name, email, password, role} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "Email đã tồn tại."})
            if(role==='') return res.status(400).json({msg: "Chưa phân quyền người dùng."})

            if(password.length<6)
                return res.status(400).json({msg: "Mật khẩu không được ngắn hơn 6 ký tự."})
            
            var a=[], b='', c=0, d=''
            const userId = await Users.find()
            userId.forEach(el=>{
                if(el.role!==0){
                    a.push(el)
                }
            })

            a.forEach((el, i)=>{
                if(i===a.length-1){
                    b = el.user_id
                }
            })

            c = (Number.parseInt((b.slice(2)),10)+1)
            if(c<10){
                d = ('AD0'+ c.toString())
            }
            else if(c>=10) {
                d = ('AD'+ c.toString())
            }

            // mã hóa (băm password)
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                user_id: d, name, email, password:  passwordHash, role
            })
            
            await newUser.save()
            res.json({msg: "Tạo tài khoản thành công!"})

        } catch (err){
            return res.status(500).json({msg: err.message})
        }
    },

    updateRoleForUser: async (req, res) => {
        try {
            const {role} = req.body

            await Users.findOneAndUpdate({_id: req.params.id}, {role})
            res.json({msg: "Cập nhật thành công!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl