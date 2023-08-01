import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'

export default function StatusManagement() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [status_pros, setStatus_pro] = state.statusAPI.status
    const [status_orders, setStatus_order] = state.statusOrderAPI.statusOrder
    const [callback, setCallback] = state.statusAPI.callback
    const [callback1, setCallback1] = state.statusOrderAPI.callback
    const [active, setActive] = useState(true)
    var [name, setName] = useState('')
    const [onEdit, setOnEdit] = useState(false)
    const [idStatus, setIdStatus] = useState('')
    const [move, setMove] = useState(false)
    const [adminProduct] = state.userAPI.adminProduct
    const [adminOrder] = state.userAPI.adminOrder
    const [isAdmin] = state.userAPI.isAdmin
    const [showFormAddStatusPro, setShowFormAddStatusPro] = useState(false)
    const [showFormAddStatusOrd, setShowFormAddStatusOrd] = useState(false)

    useEffect(()=>{
        if(adminOrder){setMove(true);setActive(false)}else{setMove(false);setActive(true)}
    },[adminOrder, adminProduct])
    
    // show bảng trạng thái sản phẩm
    const showStatusProduct = ()=>{
        if(isAdmin||adminProduct){
            setActive(true)
            setMove(false)
        }
        else
        {
            alert("Quyền truy cập bị từ chối!")
        }
    }
    
    // show bảng trạng thái đơn hàng
    const showStatusOrder = ()=>{
        if(isAdmin||adminOrder){
            setActive(false)
            setMove(true)
        }
        else {
            alert("Quyền truy cập bị từ chối!")
        }
    }

    // hiện form cập nhật
    const btnUpdate =(id)=>{
        setOnEdit(true)
        setIdStatus(id)
        setShowFormAddStatusPro(true)
        setShowFormAddStatusOrd(true)
    }

    // đóng form cập nhật
    const CloseUpdate =()=>{
        setOnEdit(false)
    }

     // xử lý thêm vào cập nhật trạng thái sản phẩm vào db
     const handleSubmit = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/status/${idStatus}`, {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback(!callback)
            }
            else {
                const res = await axios.post('api/status', {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback(!callback)
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    //  nút xóa trạng thái sản phẩm
    const btnDelete = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const res = await axios.delete(`/api/status/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // xử lý thêm vào cập nhật trạng thái sản phẩm vào db
    const handleSubmitStaOrder = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/statusorder/${idStatus}`, {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback1(!callback1)
            }
            else {
                const res = await axios.post('api/statusorder', {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback1(!callback1)
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    //  nút xóa trạng thái đơn hàng
    const btnDeleteStaOrder = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const res = await axios.delete(`/api/statusorder/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback1(!callback1)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // show form add ở responsive
    const ShowFormAdd = ()=> {
        setShowFormAddStatusOrd(true)
        setShowFormAddStatusPro(true)
        setOnEdit(false)
    }

    // đóng form add và update ở responsive
    const CloseFromAddUpdate = ()=>{
        setShowFormAddStatusOrd(false)
        setShowFormAddStatusPro(false)
    }


return (
    <>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad ttline-status-mana-list">QUẢN LÝ TRẠNG THÁI</div>
        </div>

        <div className="container-status-mana-ad">
            <span className="btn-mana-sta" onClick={showStatusProduct} style={active?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Sản phẩm</span>
            <span className="btn-mana-sta" onClick={showStatusOrder} style={!active?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Đơn hàng</span>

            <div className="element-status-pro container-category-mana-ad" style={!move?{display:'flex'}:{display:'none'}}>
                <div className="table-cate-pro-ad">
                    <span className="btn-add-status-res" onClick={ShowFormAdd}>Thêm mới</span>
                    <h5 className="tt-sta-pro-ad">Danh mục trạng thái sản phẩm</h5>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Tên trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Tùy chỉnh</th>
                            </tr>
                            {
                                status_pros.map((pro, index)=>{
                                    return <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index+1}</td>
                                        <td>{pro.name}</td>
                                        <td>{pro.createdAt.slice(0,10)}</td>
                                        <td>
                                            <span><img onClick={()=>btnUpdate(pro._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                            <span><img onClick={()=>btnDelete(pro._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="form-create-cate-ad form-create-sta-ad" style={showFormAddStatusPro?{left:'50%'}:{}}>
                    <span className="close-form-add-sta-ad" onClick={CloseFromAddUpdate}>X</span>
                    {
                        onEdit?<h5>Cập nhật trạng thái sản phẩm</h5>:<h5>Thêm trạng thái sản phẩm</h5>
                    }
                    {   
                        onEdit?
                        status_pros.map(pro=>{
                            if(pro._id===idStatus){
                                return <p key={pro._id}><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>Tên trạng thái: </span> &nbsp;{pro.name}</p>
                            }
                        }):''
                    }
                    <input type="text" name="name" value={name} required onChange={e=>setName(e.target.value)} placeholder="Nhập tên mới..." />
                    <br></br>
                    <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmit}>{onEdit?"Cập nhật":"Thêm"}</span>
                    <br/>
                    <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
                </div>
            </div>

            <div className="element-status-order" style={move?{display:'flex'}:{display:'none'}}>
                <div className="table-cate-pro-ad">
                    <span className="btn-add-status-res" onClick={ShowFormAdd}>Thêm mới</span>
                    <h5 className="tt-sta-pro-ad">Danh mục trạng thái đơn hàng</h5>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Tên trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Tùy chỉnh</th>
                            </tr>
                            {
                                status_orders.map((ord, index)=>{
                                    return <tr key={ord._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index+1}</td>
                                        <td>{ord.name}</td>
                                        <td>{ord.createdAt.slice(0,10)}</td>
                                        <td>
                                            <span><img onClick={()=>btnUpdate(ord._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                            <span><img onClick={()=>btnDeleteStaOrder(ord._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="form-create-cate-ad" style={showFormAddStatusOrd?{left:'50%'}:{}}>
                    <span className="close-form-add-sta-ad" onClick={CloseFromAddUpdate}>X</span>
                    {
                        onEdit?<h5>Cập nhật trạng thái đơn hàng</h5>:<h5>Thêm trạng thái đơn hàng</h5>
                    }
                    {   
                        onEdit?
                        status_orders.map(ord=>{
                            if(ord._id===idStatus){
                                return <p><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>
                                    Tên trạng thái: </span> &nbsp;{ord.name}</p>
                            }
                        }):''
                    }
                    <input type="text" name="name" value={name} required onChange={e=>setName(e.target.value)} placeholder="Nhập tên mới..." />
                    <br></br>
                    <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmitStaOrder}>{onEdit?"Cập nhật":"Thêm"}</span>
                    <br/>
                    <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
                </div>
            </div>
        </div>
    </>
  )
}
