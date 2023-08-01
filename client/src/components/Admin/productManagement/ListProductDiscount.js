import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../../mainpages/utils/loading/Loading'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import UpdateProduct from '../updateProduct/UpdateProduct'
import LoadMoreDiscountPro from '../../mainpages/discount/LoadMoreDiscountPro'

export default function ListProductDiscount() {
    const state = useContext(GlobalState)
    const [productsAll] = state.productsAPI.discountProducts
    const [categories] = state.categoriesAPI.categories
    const [status] = state.statusAPI.status
    const [category, setCategory] = state.productsAPI.category
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [callback, setCallback] = state.productsAPI.callback
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [product_id, setProduct_id] = state.productsAPI.product_id
    const [search, setSearch] = state.productsAPI.searchProAd
    const [listProDis, setlistProDis] = useState([])
    const [page, setPage] = state.productsAPI.pageDis
    const [result] = state.productsAPI.resultDiscountPro

    // nút xóa sản phẩm
    const deleteProduct = async (id, public_id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            setLoading(true)
            await axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })

            const res = await axios.delete(`/api/products/${id}`,{
                headers: {Authorization: token}
            })
            alert(res.data.msg)        
            setCallback(!callback)
            setLoading(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // nút cập nhật sản phẩm
    const updateProduct = (id)=> {
        setupdatePro(!updatePro)
        setProduct_id(id)
    }

    // số lượng sản phẩm đang khuyến mãi
    // useEffect(()=>{
    //     var a=0
    //     productsAll.forEach(el=>{
    //         if(el.discount!==0){
    //             a++
    //         }
    //     })
    //     setAmountProDisc(a)
    // })

    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        productsAll.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*8){
                a.push(el)
                scroll()
            }
        })
        setlistProDis(a)
    },[productsAll, page])

    useEffect(()=>{
        setPage(1)
    },[search, category])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

  return (
        <>
            {
                updatePro ? <UpdateProduct/>
                :
                loading ? <div style={{marginTop:'150px'}}><Loading/></div>
                :
                <div className="container-promana list-pro-cont-ad">
                    <div className="createPro-and-title">
                            <h5>SẢN PHẨM KHUYẾN MÃI</h5>
                            <input type="text" value={search} placeholder="Nhập mã sản phẩm . . ." 
                                onChange={e=>setSearch(e.target.value.trim())} />
                            <span className="filter-discount-pro-page-ad">
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
                    </div>

                    <table style={{marginBottom:'20px'}}>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Khuyến mãi</th>
                                <th>Ngày tạo</th>
                                <th>Thể loại</th>
                                <th>Trạng thái</th>
                                <th className="setting-pro-mana-table">Tùy chỉnh</th>
                            </tr>
                            {
                                listProDis.map((pro, index) =>{
                                    if(pro.discount!==0){
                                    return  <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                            <td className="collum-table-mana-pro"><span className="th-table-respon">STT: </span>{index+1}</td>
                                            <td className="collum-table-mana-pro img-pro-table"><span className="th-table-respon">Hình ảnh: </span><img src={pro.images.url} alt=''></img></td>
                                            <td className="collum-table-mana-pro"><span className="th-table-respon">Mã sản phẩm: </span>{pro.product_id}</td>
                                            <td className="collum-table-mana-pro"><span className="th-table-respon">Tên sản phẩm: </span>{pro.title}</td>
                                            <td className="collum-table-mana-pro" style={{paddingTop:'20px'}}>
                                                {
                                                    pro.discount>0 ? <p><span className="th-table-respon">Giá sản phẩm: </span>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")}đ<br></br>
                                                        <del>{pro.price.toLocaleString("en")}đ</del>
                                                    </p>
                                                    :<p><span className="th-table-respon">Giá sản phẩm: </span>{pro.price.toLocaleString("en")}đ</p>
                                                }
                                            </td>
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
                                                <span><img onClick={()=>deleteProduct(pro._id,pro.images.public_id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                            </td>
                                        </tr>
                                    }
                                })
                            }
                        </tbody>
                    </table>
                    {listProDis.length === 0 && <p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
                    <LoadMoreDiscountPro/>
                </div>
            }
        </>
  )
}
