
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

//const bodyParser = require('body-parser');

const app = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))


//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))     // API upload ảnh lên cloudinary
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/statusRouter'))
app.use('/api', require('./routes/discountRouter'))
app.use('/api', require('./routes/orderRouter'))
app.use('/api', require('./routes/statusOrderRouter'))
app.use('/api', require('./routes/reviewRouter'))
app.use('/api', require('./routes/inforClientRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/objectCategoryRouter'))
app.use('/api', require('./routes/newsRouter'))
app.use('/api', require('./routes/roleRouter'))


//connect to mongodb
const URI = process.env.MONGODB_URL             //"mongodb://localhost/fashion-website"
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, err =>{
    if(err) throw err;
    console.log('Đã kết nối với Database!!!')
})



const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log('Server đang hoạt động trên port', PORT)
})