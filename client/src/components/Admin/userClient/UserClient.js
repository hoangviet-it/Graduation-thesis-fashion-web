import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMoreUser from '../utilAdmin/LoadMoreUser'
import LoadMoreUserPayed from '../utilAdmin/LoadMoreUserPayed'
import LoadMoreUserNotPay from '../utilAdmin/LoadMoreUserNotPay'

export default function UserClient() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [clients] = state.inforClientAPI.inforClient
    const [users] = state.userAPI.users
    const [ObjectId, setObjectId] = useState([])
    const [active, setActive] = useState(0)
    const [idUser, setIdUser] = useState('')
    const [formDetail, setFormDetail] = useState(false)
    const [callback, setCallback] = state.userAPI.callback
    const [search, setSearch] = state.userAPI.search
    const [lockBackgr, setLockbackgr] = useState(false)
    const [reviews] = state.reviewsAPI.review
    const [userNotPay, setUserNotPay] = useState(false)
    const [userPay, setUserPay] = useState(false)
    const [userAll, setUserAll] = useState(true)

    const [result] = state.userAPI.result
    const [page, setPage] = state.userAPI.page
    const [productPaginating, setProductPaginating] = useState([])

    const [userPayedList] = state.userAPI.userPayed
    const [resultUserPayed] = state.userAPI.resultUserPayed
    const [pagePayed, setPagePayed] = state.userAPI.pagePayed
    const [searchPayed, setSearchPayed] = state.userAPI.searchPayed
    const [UserPayedPaginating, setUserPayedPaginating] = useState([])

    const [userNotPayList] = state.userAPI.userNotPay
    const [resultUserNotPay] = state.userAPI.resultUserNotPay
    const [pageNotPay, setPageNotPay] = state.userAPI.pageNotPay
    const [searchNotPay, setSearchNotPay] = state.userAPI.searchNotPay
    const [UserNotPayPaginating, setUserNotPayPaginating] = useState([])
    const [isAdmin] = state.userAPI.isAdmin

    //show danh sách khách hàng chưa mua hàng
    const showClientAll = () => {
        setUserAll(true)
        setUserPay(false)
        setUserNotPay(false)
        setActive(0)
    }

    const showClientPayed = ()=>{
        setUserAll(false)
        setUserPay(true)
        setUserNotPay(false)
        setActive(1)
    }
    
    const showClientNotPay = ()=>{
        setUserAll(false)
        setUserPay(false)
        setUserNotPay(true)
        setActive(2)
    }

    //xử lý lấy user id của tài khoản chưa mua hàng (ko có trog db inforClient)
    // useEffect(()=>{
    //     const getIdNotPay = ()=>{
    //         var a = []
    //         users.forEach(el=>{
    //             return a.push(el._id)
    //         })
    
    //         var b = []
    //         clients.forEach(el=>{
    //             return b.push(el.user_id)
    //         })
    
    //         //setUsserPayed(Object.assign({}, userArray.filter(value => -1 === clientArray.indexOf(value))))
    //         setObjectId(a.filter(value => -1 === b.indexOf(value)))     // dữ liệu không trùng giữ 2 mảng ( =>tài khoản chưa mua hàng)
    
    //         var temporary=[]
    //         users.filter(el=>{
    //             return ObjectId.forEach((i)=>{
    //                 if(el._id===i){
    //                     temporary.push(el)
    //                 }
    //             })
    //         })
    //         setUsserPayed(temporary)
    //     }
    //     getIdNotPay()
    // },[userNotPay])

    //lấy id user để show form chi tiết
    const showDetailUser = (id)=>{
        setIdUser(id)
        setFormDetail(true)
        setLockbackgr(true)
    }

    // đóng form detail user
    const closeDetail = ()=>{
        setFormDetail(false)
        setLockbackgr(false)
    }

    // cập nhật dissable vào db
    const dissableUser = async (id)=>{
        if(window.confirm("Bạn muốn khóa tài khoản này?"))
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: true}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // cập nhật dissable = false mở khóa cho user
    const enableUser = async (id)=>{
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: false}, {
                headers: {Authorization: token}
            })
            alert("Đã mở khóa!")
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa user bị khóa
    const deleteUserDisa = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            const res = await axios.delete(`user/deleteuser/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            deteleInforClient(id)
            deleteReview(id)
            setCallback(!callback)

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xóa thông tin khách hàng khi tài khoản bị xóa
    const deteleInforClient = (id)=>{
        try {
            clients.forEach(async el=>{
                if(el.user_id===id){
                    await axios.delete(`api/inforclient/${el._id}`, {
                        headers: {Authorization: token}
                    })
                }
            })

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xóa các đánh giá khi xóa tài khoản
    const deleteReview = (id)=>{
        try {
            reviews.filter(async rev=>{
                if(rev.user_id===id){
                    await axios.delete(`api/review/${rev._id}`, {
                        headers: {Authorization: token}
                    })
                }
            })

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // xử lý phân trang hiển thị user tương ứng với số trang
    useEffect(()=>{
        var a = []
        users.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*10){
                a.push(el)
                scroll()
            }
        })
        setProductPaginating(a)
    },[users, page])

    // xử lý phân trang hiển thị user đã mua tương ứng với số trang
    useEffect(()=>{
        var a = []
        userPayedList.forEach((el, index) => {
            if(index+1>resultUserPayed||index+1<=resultUserPayed&&index+1>(pagePayed-1)*10){
                a.push(el)
                scroll()
            }
        })
        setUserPayedPaginating(a)
    },[userPayedList, pagePayed])

    // xử lý phân trang hiển thị user chưa mua tương ứng với số trang
    useEffect(()=>{
        var a = []
        userNotPayList.forEach((el, index) => {
            if(index+1>resultUserNotPay||index+1<=resultUserNotPay&&index+1>(pageNotPay-1)*10){
                a.push(el)
                scroll()
            }
        })
        setUserNotPayPaginating(a)
    },[userNotPayList, pageNotPay])

    // set page phân trang về 1
    useEffect(()=>{
        setPage(1)
        setPagePayed(1)
        setPageNotPay(1)
    },[search, userNotPay, userPay, userAll, searchPayed, searchNotPay])


return (
    <div className={lockBackgr?"wrap-mana-user container-user-client-page":"container-user-client-page"}>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">QUẢN LÝ KHÁCH HÀNG</div>
        </div>

        <div className="btn-classify-user-ad">
            <button onClick={showClientAll} style={active===0?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Tất cả tài khoản</button>
            <button onClick={showClientPayed} style={active===1?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Đã đặt hàng</button>
            <button onClick={showClientNotPay} style={active===2?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Chưa đặt hàng</button>

            <input type="text" value={search} placeholder="Nhập mã tài khoản . . ." 
                onChange={e=>setSearch(e.target.value.trim())} style={userAll?{display:'inline-block'}:{display:'none'}} />
            <input type="text" value={searchPayed} placeholder="Nhập mã tài khoản . . ." 
                onChange={e=>setSearchPayed(e.target.value.trim())} style={userPay?{display:'inline-block'}:{display:'none'}} />
            <input type="text" value={searchNotPay} placeholder="Nhập mã tài khoản . . ." 
                onChange={e=>setSearchNotPay(e.target.value.trim())} style={userNotPay?{display:'inline-block'}:{display:'none'}} />
        </div>

        <div className="container-user-mana-ad" style={userAll?{display:'block'}:{display:'none'}}>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        productPaginating.map((user, index)=>{
                            if(user.role!==1) {
                                return <tr key={user._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td><span className="th-tablel-res-user">STT: </span>{index+1}</td>
                                    <td><span className="th-tablel-res-user">Mã tài khoản: </span>{user.user_id}</td>
                                    <td><span className="th-tablel-res-user">Tên tài khoản: </span>{user.name}</td>
                                    <td><span className="th-tablel-res-user">Email: </span>{user.email}</td>
                                    <td><span className="th-tablel-res-user">Ngày tạo: </span>{user.createdAt.slice(0,10)}</td>
                                    <td>
                                        <span className="btn-see-detail" onClick={()=>showDetailUser(user._id)}>Chi tiết</span>
                                    </td>
                                </tr>
                            }
                        })
                    }
                </tbody>
            </table>
            {productPaginating.length === 0 && <p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
            <LoadMoreUser/>
        </div>

        <div className="container-user-mana-ad" style={userPay?{display:'block'}:{display:'none'}}>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Tên khách hàng</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        UserPayedPaginating.map((user, index)=>{
                            return <tr key={user._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                <td><span className="th-tablel-res-user">STT: </span>{index+1}</td>
                                <td><span className="th-tablel-res-user">Mã tài khoản: </span>{user.user_id}</td>
                                <td><span className="th-tablel-res-user">Tên tài khoản: </span>{user.name}</td>
                                {
                                    clients.map(client=>{
                                        if(client.user_id===user._id){
                                            return <td key={user._id}><span className="th-tablel-res-user">Tên khách hàng: </span>{client.name_client}</td>
                                        }
                                    })
                                }
                                <td><span className="th-tablel-res-user">Email: </span>{user.email}</td>
                                <td><span className="th-tablel-res-user">Ngày tạo: </span>{user.createdAt.slice(0,10)}</td>
                                {
                                    clients.map(client=>{
                                        if(client.user_id===user._id){
                                            return <td key={client._id}>
                                                    <span className="btn-see-detail" onClick={()=>showDetailUser(client.user_id)}>Chi tiết</span>
                                                    {
                                                        user._id===client.user_id&&user.dissable===true ? <>
                                                        <span className="btn-see-detail btn-dissable" 
                                                            onClick={()=>enableUser(client.user_id)}>Mở khóa</span>
                                                        <span className="btn-see-detail btn-delete-user-disa"
                                                            onClick={()=>deleteUserDisa(client.user_id)}>Xóa</span></>
                                                        :
                                                        <span className="btn-see-detail btn-dissable" 
                                                            onClick={()=>dissableUser(client.user_id)}>Khóa</span>
                                                    }
                                                </td>
                                        }
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
            {UserPayedPaginating.length === 0 && <p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
            <LoadMoreUserPayed/>
        </div>

        <div className="detail-user-mana-ad" style={formDetail?{transition:'linear 0.3s'}:{top:'-1000px', transition:'linear 0.3s'}}>
            <h5>Thông tin chi tiết khách hàng</h5>
            <hr/>
            {
                clients.map((client, index)=>{
                    if(idUser===client.user_id){
                        return <div key={client._id} className="item-detail-user-ad">
                            {
                                users.map(user=>{
                                    if(client.user_id===user._id){
                                        return <p key={user._id}><span>Mã tài khoản:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {user.user_id}</p>
                                    }
                                })
                            }
                            {
                                users.map(user=>{
                                    if(client.user_id===user._id){
                                        return <p key={user._id}><span>Tên tài khoản:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {user.name}</p>
                                    }
                                })
                            }
                            <p><span>Tên khách hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.name_client}</p>
                            <p><span>Địa chỉ:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.address}</p>
                            <p><span>SĐT:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.phone}</p>
                            <p><span>Email:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.email}</p>
                            <p><span>Ngày tạo:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.createdAt.slice(0,10)}</p>
                            <p><span>Số đơn đã đặt:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.pays} đơn</p>
                        </div>
                    }
                })
            }
            <hr/>
            <span className="btn-form-detail" onClick={closeDetail}>Đóng</span>
        </div>

        <div className="table-user-payed" style={userNotPay?{display:'block'}:{display:'none'}}>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Ngày tạo</th>
                        <th>Ghi chú</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        UserNotPayPaginating.map((user, index)=>{
                            return <tr key={user._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                <td><span className="th-tablel-res-user">STT: </span>{index+1}</td>
                                <td><span className="th-tablel-res-user">Mã tài khoản: </span>{user.user_id}</td>
                                <td><span className="th-tablel-res-user">Tên tài khoản: </span>{user.name}</td>
                                <td><span className="th-tablel-res-user">Ngày tạo: </span>{user.createdAt.slice(0,10)}</td>
                                <td><span className="th-tablel-res-user">Ghi chú: </span>Chưa có thông tin<br/>
                                   (chưa mua hàng)</td>
                                <td>
                                    {                                              
                                        user.dissable===true ? 
                                        <>
                                            <span className="btn-see-detail btn-dissable" 
                                                onClick={()=>enableUser(user._id)}>Mở khóa</span>
                                            <span className="btn-see-detail btn-delete-user-disa"
                                                onClick={()=>deleteUserDisa(user._id)}>Xóa</span>
                                        </>
                                        :
                                        <span className="btn-see-detail btn-dissable" 
                                            onClick={()=>dissableUser(user._id)}>Khóa</span>
                                    }
                                </td>
                            </tr>
                        })
                    } 
                </tbody>
            </table>
            {UserNotPayPaginating.length === 0 && <p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
            <LoadMoreUserNotPay/>
        </div>
    </div>
  )
}
