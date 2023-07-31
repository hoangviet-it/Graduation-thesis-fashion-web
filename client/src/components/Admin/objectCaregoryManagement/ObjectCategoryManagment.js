import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'

export default function ObjectCategoryManagment() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [objects] = state.categoriesAPI.objectCategory
    const [callback, setCallback] = state.categoriesAPI.callback
    const [checkObjPage, setCheckObjPage] = state.categoriesAPI.checkObjPage
    const [onEdit, setOnEdit] = useState(false)
    const [id, setId] = useState('')
    var [name, setName] = useState('')
    const [showFormAddObj, setShowFormAddObj] = useState(false)

    // hiện form cập nhật
    const btnUpdate =(id)=>{
        setOnEdit(true)
        setId(id)
        setShowFormAddObj(true)
    }

    // lấy id khi click vào nút xóa
    const btnDelete = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const res = await axios.delete(`/api/object_category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // xử lý thêm vào cập nhật thể loại
    const handleSubmit = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/object_category/${id}`, {name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setCallback(!callback)
                setName('')
            }
            else {
                const res = await axios.post('api/object_category', {name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setCallback(!callback)
                setName('')
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // đóng form cập nhật
    const CloseUpdate =()=>{
        setOnEdit(false)
        setId('')
        setName('')
    }

    // show form tạo đối tượng khi responsive
    const ShowFormAddObj = ()=>{
        setShowFormAddObj(true)
        CloseUpdate()
    }

    return (
        <div className="container-cate-mana-ad">
            <div className="title-line-create-pro-ad">
                <div className="item-tt-line-cre-pro-ad object-header-infor-mana">QUẢN LÝ ĐỐI TƯỢNG THỂ LOẠI</div>
            </div>
            <div className="length-and-btnObjectcate">
                <h6 style={{marginLeft:'20px', marginTop:'10px'}}><span>Số lượng: </span>{objects.length} đối tượng</h6>
                <div className="wrap-btn-cate-ad">
                    <div className="btn-objectCate btn-cate-in-obj" onClick={()=>setCheckObjPage(false)}>Thể loại</div>
                    <div className="btn-add-category" onClick={ShowFormAddObj}>Thêm đối tượng</div>
                </div>
            </div>
            <div className="container-obj-cate-mana container-category-mana-ad">
                <div className="list-table-obj-cate table-cate-pro-ad">
                    <h5 className="tt-sta-pro-ad">Danh mục đối tượng thể loại</h5>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Ngày tạo</th>
                                <th>Tùy chỉnh</th>
                            </tr>
                            {
                                objects.map((obj, index)=>{
                                    return <tr key={obj._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index+1}</td>
                                        <td>{obj.name}</td>
                                        <td>{obj.createdAt.slice(0,10)}</td>
                                        <td>
                                            <span><img onClick={()=>btnUpdate(obj._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                            <span><img onClick={()=>btnDelete(obj._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="form-data-obj-cate form-create-cate-ad" style={showFormAddObj?{left:'0'}:{}}>
                    <span className="close-form-add-cate" onClick={()=>setShowFormAddObj(false)}>X</span>
                    {
                        onEdit?<h5>Cập nhật đối tượng thể loại</h5>:<h5>Thêm đối tượng thể loại</h5>
                    }
                    {   
                        onEdit?
                        objects.map(obj=>{
                            if(obj._id===id){
                                return <p key={obj._id}><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>Tên đối tượng: </span> &nbsp;{obj.name}</p>
                            }
                        }):''
                    }

                    <input type="text" name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nhập tên mới..." />
                    <br/>
                    <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmit}>{onEdit?"Cập nhật":"Thêm"}</span>
                    <br/>
                    <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
                </div>
            </div>
        </div>
    )
}
