import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import close from '../../header/icon/close.svg'
import LoadMore from '../../mainpages/products/LoadMore'

export default function ReviewManagement() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [reviews] = state.reviewsAPI.review
    const [callback, setCallback] = state.reviewsAPI.refresh
    const [users] = state.userAPI.users
    const [idUser, setIdUser] = useState('')
    const [products] = state.productsAPI.productAll
    const [productPaga] = state.productsAPI.products
    const [checkReview, setCheckReview] = useState(false)
    const [view, setView] = useState(0)
    const [bgDisableDet, setBgDisableDet] = useState(false)
    const [active, setActive] = useState(true)
    const [idPro, setIdPro] = useState('')
    const [viewPro, setViewPro] = useState(0)
    const [search, setSearch] = state.productsAPI.search
    const [searchUser, setSearchUser] = state.userAPI.search
    const [reviewPageUser, setReviewPageUser] = useState(false)
    const [reviewPagePro, setReviewPagePro] = useState(false)
    const [reviewPageAll, setReviewPageAll] = useState(true)
    const [idReviewAll, setIdReviewAll] = useState('')
    const [notify] = state.notifyAPI.notify
    const [newNotify, setNewNotify] = useState(0)

    const [checkBox, setCheckBox] = useState(false)
    const [valueSelect, setValueSelect] = useState('')
    const [CheckAll, setCheckAll] = useState(false)

    // lấy data của newOrder trong db Notify
    useEffect(()=>{
        const tickNewOrder = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setNewNotify(el.newReview)
                }
            })
        }
        tickNewOrder()
    })

    // nút lick vào xem các đánh giá của tài khoản
    const DetailReview = (id) =>{
        setIdUser(id)
        var count=0
        reviews.forEach(el=>{
            if(id===el.user_id){
                count++
            }
        })
        count===0?setCheckReview(false):setCheckReview(true)
        setBgDisableDet(true)
    }

    // detail review product
    const ReviewPro = (id) =>{
        setIdPro(id)
        var count=0
        reviews.forEach(el=>{
            if(id===el.product){
                count++
            }
        })
        count===0?setCheckReview(false):setCheckReview(true)
        setBgDisableDet(true)
    }

    // xử lý lượt đánh giá của tài khoản
    useEffect(()=>{
        var count=0
        const checkamount = ()=>{
            reviews.forEach(el=>{
                if(idUser===el.user_id){
                    count++
                }
            })
        }
        checkamount()
        setView(count)
    },[idUser])

    // xử lý lượt đánh giá của sản phẩm
    useEffect(()=>{
        var count=0
        const checkamount = ()=>{
            reviews.forEach(el=>{
                if(idPro===el.product){
                    count++
                }
            })
        }
        checkamount()
        setViewPro(count)
    },[idPro])

    // đóng chi tiết các đánh giá
    const closeDetail = () =>{
        setBgDisableDet(false)
    }

    //show dang sách tất cả đánh giá
    const showReviewAll = ()=>{
        setReviewPageAll(true)
        setReviewPagePro(false)
        setReviewPageUser(false)
    }

    //show danh sách đánh giá theo sản phẩm
    const showReviewProduct = ()=>{
        setReviewPagePro(true)
        setReviewPageUser(false)
        setReviewPageAll(false)
        setActive(false)
    }

    // show danh sách đánh giá theo tài khoản
    const showReviewUser = ()=>{
        setReviewPageUser(true)
        setReviewPagePro(false)
        setReviewPageAll(false)
        setActive(false)
    }

    // xóa đánh giá
    const deleteReview = async (id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa?"))
        try {
            const res = await axios.delete(`api/review/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // show detail review all
    const detailReviewAll = (id)=>{
        setIdReviewAll(id)
    }

    // đóng chi tiết review all
    const closeDetailRevAll = ()=>{
        setIdReviewAll('')
    }

    // cập nhật checked trong db (chức năng xóa tất cả)
    const updateCheckReview = async (e)=>{
        var a
        reviews.forEach(el=>{
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
            const res =  await axios.put(`/api/check_review/${e.target.value}`, {checked: a},{
                headers: {Authorization: token}
            })
            setCallback(!callback)

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
                    await axios.put(`/api/check_all_review`,{},{
                        headers: {Authorization: token}
                    })
                    setCallback(!callback)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            updateCheckAll()
        }
        else {
            const cancelCheck = async ()=>{
                try {
                    await axios.put(`/api/cancel_check_review`,{},{
                        headers: {Authorization: token}
                    })
                    setCallback(!callback)

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
        reviews.forEach(async el=>{
            if(el.checked){
                try {       
                    const res = await axios.delete(`/api/review/${el._id}`,{
                        headers: {Authorization: token}
                    })

                    setCallback(!callback)
                    setCheckBox(false)
                    setCheckAll(false)
        
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        })
    }


return (
    <div className={bgDisableDet||idReviewAll!==''?"bg-black-opa-review container-review-ad":"container-review-ad"} >
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad">QUẢN LÝ ĐÁNH GIÁ</div>
        </div>

        <div className="btn-classify-user-ad">
            <button onClick={showReviewAll} style={!active?{border:'1px solid #FF9900',borderRadius:'5px',padding:'5px 10px',color:'#000'}:{borderRadius:'5px',padding:'5px 10px',color:'#000',backgroundColor:'#FFCC00',boxShadow:'0px 0px 6px #aaa'}}>
                Tất cả</button>
            <button onClick={showReviewUser}>
                Theo tài khoản</button>
            <button onClick={showReviewProduct}>
                Theo sản phẩm</button>
            <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                onChange={e=>setSearch(e.target.value.toLowerCase())} style={reviewPagePro?{display:'inline'}:{display:'none'}} />
            <input type="text" value={searchUser} placeholder="Nhập mã tài khoản . . ." 
                onChange={e=>setSearchUser(e.target.value)} style={reviewPageUser?{display:'inline'}:{display:'none'}} />
        </div>

        <div className="container-review-all-ad" style={reviewPageAll?{display:'block'}:{display:'none'}}>
            <div className="table-rev-all-ad">
                <h5 className="tt-rev-all-ad">Tất cả đánh giá</h5>
                <div className="option-select-all">
                    <select value={valueSelect} onChange={(e)=>{setValueSelect(e.target.value)}}>
                        <option value={'0'}>{CheckAll||checkBox?"Bỏ chọn":"Chọn"}</option>
                        <option value={'1'}>Chọn nhiều</option>
                        <option value={'2'}>Chọn tất cả</option>
                    </select>
                    <button onClick={deleteProChecked}>Xóa</button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã sản phẩm</th>
                            <th>Sản phẩm</th>
                            <th>Mã tài khoản</th>
                            <th>Tên tài khoản</th>
                            <th>Ngày đăng</th>
                            <th>Tùy chỉnh</th>
                        </tr>
                        {
                            reviews.map((rev, index)=>{
                                return <tr key={rev._id} className={newNotify===0?"row-review-all-ad":(index+1)<=newNotify?"tickNewOrd row-review-all-ad":"row-review-all-ad"} 
                                            style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td>
                                        <input type="checkbox" name="checkbox" id="check-delete-all" readOnly checked={rev.checked} value={rev._id} onClick={updateCheckReview} style={checkBox||CheckAll?{display:'inline'}:{display:'none'}} />
                                        <span className="th-table-respon-review">STT: </span>{index+1}
                                    </td>
                                    {
                                        products.map(pro=>{
                                            if(pro._id===rev.product){
                                                return <td key={pro._id}><span className="th-table-respon-review">Mã sản phẩm: </span>{pro.product_id}</td>
                                            }
                                        })
                                    }
                                    {
                                        products.map(pro=>{
                                            if(pro._id===rev.product){
                                                return <td key={pro._id}><span className="th-table-respon-review">Tên sản phẩm: </span>{pro.title}</td>
                                            }
                                        })
                                    }
                                    {
                                        users.map(user=>{
                                            if(user._id===rev.user_id){
                                                return <td key={user._id}><span className="th-table-respon-review">Mã tài khoản: </span>{user.user_id}</td>
                                            }
                                        })
                                    }
                                    <td><span className="th-table-respon-review">Tên tài khoản: </span>{rev.username}</td>
                                    <td><span className="th-table-respon-review">Ngày đăng: </span>{rev.createdAt.slice(0,10)}</td>
                                    <td>
                                        {
                                            <>
                                                <span className="btn-see-detail-rep-pro" onClick={()=>detailReviewAll(rev._id)}>Chi tiết</span>
                                                <span className="btn-delete-rev-all" onClick={()=>deleteReview(rev._id)}>Xóa</span>
                                            </>
                                        }
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            {
                <div className={idReviewAll!==''?"detail-review-all-ad":"hide-detail-rev-all"}>
                    <div className="tt-and-ctnClose">
                        <h5>Nội dung đánh giá</h5>
                        <p onClick={closeDetailRevAll}>X</p>
                    </div>
                    {
                        reviews.map(rev=>{
                            if(rev._id===idReviewAll){
                                return <div key={rev._id} className="content-rev-all-deta">
                                    <p><span style={{fontWeight: '500'}}>Mức độ dánh giá: </span>{rev.star} sao</p>
                                    <p><span style={{fontWeight: '500'}}>Bình luận: </span><br/><i>"{rev.content}"</i></p>
                                </div>
                            }
                        })
                    }
                </div>
            }
        </div>

        <div className="container-review-mana-ad" style={reviewPageUser?{display:'block'}:{display:'none'}}>
            <div className="table-cate-pro-ad table-reviw-pro-ad">
                <h5 className="tt-sta-pro-ad">Danh mục đánh giá theo tài khoản</h5>
                <table>
                    <tbody>
                        <tr>
                            <th className="table-rev-data-ad">STT</th>
                            <th className="table-rev-data-ad">Mã tài khoản</th>
                            <th className="table-rev-data-ad">Tên tài khoản</th>
                            <th className="table-rev-data-ad">Email</th>
                            <th className="table-rev-data-ad">Các đánh giá</th>
                        </tr>
                        {
                            users.map((user, index)=>{
                                if(user.role===0){
                                    return <tr key={user._id} style={(index)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td className="td-table-revUsser"><span className="th-table-respon-revUser">STT: </span>{index+1}</td>
                                        <td className="td-table-revUsser"><span className="th-table-respon-revUser">Mã tài khoản: </span>{user.user_id}</td>
                                        <td className="td-table-revUsser"><span className="th-table-respon-revUser">Tên tài khoản: </span>{user.name}</td>
                                        <td className="td-table-revUsser"><span className="th-table-respon-revUser">Email: </span>{user.email}</td>
                                        <td className="td-table-revUsser">
                                            <span className="btn-detail-review-ad" onClick={()=>DetailReview(user._id)}>Xem</span>
                                        </td>
                                    </tr>
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>

            {
                checkReview?
                <div className={!bgDisableDet?"detail-review-mana-ad":"show-detai-review-ad"}>
                    <div className="header-detail-review">
                        <p><span>Tổng đánh giá: </span>{view} lượt</p>
                        <p className="wrap-img-close-review" onClick={closeDetail}><img className="img-close-detail-review" src={close} alt=''></img></p>
                    </div>
                    {
                        users.map(user=>{
                            if(user._id===idUser){
                                return <>
                                    <p><span>Mã tài khoản: </span>{user.user_id}</p>
                                    <p><span>Tài khoản: </span>{user.name}</p>
                                </>
                            }
                        })
                    }
                    {
                        reviews.map((rev, index)=>{
                            if(rev.user_id===idUser){
                                return <div key={rev._id} className="item-detail-review-ad">
                                    <p><span>Đánh giá: </span>{rev.star} sao</p>
                                    <p><span>Bình luận: </span>"{rev.content}"</p>
                                    {
                                        products.map(pro=>{
                                            if(pro._id===rev.product){
                                                return <>
                                                    <p><span>Sản phẩm: </span>{pro.title}</p>
                                                    <p><span>Mã sản phẩm: </span>{pro.product_id}</p>
                                                </>
                                            }
                                        })
                                    }
                                    <p><span>Ngày đăng: </span>{rev.createdAt.slice(0,10)}</p>
                                    <p className="btn-delete-review" onClick={()=>deleteReview(rev._id)}>Xóa</p>
                                </div>
                            }
                        })
                    }
                </div>
                :
                <div className={!bgDisableDet?"detail-review-mana-ad":"show-detai-review-ad detail-user-not-review"}>
                    <span>Tài khoản chưa có đánh giá nào!</span>
                    <p onClick={closeDetail}>Đóng</p>
                </div>
            }
        </div>

        <div className="container-review-mana-ad list-review-pro-ad" style={reviewPagePro?{display:'block'}:{display:'none'}}>
            <div className="table-cate-pro-ad table-reviw-pro-ad">
                <h5 className="tt-sta-pro-ad">Danh mục đánh giá theo sản phẩm</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Các đánh giá</th>
                        </tr>
                        {
                            productPaga.map((pro, index)=>{
                                {
                                    return <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index+1}</td>
                                        <td><img className="img-pro-rev-ad" src={pro.images.url} alt=''></img></td>
                                        <td>{pro.product_id}</td>
                                        <td>{pro.title}</td>
                                        <td>
                                            <span className="btn-detail-review-ad" onClick={()=>ReviewPro(pro._id)}>Xem</span>
                                        </td>
                                    </tr>
                                }
                            })
                        }
                    </tbody>
                </table>
                <LoadMore/>
            </div>

            {
                checkReview?
                <div className={!bgDisableDet?"detail-review-mana-ad":"show-detai-review-ad"}>
                    <div className="header-detail-review">
                        <p><span>Tổng đánh giá: </span>{viewPro} lượt</p>
                        <p className="wrap-img-close-review" onClick={closeDetail}><img className="img-close-detail-review" src={close} alt=''></img></p>
                    </div>
                        {
                            products.map(pro=>{
                                if(idPro===pro._id){
                                    return <>
                                        <p><span>Mã sp: </span>{pro.product_id}</p>
                                        <p><span>Sản phẩm: </span>{pro.title}</p>
                                    </>
                                }
                            })
                        }
                    {
                        reviews.map((rev, index)=>{
                            if(rev.product===idPro){
                                return <div key={rev._id} className="item-detail-review-ad">
                                    <p><span>Đánh giá: </span>{rev.star} sao</p>
                                    <p><span>Bình luận: </span>"{rev.content}"</p>
                                    {
                                        users.map(user=>{
                                            if(user._id===rev.user_id){
                                                return <div key={user._id}>
                                                    <p><span>Mã tài khoản: </span>{user.user_id}</p>
                                                    <p><span>Tên tài khoản: </span>{user.name}</p>
                                                </div>
                                            }
                                        })
                                    }
                                    <p><span>Ngày đăng: </span>{rev.createdAt.slice(0,10)}</p>
                                    <p className="btn-delete-review" onClick={()=>deleteReview(rev._id)}>Xóa</p>
                                </div>
                            }
                        })
                    }
                </div>
                :
                <div className={!bgDisableDet?"detail-review-mana-ad":"show-detai-review-ad detail-user-not-review"}>
                    <span>Sản phẩm chưa có đánh giá nào!</span>
                    <p onClick={closeDetail}>Đóng</p>
                </div>
            }
        </div>
    </div>
  )
}
