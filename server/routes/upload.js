
const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')
const fs = require('fs')
const Products = require('../models/productModel')


// kết nối tới cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// upload hình ảnh
router.post('/upload', auth, authAdminProduct, (req, res) =>{
    try {
        console.log(req.files)

        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: "Không có tệp nào được tải lên."})

        const file = req.files.file;
        if(file.size > 1024*1024) {       // nếu file lớn hơn 1mb.     //(1024*1024) = 1MB   //(1024*1024*5) = 5MB
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Kích thước tệp quá lớn."})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Định dạng tệp không chính xác."})
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "Fashion"}, async(err, result) =>{

            if(err) throw err;

            removeTmp(file.tempFilePath)      // upload xong, ảnh sẽ ko xuất hiện trong folder tmp

            res.json({public_id: result.public_id, url: result.secure_url})     
        })

        // res.json('upload thành công')

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// delete hình ảnh
router.post('/destroy', auth, authAdminProduct, (req, res) =>{
    try {
        const {public_id, public_id1, public_id2, public_id3} = req.body;
        if(!public_id) return res.status(400).json({msg: "không có hình ảnh nào được chọn."})
        
        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) throw err;            
            res.json({msg: "đã xóa hình ảnh.!"})     
        })

        cloudinary.v2.uploader.destroy(public_id1, async(err, result) =>{
            if(err) throw err;
            res.json({msg: "đã xóa hình ảnh.!"})     
        })

        cloudinary.v2.uploader.destroy(public_id2, async(err, result) =>{
            if(err) throw err;
            res.json({msg: "đã xóa hình ảnh.!"})     
        })

        cloudinary.v2.uploader.destroy(public_id3, async(err, result) =>{
            if(err) throw err;
            res.json({msg: "đã xóa hình ảnh.!"})     
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// router.post('/destroy_pro_checked', auth, authAdmin, async (req, res)  =>{
//     try {
//         const product = await Products.find({checked: true})
//         var a = []

//         product.forEach(el=>{
//             a.push(el.images.public_id, el.images1.public_id, el.images2.public_id, el.images3.public_id)
//         })  

//         var public_id = []
//         public_id = a.filter(item => {if(item!==null){return item}})

//         // cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
//         //     if(err) throw err;            
//         //     res.json({msg: "đã xóa hình ảnh.!"})     
//         // })

//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

const removeTmp = (path) =>{
    fs.unlink(path, err =>{
        if(err) throw err;
    })
}


module.exports = router