import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMore from '../../mainpages/products/LoadMore'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import Loading from '../../mainpages/utils/loading/Loading'
import CreateProduct from '../../mainpages/createProduct/CreateProduct'
import UpdateProduct from '../../Admin/updateProduct/UpdateProduct'
import Check from '../../header/icon/check.svg'

export default function ProductManagement() {
    const state = useContext(GlobalState)
    const [productsAll] = state.productsAPI.productsAdmin
    const [categories] = state.categoriesAPI.categories
    const [status] = state.statusAPI.status
    const [category, setCategory] =state.productsAPI.category
    const [createProduct, setCreateProduct] = state.productsAPI.createProduct
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [callback, setCallback] = state.productsAPI.callback
    const [callback1, setCallback1] = state.productsAPI.callback1
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [product_id, setProduct_id] = state.productsAPI.product_id
    const [checkCreatePro, setCheckCreatePro] = state.productsAPI.checkCreatePro
    const [result] = state.productsAPI.resultAd
    const [page, setPage] = state.productsAPI.page
    const [productPaginating, setProductPaginating] = useState([])
    const [valueSearchQuantity, setVlueSearchQuantity] = useState('')
    const [searchQuantity, setSearchQuantity] = state.productsAPI.searchQuantity
    const [methodSearchQuantity, setMethodSearchQuantity] = useState('')

    const [checkBox, setCheckBox] = useState(false)
    const [valueSelect, setValueSelect] = useState('')
    const [CheckAll, setCheckAll] = useState(false)
    const [proAll] = state.productsAPI.productAll

    const [isAdmin] = state.userAPI.isAdmin
    const [adminOrder] = state.userAPI.adminOrder
    const [adminProduct] = state.userAPI.adminProduct
    const [isShipper] = state.userAPI.isShipper

    // show component thêm sản phẩm mới
    const ShowCreateProduct = () =>{
        setCreateProduct(!createProduct)
        setCheckCreatePro(true)
    }

    // xóa sản phẩm
    const deleteProduct = async (id, public_id, public_id1, public_id2, public_id3) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            setLoading(true)
            const ress = await axios.post('/api/destroy', {public_id, public_id1, public_id2, public_id3},{
                headers: {Authorization: token}
            })

            const res = await axios.delete(`/api/products/${id}`,{
                headers: {Authorization: token}
            })
            alert(res.data.msg)        
            setCallback(!callback)
            setCallback1(!callback1)
            setLoading(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const updateProduct = (id)=> {
        setupdatePro(!updatePro)
        setProduct_id(id)
        setCheckCreatePro(true)
    }

    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        productsAll.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*9){
                a.push(el)
                scroll()
            }
        })
        setProductPaginating(a)
    },[productsAll, page])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // set page phân trang về trang 1 khi lọc thể loại hoặc trạng thái
    useEffect(()=>{
        setPage(1)
    },[category])

    // cập nhật checked trong db (chức năng xóa tất cả)
    const updateCheckPro = async (e)=>{
        var a
        productsAll.forEach(el=>{
            if(el._id===e.target.value){
                if(el.checked===false){
                    a = true
                }
                else {
                    a = false
                }
            }
        })
        
        try {
            const res =  await axios.put(`/api/check_products/${e.target.value}`, {checked: a},{
                headers: {Authorization: token}
            })
            setCallback(!callback)
            setCallback1(!callback1)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý click vào select chọn xóa tất cả
    useEffect(()=>{
        if(valueSelect==='0'){
            setCheckBox(false)
            setCheckAll(false)
        }
        else if(valueSelect==='1'){
            setCheckBox(true)
            setCheckAll(false)
        }
        else if(valueSelect==='2'){
            setCheckBox(false)
            setCheckAll(true)
        }
    },[valueSelect])

    // cập nhật tất cả checked thành true
    useEffect(()=>{
        if(CheckAll){
            const updateCheckAll = async ()=>{
                try {
                    await axios.put(`/api/check_all`,{},{
                        headers: {Authorization: token}
                    })
                    setCallback(!callback)
                    setCallback1(!callback1)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            updateCheckAll()
        }
        else {
            const cancelCheck = async ()=>{
                try {
                    await axios.put(`/api/cancel_check`,{},{
                        headers: {Authorization: token}
                    })
                    setCallback(!callback)
                    setCallback1(!callback1)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            cancelCheck()
        }
    },[CheckAll, checkBox])

    // xóa sản phẩm đã check
    const deleteProChecked = (e)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa?"))
        proAll.forEach(async el=>{
            if(el.checked){
                try {
                    setLoading(true)
                    const ress = await axios.post('/api/destroy', {public_id: el.images.public_id, public_id1: el.images1.public_id, public_id2: el.images2.public_id, public_id3: el.images3.public_id},{
                        headers: {Authorization: token}
                    })
        
                    const res = await axios.delete(`/api/products/${el._id}`,{
                        headers: {Authorization: token}
                    })

                    setCallback(!callback)
                    setLoading(false)
                    setCheckBox(false)
                    setCheckAll(false)
        
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        })
    }

    // xử lý search sản phẩm theo số lượng
    useEffect(()=>{
        var data=[], sumQuantity=[]
        proAll.forEach(el=>{
            sumQuantity.push(el.quantity_product)
        })
        var max = Math.max(...sumQuantity)

        if(methodSearchQuantity==='<'){
            if(valueSearchQuantity!==''){
                for(let i=0;i<valueSearchQuantity.length;i++){
                    if(/[0-9]/g.test(valueSearchQuantity[i])){
                        for(let i=0;i<parseInt(valueSearchQuantity);i++){
                            data.push(`&quantity_product=${i}`)
                        }
                    }
                    else {
                        alert("Dữ liệu nhập vào phải là số!")
                        setVlueSearchQuantity(valueSearchQuantity.slice(0,-1))
                    }
                }
                setSearchQuantity(data.join``)
            }
            else {
                setSearchQuantity('')
            }
        }
        else if(methodSearchQuantity==='>'){
            if(valueSearchQuantity!==''){
                for(let i=0;i<valueSearchQuantity.length;i++){
                    if(/[0-9]/g.test(valueSearchQuantity[i])){
                        if(parseInt(valueSearchQuantity)>=max){
                            data.push(`&quantity_product=${max+1}`)
                        }
                        else {
                            for(let i=parseInt(valueSearchQuantity)+1;i<=max;i++){
                                data.push(`&quantity_product=${i}`)
                            }
                        }
                    }
                    else {
                        alert("Dữ liệu nhập vào phải là số!")
                        setVlueSearchQuantity(valueSearchQuantity.slice(0,-1))
                    }
                }
                setSearchQuantity(data.join``)
            }
            else {
                setSearchQuantity('')
            }
        }
        else if(methodSearchQuantity==='='){
            if(valueSearchQuantity!==''){
                for(let i=0;i<valueSearchQuantity.length;i++){
                    if(/[0-9]/g.test(valueSearchQuantity[i])){
                        data.push(valueSearchQuantity[i])
                    }
                    else {
                        alert("Dữ liệu nhập vào phải là số!")
                        setVlueSearchQuantity(valueSearchQuantity.slice(0,-1))
                    }
                }
                setSearchQuantity(`&quantity_product=${data.join``}`)
            }
            else {
                setSearchQuantity('')
            }
        }
        else if(methodSearchQuantity===''){
            if(valueSearchQuantity!==''){
                alert("Chưa chọn phương thức tìm kiếm!")
                setVlueSearchQuantity('')
                setSearchQuantity('')
            }
            else {
                setSearchQuantity('')
            }
        }

        // if(valueSearchQuantity!==''){
        //     var a=[]
        //     for(let i=0;i<valueSearchQuantity.length;i++){
        //         if(/[0-9]/g.test(valueSearchQuantity[i])){
        //             a.push(valueSearchQuantity[i])
        //         }
        //         else {
        //             alert("Dữ liệu nhập vào phải là số!")
        //             setVlueSearchQuantity(valueSearchQuantity.slice(0,-1))
        //         }
        //     }
        //     setSearchQuantity(a.join``)
        // }
        // else {
        //     setSearchQuantity('')
        // }

    },[methodSearchQuantity, valueSearchQuantity])


return (
    <>
    {
        loading ? <div style={{marginTop:'150px'}}><Loading/></div>
        :
        <div className="container-promana">
            {
                createProduct ? <CreateProduct/>
                : updatePro ? <UpdateProduct/> 
                : 
            <div>
                <div className="createPro-and-title">
                    <h5>QUẢN LÝ SẢN PHẨM</h5>

                    <div className="element-create">
                        <span>
                            <span>Tìm theo trạng thái: </span>
                            <select className="filter-pro-ad" value={category} onChange={e=>setCategory(e.target.value)}>
                                <option value={''}>Tất cả</option>
                                {
                                    status.map(sta =>{
                                        return <option key={sta._id} value={`status=${sta._id}`}>{sta.name}</option>
                                    })
                                }
                            </select>
                        </span>
                        <span>
                            <span>Tìm theo thể loại: </span>
                            <select className="filter-pro-ad" value={category} onChange={e=>setCategory(e.target.value)}>
                                <option value={''}>Tất cả</option>
                                {
                                    categories.map(cate =>{
                                        return <option key={cate._id} value={`category=${cate._id}`}>{cate.name}</option>
                                    })
                                }
                            </select>
                        </span>
                        <p className="btn-create-pro-ad" onClick={ShowCreateProduct}>Thêm sản phẩm</p>
                    </div>
                </div>

                <div className="option-select-all">
                    <select value={valueSelect} onChange={(e)=>{setValueSelect(e.target.value)}}>
                        <option value={'0'}>{CheckAll||checkBox?"Bỏ chọn":"Chọn"}</option>
                        <option value={'1'}>Chọn nhiều</option>
                        <option value={'2'}>Chọn tất cả</option>
                    </select>
                    <button onClick={deleteProChecked}>Xóa</button>

                    <span className="wrap-search-quantity">
                        <span className="title-search-quantity">Tìm theo số lượng: </span>
                        <select value={methodSearchQuantity} onChange={(e)=>setMethodSearchQuantity(e.target.value)}>
                            <option value={''}>{methodSearchQuantity===''?"Chọn":"Bỏ chọn"}</option>
                            <option value={'<'}>Nhỏ hơn</option>
                            <option value={'>'}>Lớn hơn</option>
                            <option value={'='}>Bằng</option>
                        </select>
                        <span className="input-search-quantity">
                            <input type="text" value={valueSearchQuantity} placeholder="Nhập số lượng"
                                onChange={e=>setVlueSearchQuantity(e.target.value.trim())} />
                        </span>
                    </span>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Khuyến mãi</th>
                            <th>Ngày tạo</th>
                            <th>Thể loại</th>
                            <th>Trạng thái</th>
                            <th className="setting-pro-mana-table">Tùy chỉnh</th>
                        </tr>
                        {
                            productPaginating.map((pro, index) =>{
                                return <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td className="collum-table-mana-pro">
                                        <input type="checkbox" name="checkbox" id="check-delete-all" readOnly checked={pro.checked} value={pro._id} onClick={updateCheckPro} style={checkBox||CheckAll?{display:'inline'}:{display:'none'}} />
                                        <span className="th-table-respon">STT: </span>{index+1}
                                    </td>
                                    <td className="collum-table-mana-pro img-pro-table"><span className="th-table-respon">Hình ảnh: </span><img src={pro.images.url} alt=''></img></td>
                                    <td className="collum-table-mana-pro"><span className="th-table-respon">Mã sản phẩm: </span>{pro.product_id}</td>
                                    <td className="collum-table-mana-pro"><p className="title-pro-listmana"><span className="th-table-respon">Tên sản phẩm: </span>{pro.title}</p></td>
                                    <td className="collum-table-mana-pro">
                                        {
                                            pro.discount>0 ? <p><span className="th-table-respon">Giá sản phẩm: </span>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")}đ<br></br>
                                                <del>{pro.price.toLocaleString("en")}đ</del>
                                            </p>
                                            :<p><span className="th-table-respon">Giá sản phẩm: </span>{pro.price.toLocaleString("en")}đ</p>
                                        }
                                    </td>
                                    <td className="collum-table-mana-pro"><span className="th-table-respon">Số lượng: </span>{pro.quantity_product}</td>
                                    <td className="collum-table-mana-pro"><span className="th-table-respon">Khuyến mãi: </span>{pro.discount}%</td>
                                    <td className="collum-table-mana-pro"><span className="th-table-respon">Ngày tạo: </span>{pro.createdAt.slice(0,10)}</td>
                                    {
                                        categories.map(cate =>{
                                            if(pro.category===cate._id){
                                                return <td key={cate._id} className="collum-table-mana-pro"><span className="th-table-respon">Thể loại: </span>{cate.name}</td>
                                            }
                                        })
                                    }

                                    {
                                        status.map(sta =>{
                                            if(pro.status===sta._id){
                                                return <td key={sta._id} className="collum-table-mana-pro"><span className="th-table-respon">Tình trạng: </span>{sta.name}</td>
                                            }
                                        })
                                    }
                                    <td className="collum-table-mana-pro setting-pro-mana-table">
                                        <span><img onClick={()=>updateProduct(pro._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                        <span><img onClick={()=>deleteProduct(pro._id, pro.images.public_id, pro.images1.public_id, pro.images2.public_id, pro.images3.public_id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <br></br>
                {productPaginating.length===0&&<p className="notify-not-found-pro-mana">Không tìm thấy kết quả</p>}
                <LoadMore/>
            </div>
            }
        </div>
    }
    </>
  )
}
