import React, {useContext, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import close from '../../header/icon/close.svg'

export default function DiscountManagement() {
    const state = useContext(GlobalState)
    const [discounts] = state.discountAPI.discount
    const [token] = state.token
    const [callback, setCallback] = state.discountAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [idDiscount, setIdDiscount] = useState('')
    var [name, setName] = useState('')
    var [persent, setPersent] = useState(0)
    var [code, setCode] = useState('')
    const [showForm, setShowform] = useState(false)

     // hiện form cập nhật
     const btnUpdate =(id)=>{
        setOnEdit(true)
        setIdDiscount(id)
        setShowform(true)
    }

    // đóng form cập nhật
    const CloseUpdate =()=>{
        setOnEdit(false)
    }

      // xử lý thêm vào cập nhật
      const handleSubmit = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/discount/${idDiscount}`, {name: name, persent: persent, code: code}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setPersent(0)
                setCode('')
                setCallback(!callback)
                setShowform(false)
            }
            else {
                const res = await axios.post('api/discount', {name: name, persent: persent}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setPersent(0)
                setCode('')
                setCallback(!callback)
                setShowform(false)
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    //  nút xóa 
    const btnDelete = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const res = await axios.delete(`/api/discount/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // btn đóng form
    const closeForm = ()=>{
        setShowform(false)
    }

    const showFormCreate = ()=>{
        setShowform(true)
        setOnEdit(false)
    }

  return (
    <div className="container-discount-list-ad">
        <div className="title-line-create-pro-ad tt-line-mana-disc">
            <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">quản lý khuyến mãi</div>
            <span onClick={showFormCreate}>Thêm khuyến mãi</span>
        </div>

        <div className={showForm?"backgr-black-disable margin-left-table-disc":"container-discount-mana-ad container-category-mana-ad"}>
            <div className="table-cate-pro-ad table-disc-mana">
                <h5 className="tt-sta-pro-ad">Danh mục các loại khuyến mãi</h5>
                <table>
                    <tbody>
                        <tr>
                            <th className="th-disc-ad">STT</th>
                            <th className="th-disc-ad">Loại KM</th>
                            <th className="th-disc-ad">Số%</th>
                            <th className="th-disc-ad">Mã khuyến mãi</th>
                            <th className="th-disc-ad">Ngày cập nhật</th>
                            <th className="th-disc-ad">Tùy chỉnh</th>
                        </tr>
                        {
                            discounts.map((discount, index)=>{
                                return <tr key={discount._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td className="td-disc-ad"><span className="th-table-respon-disc">STT: </span>{index+1}</td>
                                    <td className="td-disc-ad"><span className="th-table-respon-disc">Tên khuyến mãi: </span>{discount.name}</td>
                                    <td className="td-disc-ad"><span className="th-table-respon-disc">Số phần trăm: </span>{discount.persent}</td>
                                    <td className="td-disc-ad"><span className="th-table-respon-disc">Mã khuyến mãi: </span>{discount.code}</td>
                                    <td className="td-disc-ad"><span className="th-table-respon-disc">Ngày cập nhật: </span>{discount.updatedAt.slice(0,10)}</td>
                                    <td className="td-disc-ad">
                                        <span><img onClick={()=>btnUpdate(discount._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                        <span><img onClick={()=>btnDelete(discount._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className={!showForm?"form-create-cate-ad form-create-update-disc-mana":"form-create-cate-ad showForm-create-upfate"}>
                <span className="btn-close-form-create-disc" onClick={closeForm}><img src={close} alt=''></img></span>
                {
                    onEdit?<h5>Cập nhật thông tin khuyến mãi</h5>:<h5>Thêm loại khuyến mãi mới</h5>
                }
                {   
                    onEdit?
                    discounts.map(discount=>{
                        if(discount._id===idDiscount){
                            return <p key={discount._id} style={{textAlign:'center'}}><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>
                                Loại khuyến mãi: </span> &nbsp;{discount.name}</p>
                        }
                    }):''
                }
                
                {
                    onEdit?<>
                        <input type="text" name="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="Nhập mã khuyến mãi..." />
                    </>
                    : <>
                        <label htmlFor="name" className="label-form-mana-disc">Tên loại khuyến mãi:</label>
                        <input type="text" name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nhập tên..." />
                        <label htmlFor="persent" className="label-form-mana-disc">Số phần trăm (%):</label>
                        <input type="number" name="persent" value={persent} onChange={e=>setPersent(e.target.value)} placeholder="Nhập số % ..." />
                    </>
                }
                <br></br>
                <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmit}>{onEdit?"Cập nhật":"Thêm"}</span>
                <br/>
                <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
            </div>
        </div>
    </div>
  )
}
