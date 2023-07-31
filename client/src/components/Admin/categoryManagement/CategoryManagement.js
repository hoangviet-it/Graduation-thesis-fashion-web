import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import LoadingMini from '../../mainpages/utils/loading/LoadingMini'
import ObjectCategoryManagment from '../objectCaregoryManagement/ObjectCategoryManagment'

export default function CategoryManagement() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [objectCates] = state.categoriesAPI.objectCategory
    const [token] = state.token
    var [name, setName] = useState('')
    const [onEdit, setOnEdit] = useState(false)
    const [idCategory, setIdcategory] = useState('')
    const [callback, setCallback] = state.categoriesAPI.callback
    const [showFormAddCate, setShowFormAddCate] = useState(false)

    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [images, setImages] = useState(false)
    const [objects] = state.categoriesAPI.objectCategory
    const [objectCategory, setObjectCategory] = useState('')
    const [checkObjPage, setCheckObjPage] = state.categoriesAPI.checkObjPage
    const [adminProduct] = state.userAPI.adminProduct

    // hiện form cập nhật
    const btnUpdate =(id)=>{
        setOnEdit(true)
        setIdcategory(id)
        scroll()
        setShowFormAddCate(true)
    }

    // đóng form cập nhật
    const CloseUpdate =()=>{
        setOnEdit(false)
        setImages(false)
        setName('')
        setIdcategory('')
    }

    // xử lý thêm vào cập nhật thể loại
    const handleSubmit = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/category/${idCategory}`, {name: name, images, object: objectCategory}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setCallback(!callback)
            }
            else {
                const res = await axios.post('api/category', {name: name, images, object: objectCategory}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setImages(false)
                setObjectCategory('')
                setCallback(!callback)
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // lấy id khi click vào nút xóa
    const btnDelete = async (id, public_id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const ress = await axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })
            setImages(false)
            setName('')

            const res = await axios.delete(`/api/category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // định dạng style hiển thị ảnh
    const styleUpload = {
        display: images ? "block" : "none"
    }

    // xóa hình
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

    // thêm hình
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

    // check dữ liệu để hiển thị
    useEffect(() =>{
        if(idCategory){
            categories.forEach(catedogy =>{
                if(catedogy._id === idCategory){
                    setImages(catedogy.images)
                    setName(catedogy.name)
                    setObjectCategory(catedogy.object)
                }
            })
        }
        else{
            setImages(false)
            setName('')
            setObjectCategory('')
        }
    }, [idCategory])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // show form tạo thể loại khi responsive
    const ShowFormAddCate = ()=>{
        setShowFormAddCate(true)
        CloseUpdate()
    }

return (
    <>  
        {
            checkObjPage?<ObjectCategoryManagment/> :
            <div className="container-cate-mana-ad">
                <div className="title-line-create-pro-ad">
                    <div className="item-tt-line-cre-pro-ad">QUẢN LÝ THỂ LOẠI</div>
                </div>

                <div className="length-and-btnObjectcate">
                    <h6 style={{marginLeft:'20px', marginTop:'10px'}}><span>Số lượng: </span>{categories.length} thể loại</h6>
                    <div className="wrap-btn-cate-ad">
                        <div className="btn-objectCate" onClick={()=>setCheckObjPage(true)}>Đối tượng thể loại</div>
                        <div className="btn-add-category" onClick={ShowFormAddCate}>Thêm thể loại</div>
                    </div>
                </div>
                
                <div className="container-category-mana-ad">
                    <div className="table-cate-pro-ad">
                        <h5 className="tt-sta-pro-ad">Danh mục thể loại sản phẩm</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên thể loại</th>
                                    <th>Ngày tạo</th>
                                    <th>Thuộc đối tượng</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                                {
                                    categories.map((cate, index)=>{
                                        return <tr key={cate._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                            <td>{index+1}</td>
                                            <td>{cate.name}</td>
                                            <td>{cate.createdAt.slice(0,10)}</td>
                                            {
                                                objectCates.map(obj=>{
                                                    if(cate.object===obj._id){
                                                        return <td key={obj._id}>{obj.name}</td>
                                                    }
                                                })
                                            }
                                            <td>
                                                <span><img onClick={()=>btnUpdate(cate._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                                <span><img onClick={()=>btnDelete(cate._id, cate.images.public_id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="form-create-cate-ad" style={showFormAddCate?{left:'0'}:{}}>
                        <span className="close-form-add-cate" onClick={()=>setShowFormAddCate(false)}>X</span>
                        {
                            onEdit?<h5>Cập nhật thể loại</h5>:<h5>Thêm thể loại</h5>
                        }
                        {   
                            onEdit?
                            categories.map(cate=>{
                                if(cate._id===idCategory){
                                    return <p key={cate._id}><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>Tên thể loại: </span> &nbsp;{cate.name}</p>
                                }
                            }):''
                        }

                        <div className="upload-img-cate">
                            <input type="file" name="file" id="file-img-cate" onChange={handleUpload} onClick={e => (e.target.value = null)} />
                            {
                                loading ? <div id="wrap_img"><LoadingMini/></div>
                                :<div id="wrap_img" style={styleUpload}>
                                    <img src={images ? images.url: ''} alt="" />
                                    <span onClick={handleDestroy}>X</span>
                                </div>
                            }
                        </div>

                        <input type="text" name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nhập tên thể loại..." />

                        <select className="select-object-cate" value={objectCategory} onChange={(e)=>setObjectCategory(e.target.value)}>
                            <option value={''}>Chọn đối tượng</option>
                            {
                                objects.map(obj=>{
                                    return <option key={obj._id} value={obj._id}>{obj.name}</option>
                                })
                            }
                        </select>
                        <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmit}>{onEdit?"Cập nhật":"Thêm"}</span>
                        <br/>
                        <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
                    </div>
                </div>
            </div>
        }
    </>
  )
}
