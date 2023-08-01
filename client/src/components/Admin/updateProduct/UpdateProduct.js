import React, {useState, useContext, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../../mainpages/utils/loading/Loading'
import LoadingMini from '../../mainpages/utils/loading/LoadingMini'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const initialState = {
    product_id: '',
    title: '',
    price: '',
    description: '',
    color: '',
    color1: '',
    color2: '',
    color3: '',
    category: '',
    status: '',
    discount: '',
    quantity_product: '',
    _id: ''
}

export default function UpdateProduct() {
    const { quill, quillRef } = useQuill();
    const [value, setValue] = useState()

    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [catedories] = state.categoriesAPI.categories
    const [status] = state.statusAPI.status
    const [discounts] = state.discountAPI.discount
    const [images, setImages] = useState(false)
    const [images1, setImages1] = useState(false)
    const [images2, setImages2] = useState(false)
    const [images3, setImages3] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [adminProduct] = state.userAPI.adminProduct
    const [token] = state.token
    
    const [products] = state.productsAPI.productAll
    const [callback, setCallback] = state.productsAPI.callback
    const [callback1, setCallback1] = state.productsAPI.callback1
    const [callback2, setCallback2] = state.productsAPI.callbackDisPro
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [product_id] = state.productsAPI.product_id
    const [checkCreatePro, setCheckCreatePro] = state.productsAPI.checkCreatePro
    const [size1, setSize1] = useState('')
    const [size2, setSize2] = useState('')
    const [size3, setSize3] = useState('')
    const [size4, setSize4] = useState('')
    const [size5, setSize5] = useState('')
    const [size6, setSize6] = useState('')
    const [size7, setSize7] = useState('')
    const [size8, setSize8] = useState('')
    const [size9, setSize9] = useState('')
    const [size10, setSize10] = useState('')
    const [checked_1, setChecked_1] = useState(false)
    const [checked_2, setChecked_2] = useState(false)
    const [checked_3, setChecked_3] = useState(false)
    const [checked_4, setChecked_4] = useState(false)
    const [checked_5, setChecked_5] = useState(false)
    const [checked_6, setChecked_6] = useState(false)
    const [checked_7, setChecked_7] = useState(false)
    const [checked_8, setChecked_8] = useState(false)
    const [checked_9, setChecked_9] = useState(false)
    const [checked_10, setChecked_10] = useState(false)
    const [optionSizeLetter, setOptionSizeLetter] = useState(true)
    const [optionSizeNumber, setOptionSizeNumber] = useState(false)

    // check dữ liệu để hiển thị
    useEffect(() =>{
        if(product_id){
            products.forEach(product =>{
                if(product._id === product_id){
                    setProduct(product)
                    setImages(product.images)
                    setImages1(product.images1)
                    setImages2(product.images2)
                    setImages3(product.images3)
                    dataSizePro(product)
                }
            })
        }
        else{
            setProduct(initialState)
            setImages(false)
            setImages1(false)
            setImages2(false)
            setImages3(false)
        }
    }, [product_id, products])

    // hàm lấy dữ liệu size để hiển thị (được gọi trong useEffect hiển thị)
    const dataSizePro = (product) => {
         var a=[]
        product.size.forEach(el=>{
            if(el!==''){
                a.push(el)
            }
        })
        
        a.forEach(i=>{
            if(i==='S'||i==='M'||i==='L'||i==='XL'||i==='XXL'||i==='XXXL'||i==='Free Size'){
                setOptionSizeNumber(false)
                setOptionSizeLetter(true)
            }
            else {
                setOptionSizeNumber(true)
                setOptionSizeLetter(false)
            }
        })

        if (product.size[0]!==''){setSize1(product.size[0]); setChecked_1(true)} else {setSize1(''); setChecked_1(false)}

        if (product.size[1]!==''){setSize2(product.size[1]); setChecked_2(true)} else {setSize2(''); setChecked_2(false)}

        if (product.size[2]!==''){setSize3(product.size[2]); setChecked_3(true)} else {setSize3(''); setChecked_3(false)}

        if (product.size[3]!==''){setSize4(product.size[3]); setChecked_4(true)} else {setSize4(''); setChecked_4(false)}

        if (product.size[4]!==''){setSize5(product.size[4]); setChecked_5(true)} else {setSize5(''); setChecked_5(false)}

        if (product.size[5]!==''){setSize6(product.size[5]); setChecked_6(true)} else {setSize6(''); setChecked_6(false)}

        if (product.size[6]!==''){setSize7(product.size[6]); setChecked_7(true)} else {setSize7(''); setChecked_7(false)}

        if (product.size[7]!==''){setSize8(product.size[7]); setChecked_8(true)} else {setSize8(''); setChecked_8(false)}

        if (product.size[8]!==''){setSize9(product.size[8]); setChecked_9(true)} else {setSize9(''); setChecked_9(false)}

        if (product.size[9]!==''){setSize10(product.size[9]); setChecked_10(true)} else {setSize10(''); setChecked_10(false)}
    }
    //console.log(size1,size2,size3,size4,size5,size6,size7,size8,size9,size10)
    // thêm hình ảnh
    const handleUpload = async e => {
        e.preventDefault()
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setImages(res.data)          

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleUpload1 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading1(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading1(false)
            setImages1(res.data)          

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleUpload2 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading2(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading2(false)
            setImages2(res.data)          

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleUpload3 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading3(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading3(false)
            setImages3(res.data)          

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa hình ảnh
    const handleDestroy = async () =>{
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setImages(false)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy1 = async () =>{
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            setLoading1(true)
            await axios.post('/api/destroy', {public_id: images1.public_id}, {
                headers: {Authorization: token}
            })
            setImages1(false)
            setLoading1(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy2 = async () =>{
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            setLoading2(true)
            await axios.post('/api/destroy', {public_id: images2.public_id}, {
                headers: {Authorization: token}
            })
            setImages2(false)
            setLoading2(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy3 = async () =>{
        try {
            if(!isAdmin&&!adminProduct) return alert('Bạn không phải Admin.')
            setLoading3(true)
            await axios.post('/api/destroy', {public_id: images3.public_id}, {
                headers: {Authorization: token}
            })
            setImages3(false)
            setLoading3(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // thay đổi data input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    // xử lý submit update
    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin&&!adminProduct) return alert('Quyền truy cập bị từ chối!')
            if(!images) return alert('Bạn chưa thêm hình ảnh 1. (Hình ảnh 1 là dữ liệu bắt buộc và không thể bỏ qua).')

            const res = await axios.put(`/api/products/${product._id}`, {...product, content: value, images, images1, images2, images3, size1, size2, size3, size4, size5, size6, size7, size8, size9, size10}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setCallback1(!callback1)
            setCallback2(!callback2)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    const styleUpload1 = {
        display: images1 ? "block" : "none"
    }

    const styleUpload2 = {
        display: images2 ? "block" : "none"
    }

    const styleUpload3 = {
        display: images3 ? "block" : "none"
    }

    // trở về trang quản lý sản phẩm
    const backToProManagement = ()=>{
        setupdatePro(!updatePro)
        setCheckCreatePro(false)
    }

    // xử lý lấy dữ liệu size chữ
    const handleSizeLetter = (value) => {
        if(value===1){
            if(checked_1===false&&size1===''){
                setSize1('S')
                setChecked_1(true)
            }
            else {
                setSize1('')
                setChecked_1(false)
            }
        }
        else if(value===2){
            if(checked_2===false&&size2===''){
                setSize2('M')
                setChecked_2(true)
            }
            else {
                setSize2('')
                setChecked_2(false)
            }
        }
        else if(value===3){
            if(checked_3===false&&size3===''){
                setSize3('L')
                setChecked_3(true)
            }
            else {
                setSize3('')
                setChecked_3(false)
            }
        }
        else if(value===4){
            if(checked_4===false&&size4===''){
                setSize4('XL')
                setChecked_4(true)
            }
            else {
                setSize4('')
                setChecked_4(false)
            }
        }
        else if(value===5){
            if(checked_5===false&&size5===''){
                setSize5('XXL')
                setChecked_5(true)
            }
            else {
                setSize5('')
                setChecked_5(false)
            }
        }
        else if(value===6) {
            if(checked_6===false&&size6===''){
                setSize6('XXXL')
                setChecked_6(true)
            }
            else {
                setSize6('')
                setChecked_6(false)
            }
        }
        else {
            if(checked_7===false&&size7===''){
                setSize7('Free Size')
                setChecked_7(true)
            }
            else {
                setSize7('')
                setChecked_7(false)
            }
        }
    }

    // xử lý lấy dữ liệu size số
    const handleSizeNumber = (value) =>{
        if(value===1){
            if(checked_1===false&&size1===''){
                setSize1('35')
                setChecked_1(true)
            }
            else {
                setSize1('')
                setChecked_1(false)
            }
        }
        else if(value===2){
            if(checked_2===false&&size2===''){
                setSize2('36')
                setChecked_2(true)
            }
            else {
                setSize2('')
                setChecked_2(false)
            }
        }
        else if(value===3){
            if(checked_3===false&&size3===''){
                setSize3('37')
                setChecked_3(true)
            }
            else {
                setSize3('')
                setChecked_3(false)
            }
        }
        else if(value===4){
            if(checked_4===false&&size4===''){
                setSize4('38')
                setChecked_4(true)
            }
            else {
                setSize4('')
                setChecked_4(false)
            }
        }
        else if(value===5){
            if(checked_5===false&&size5===''){
                setSize5('39')
                setChecked_5(true)
            }
            else {
                setSize5('')
                setChecked_5(false)
            }
        }
        else if(value===6){
            if(checked_6===false&&size6===''){
                setSize6('40')
                setChecked_6(true)
            }
            else {
                setSize6('')
                setChecked_6(false)
            }
        }
        else if(value===7){
            if(checked_7===false&&size7===''){
                setSize7('41')
                setChecked_7(true)
            }
            else {
                setSize7('')
                setChecked_7(false)
            }
        }
        else if(value===8){
            if(checked_8===false&&size8===''){
                setSize8('42')
                setChecked_8(true)
            }
            else {
                setSize8('')
                setChecked_8(false)
            }
        }
        else if(value===9){
            if(checked_9===false&&size9===''){
                setSize9('43')
                setChecked_9(true)
            }
            else {
                setSize9('')
                setChecked_9(false)
            }
        }
        else {
            if(checked_10===false&&size10===''){
                setSize10('44')
                setChecked_10(true)
            }
            else {
                setSize10('')
                setChecked_10(false)
            }
        }
    }

    // xử lý chọn loại kích cỡ chữ
    const optionsChoseSizeLetter = () => {
        setOptionSizeLetter(true)
        setOptionSizeNumber(false)
    }

    // xử lý chọn loại kích cỡ số
    const optionsChoseSizeNumber = () => {
        setOptionSizeNumber(true)
        setOptionSizeLetter(false)
    }

    // lấy dữ liệu từ summernote và đọc dữ liệu từ db vào summernote
    useEffect(()=>{
        var a=''
        products.forEach(el=>{
            if(el._id===product_id){
                return a = el.content
            }
        })

        if(quill){
            quill.on('text-change', ()=>{
                setValue(quillRef.current.firstChild.innerHTML)
            })
            quill.clipboard.dangerouslyPasteHTML(a)
        }
    },[quill])

  return (
    <>
    <div className="title-line-create-pro-ad">
        <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">Chỉnh sửa sản phẩm</div>
    </div>

    <div className="create_product">
        <div className="container-img">
            <div className="form-img">
                <div className="upload">
                    <input type="file" name="file" id="file_up" onChange={handleUpload} />
                    {
                        loading ? <div id="file_img"><LoadingMini/></div>
                        :<div id="file_img" style={styleUpload}>
                            <img src={images ? images.url: ''} alt="" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                    }
                    <input type="text" name="color" id="color" required value={product.color} placeholder="Nhập màu hình 1..."
                        onChange={handleChangeInput} />
                </div>

                <div className="upload">
                    <input type="file" name="file1" id="file_up1" onChange={handleUpload1} />
                    {
                        loading1 ? <div id="file_img1"><LoadingMini/></div>
                        :<div id="file_img1" style={styleUpload1}>
                            <img src={images1 ? images1.url: ''} alt="" />
                            <span onClick={handleDestroy1}>X</span>
                        </div>
                    }
                    <input type="text" name="color1" id="color1" required value={product.color1} placeholder="Nhập màu hình 2..."
                        onChange={handleChangeInput} />
                </div>

                <div className="upload">
                    <input type="file" name="file2" id="file_up2" onChange={handleUpload2} />
                    {
                        loading2 ? <div id="file_img2"><LoadingMini/></div>
                        :<div id="file_img2" style={styleUpload2}>
                            <img src={images2 ? images2.url: ''} alt="" />
                            <span onClick={handleDestroy2}>X</span>
                        </div>
                    }
                    <input type="text" name="color2" id="color2" required value={product.color2} placeholder="Nhập màu hình 3..."
                        onChange={handleChangeInput} />
                </div>

                <div className="upload">
                    <input type="file" name="file3" id="file_up3" onChange={handleUpload3} />
                    {
                        loading3 ? <div id="file_img3"><LoadingMini/></div>
                        :<div id="file_img3" style={styleUpload3}>
                            <img src={images3 ? images3.url: ''} alt="" />
                            <span onClick={handleDestroy3}>X</span>
                        </div>
                    }
                    <input type="text" name="color3" id="color3" required value={product.color3} placeholder="Nhập màu hình 4..."
                        onChange={handleChangeInput} />
                </div>
            </div>

            <div className="form-create">
                <div className="wrap-size">
                    <div className="container-size" style={optionSizeLetter?{display:'block'}:{display:'none'}}>
                        <span className="label-size">Kích cỡ gồm (size chữ): </span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(1)} style={checked_1?{backgroundColor:'#666',color:'#fff'}:{}}>S</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(2)} style={checked_2?{backgroundColor:'#666',color:'#fff'}:{}}>M</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(3)} style={checked_3?{backgroundColor:'#666',color:'#fff'}:{}}>L</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(4)} style={checked_4?{backgroundColor:'#666',color:'#fff'}:{}}>XL</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(5)} style={checked_5?{backgroundColor:'#666',color:'#fff'}:{}}>XXL</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(6)} style={checked_6?{backgroundColor:'#666',color:'#fff'}:{}}>XXXL</span>
                        <span className="size-pro" onClick={()=>handleSizeLetter(7)} style={checked_7?{backgroundColor:'#666',color:'#fff'}:{}}>Free Size</span>
                    </div>

                    <div className="container-size" style={optionSizeNumber?{display:'block'}:{display:'none'}}>
                        <span className="label-size">Kích cỡ gồm (size số): </span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(1)} style={checked_1?{backgroundColor:'#666',color:'#fff'}:{}}>35</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(2)} style={checked_2?{backgroundColor:'#666',color:'#fff'}:{}}>36</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(3)} style={checked_3?{backgroundColor:'#666',color:'#fff'}:{}}>37</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(4)} style={checked_4?{backgroundColor:'#666',color:'#fff'}:{}}>38</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(5)} style={checked_5?{backgroundColor:'#666',color:'#fff'}:{}}>39</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(6)} style={checked_6?{backgroundColor:'#666',color:'#fff'}:{}}>40</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(7)} style={checked_7?{backgroundColor:'#666',color:'#fff'}:{}}>41</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(8)} style={checked_8?{backgroundColor:'#666',color:'#fff'}:{}}>42</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(9)} style={checked_9?{backgroundColor:'#666',color:'#fff'}:{}}>43</span>
                        <span className="size-pro" onClick={()=>handleSizeNumber(10)} style={checked_10?{backgroundColor:'#666',color:'#fff'}:{}}>44</span>
                    </div>

                    <div className="container-size contain-optSi">
                        <span><i>(<b>Ghi chú:</b> Các ô đang tô đậm là kích cỡ hiện tại của sản phẩm.
                        Bấm vào ô trắng để thêm hoặc ô tô đậm để bỏ chọn.)</i></span>
                    </div>
                </div>

                <div className="form-item">
                    <div className="row-create-summernote">
                        <span>
                            <label className="label-create label-origin" htmlFor="product_id">Mã sản phẩm</label>
                            <input type="text" name="product_id" id="product_id" required value={product.product_id} 
                            onChange={handleChangeInput} disabled={true} />
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="title">Tên sản phẩm</label>
                            <input type="text" name="title" id="title" required value={product.title}
                            onChange={handleChangeInput} />
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="price">Giá</label>
                            <input type="text" inputMode="numeric" name="price" id="price" required value={product.price}
                            onChange={handleChangeInput} />
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="category">Thể loại: </label>&nbsp;
                            <select className="select-cre-pro-ad" name="category" value={product.category} onChange={handleChangeInput}>
                                <option value="">Chọn thể loại</option>
                                {
                                    catedories.map(category =>(
                                        <option value={category._id} key={category._id}>
                                            {category.name}
                                        </option>
                                    ))
                                }
                            </select>  
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="description">Chất liệu</label><br></br>
                            <input type="text" name="description" id="description" required value={product.description} rows="5"
                            onChange={handleChangeInput} />
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="status">Trạng thái: </label>
                            <select className="select-cre-pro-ad" name="status" value={product.status} onChange={handleChangeInput}>
                                <option value="">Chọn Trạng thái</option>
                                {
                                    status.map(statuss =>(
                                        <option value={statuss._id} key={statuss._id}>
                                            {statuss.name}
                                        </option>
                                    ))
                                }
                            </select>   
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="quantity_product">Số lượng</label>
                            <input type="text" inputMode="numeric" name="quantity_product" id="quantity_product" required value={product.quantity_product}
                            onChange={handleChangeInput} />
                        </span>

                        <span>
                            <label className="label-create label-origin" htmlFor="discount">Khuyến mãi</label>
                            <select name="discount" value={product.discount} onChange={handleChangeInput}>
                                <option value="">Không</option>
                                {
                                    discounts.map(discount =>(
                                        <option value={discount.persent} key={discount._id}>
                                            {discount.name}
                                        </option>
                                    ))
                                }
                            </select>  
                        </span>

                        <span></span>
                    </div>

                    <label className="label-desc" htmlFor="content">Mô tả</label>
                    <div className="summernote summer-updatePro" style={{height: 400}}>
                        <div ref={quillRef} />
                    </div>
                    <div className="btn-form-create-pro-ad">
                        <button className="btn-back-pro" onClick={backToProManagement}>Trở về</button>
                        <button className="btn-create-pro btn-update-pro" onClick={handleSubmit}>Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    </>
  )
}