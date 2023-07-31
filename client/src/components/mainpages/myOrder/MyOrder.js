import React, {useState, useContext, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import user from '../../header/icon/user-solid.svg'
import UpHeadPage from '../../header/icon/up.svg'
import axios from 'axios'
import LoadMoreMyOder from './LoadMoreMyOder'
import 'aos/dist/aos.css'
import Aos from 'aos'
import HeaderFixed from '../../header/HeaderFixed'
// import { set } from 'mongoose'

export default function MyOrder() {
    const state = useContext( GlobalState)
    const [token] = state.token
    const [myOrder] = state.orderAPI.myOrder
    const [users] = state.userAPI.users
    const [ship] = useState(30000)
    const [statusOrder] = state.statusOrderAPI.statusOrder
    const [username] = state.userAPI.user
    const [userId] = state.userAPI.user_id
    const [clients] = state.inforClientAPI.inforClient
    const [detail, setDetail] = useState(false)
    const [idOrder, setIdOrder] = useState('')
    const [callback, setcallback] = state.orderAPI.callback
    const [notify] = state.notifyAPI.notify
    const [statusMyOrd, setStatusMyOrd] = state.orderAPI.statusMyOrd
    const [checkFocusAll, setCheckFocusAll] = useState(true)
    const [checkFocusAwait, setCheckFocusAwait] = useState(false)
    const [checkFocusDelivering, setCheckFocusDelivering] = useState(false)
    const [checkFocusDelivered, setCheckFocusDelivered] = useState(false)
    const [checkFocusCanceled, setCheckFocusCanceled] = useState(false)
    const [checkFocusProcessing, setCheckFocusProcessing] = useState(false)
    const [toDay, setToDay] = useState(0)
    const [lastDay, setLastDay] = useState(0)
    const [firstDay, setFirstDay] = useState(0)
    const [month, setMonth] = useState(0)
    const [firstDayNextMonth, setFirstDayNextMonth] = useState(0)
    const [nextMonth, setNextMonth] = useState(0)
    const [delivery, setDeliveryDate] = useState('')
    const [myOrderAll] = state.orderAPI.myOrderAll
    const [lengthWait, setLengthWait] = useState(0)
    const [lengthProcessing, setLengthProcessing] = useState(0)
    const [lengthDelivering, setLengthDelivering] = useState(0)
    const [lengthDelivered, setLengthDelivered] = useState(0)
    const [lengthCancel, setLengthCancel] = useState(0)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [orders] = state.orderAPI.order
    const [order_id, setOrder_id] = useState('')
    const [header, setHeader] = useState(false)

    const [page, setPage] = state.orderAPI.pageMyOrder
    const [result] = state.orderAPI.resultMyOder
    const [listOrder, setListOrder] = useState([])
    const [showFormInforAcc, setShowFormInforAcc] = useState(false)

    //xử lý truyền id của đơn hàng để xem chi tiết đơn hàng
    const DetailMyOrder = (id_Odrder) =>{
        setDetail(true)
        setIdOrder(id_Odrder)
        scroll()
    }

    // xử lý quay lại trang đơn hàng của tôi
    const BackToMyOrder = () =>{
        setDetail(false)
    }

    // xử lý hủy đơn hàng
    const CancelOrder = async (id) =>{
        var b=[]
        myOrder.forEach(el=>{
            if(id===el._id){
                el.product.forEach(k=>{
                    b.push({"id":k._id, "quantity":k.quantity})
                })
            }
        })

        var a = '632878eca2e7052bc439f97a'
        if(window.confirm("Bạn muốn hủy đơn hàng này?"))
        try {
            await axios.patch(`/api/order/${id}`, {status_order: a, arrPro: b}, {
                headers: {Authorization: token}
            })
            setcallback(!callback)
            alert('Đã hủy đơn hàng!')
            cancelOrder()
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý thông báo khi hủy đơn hàng
    const cancelOrder = ()=>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_cancelorder/${'635cd52464f5b7334c594007'}`, {cancelOrder: el.cancelOrder+1}, {
                    headers: {Authorization: token}
                })
            })
            localStorage.setItem('reload', true)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // tự động reload trang khi tìm thấy item 'reload' trong localStorage
    useEffect(()=>{
        if(localStorage.getItem('reload')){
            window.location.reload()
            localStorage.removeItem('reload')
        }
    })

    // lọc theo tình trạng đơn hàng
    const handleStatusOrd = (sta, check) => {
        setPage(1)
        setStatusMyOrd(sta)
        if(check===1){
            setCheckFocusAll(true)
            setCheckFocusAwait(false)
            setCheckFocusDelivering(false)
            setCheckFocusDelivered(false)
            setCheckFocusCanceled(false)
            setCheckFocusProcessing(false)
        }
        else if(check===2){
            setCheckFocusAll(false)
            setCheckFocusAwait(true)
            setCheckFocusDelivering(false)
            setCheckFocusDelivered(false)
            setCheckFocusCanceled(false)
            setCheckFocusProcessing(false)
        }
        else if(check===3){
            setCheckFocusAll(false)
            setCheckFocusAwait(false)
            setCheckFocusDelivering(true)
            setCheckFocusDelivered(false)
            setCheckFocusCanceled(false)
            setCheckFocusProcessing(false)
        }
        else if(check===4){
            setCheckFocusAll(false)
            setCheckFocusAwait(false)
            setCheckFocusDelivering(false)
            setCheckFocusDelivered(true)
            setCheckFocusCanceled(false)
            setCheckFocusProcessing(false)
        }
        else if(check===5){
            setCheckFocusAll(false)
            setCheckFocusAwait(false)
            setCheckFocusDelivering(false)
            setCheckFocusDelivered(false)
            setCheckFocusCanceled(true)
            setCheckFocusProcessing(false)
        }
        else if(check===6){
            setCheckFocusAll(false)
            setCheckFocusAwait(false)
            setCheckFocusDelivering(false)
            setCheckFocusDelivered(false)
            setCheckFocusCanceled(false)
            setCheckFocusProcessing(true)
        }
    }

    // xử lý lấy mã đơn hàng tự động (nếu order_id trong db ko tồn tại useeffect sẽ bị lỗi => đơn hàng mới không có sản phẩm)
    useEffect(()=>{
        var a=''; var b=0
        const getOrd_id = ()=>{
            orders.forEach((el, i)=>{
                if(i===0){
                    a=(el.order_id)
                }
            })
        }
        getOrd_id()

        b = (Number.parseInt((a.slice(2)),10)+1)
        if(b<10){
            setOrder_id('DH0'+ b.toString())
        }
        else if(b>=10) {
            setOrder_id('DH'+ b.toString())
        }
    })

    // xử lý đặt hàng lại
    const handleReOrder = (id) =>{
        if(window.confirm("Bạn muốn đặt lại đơn hàng này?"))
        myOrder.forEach(async el=>{
            if(el._id===id){
                try {
                    const res = await axios.post('/api/order', {order_id, email: el.email, address: el.address, phone: el.phone, name_client: el.name_client, note: el.note, money: el.total, deliveryDate: delivery}, {
                        headers: {Authorization: token}
                    })
                    updateNotifyOrder()
                    setProductOrder(id)
                    setDeliveryDate('')
                    updateReorder(id)
                    setcallback(!callback)
                    localStorage.setItem('reload', true)
                    
                } catch (err) {
                    alert(err.response.data.msg)
                }

            }
        })
    }

    // cập nhật lại số lượng (trừ đi) sản phẩm khi đặt lại đơn hàng đã hủy //(được gọi ở hàm handleReOrder)
    const updateReorder = async (id)=>{
        var a=[]
        myOrder.forEach(el=>{
            if(id===el._id){
                el.product.forEach(k=>{
                    a.push({"id":k._id, "quantity":k.quantity})
                })
            }
        })

        try {
            await axios.put(`/api/update_quantity_reorder`, {listPro: a}, {
                headers: {Authorization: token}
            })
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // update newOder trong db Notify để hiển thị thông báo khi đặt lại dơn hàng (tb đơn hàng mới)
    const updateNotifyOrder = () =>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_neworder/${'635cd52464f5b7334c594007'}`, {newOrder: el.newOrder+1}, {
                    headers: {Authorization: token}
                })
            })

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // set dữ liệu sản phẩm của đơn hàng cũ vô đơn hàng mới
    const setProductOrder = (id)=>{
        myOrder.forEach(async el=>{
            if(el._id===id){
                try {
                    const res = await axios.patch('/api/order', {cart: el.product}, {
                        headers: {Authorization: token}
                    })
                    alert("Đặt lại đơn hàng thành công!")
                    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        })
    }

    // xử lý lấy ngày hiện tại, tháng hiện tại, ngày đầu tháng sau, tháng sau
    useEffect(()=>{
        const getTime = () =>{
            var day = new Date()
            var td = day.getDate()

            setToDay(day.getDate()) // ngày hiện tại

            var firstDay = new Date(day.getFullYear(), day.getMonth(), 1); // ngày đầu của tháng hiện tại (tháng chữ + ngày)
            var lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0); // ngày cuối của tháng hiện tại (tháng chữ + ngày)

            setFirstDay(firstDay.toString().slice(8,10))
            setLastDay(lastDay.toString().slice(8,10))

            var monthLetter = firstDay.toString().slice(4,7) // tháng hiện tại (chữ)
            var monthNumber = 0 // tháng hiện tại (số)
            if(monthLetter==='Jan'){setMonth(1); monthNumber= 1}
            else if(monthLetter==='Feb'){setMonth(2); monthNumber= 2}
            else if(monthLetter==='Mar'){setMonth(3); monthNumber= 3}
            else if(monthLetter==='Apr'){setMonth(4); monthNumber= 4}
            else if(monthLetter==='May'){setMonth(5); monthNumber= 5}
            else if(monthLetter==='Jun'){setMonth(6); monthNumber= 6}
            else if(monthLetter==='Jul'){setMonth(7); monthNumber= 7}
            else if(monthLetter==='Aug'){setMonth(8); monthNumber= 8}
            else if(monthLetter==='Sept'||monthLetter==='Sep'){setMonth(9); monthNumber= 9}
            else if(monthLetter==='Oct'){setMonth(10); monthNumber= 10}
            else if(monthLetter==='Nov'){setMonth(11); monthNumber= 11}
            else if(monthLetter==='Dec'){setMonth(12); monthNumber= 12}

            if((lastDay&&monthLetter!=='Dec')||(!lastDay&&monthLetter!=='Dec')){
                setFirstDayNextMonth(1) // ngày đầu tháng sau
                setNextMonth(monthNumber+1) // tháng sau
            }
            if((lastDay&&monthLetter==='Dec')||(!lastDay&&monthLetter==='Dec')){
                setFirstDayNextMonth(1)
                setNextMonth(1)
            }
        }
        getTime()
        scroll()
    },[])

    // set dữ liệu thời gian giao hàng về database orders
    useEffect(()=>{
        const dataDeliveryDate = ()=>{
            var a; var b; var c; var d
            (parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay?a=toDay+3:(parseInt(lastDay,10))===toDay?a=firstDayNextMonth+2:(parseInt(lastDay,10))-1===toDay?a=firstDayNextMonth+1:(parseInt(lastDay,10))-2===toDay?a=firstDayNextMonth:a=toDay+3;
            (parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay?b=nextMonth:b=month;
            (parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay&&(parseInt(lastDay,10))-3!==toDay?c=toDay+4:(parseInt(lastDay,10))===toDay?c=firstDayNextMonth+3:(parseInt(lastDay,10))-1===toDay?c=firstDayNextMonth+2:(parseInt(lastDay,10))-2===toDay?c=firstDayNextMonth+1:(parseInt(lastDay,10))-3===toDay?c=firstDayNextMonth:c=toDay+4;
            (parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay||(parseInt(lastDay,10))-3===toDay?d=nextMonth:d=month;
            setDeliveryDate('từ '+a+' tháng '+b+' - '+c+' tháng '+d)
        }
        dataDeliveryDate()
    })
    
    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        myOrder.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*5){
                a.push(el)
                scroll()
            }
        })
        setListOrder(a)
    },[myOrder, page])

    // set số lượng của từng trạng thái đơn hàng (length)
    useEffect(()=>{
        const getLength = ()=>{
            var a=0, b=0, c=0, d=0, e=0
            myOrderAll.forEach(el=>{
                if(el.status_order==='6328789da2e7052bc439f977') {a++}
                if(el.status_order==='632878d7a2e7052bc439f978') {b++}
                if(el.status_order==='632878dea2e7052bc439f979') {c++}
                if(el.status_order==='632878eca2e7052bc439f97a') {d++}
                if(el.status_order==='63f2ef4cd97a1405d8775168') {e++}
            })
            setLengthWait(a)
            setLengthDelivering(b)
            setLengthDelivered(c)
            setLengthCancel(d)
            setLengthProcessing(e)
        }
        getLength()
    },[myOrderAll])

    // định dạng style cho button option order
    const styleAll = {
        backgroundColor: checkFocusAll?'#eee':'',
        borderRadius: checkFocusAll?'5px':''
    }
    const styleAwait = {
        backgroundColor: checkFocusAwait?'#eee':'',
        borderRadius: checkFocusAwait?'5px':''
    }
    const styleDelivering = {
        backgroundColor: checkFocusDelivering?'#eee':'',
        borderRadius: checkFocusDelivering?'5px':''
    }
    const styleDelivered = {
        backgroundColor: checkFocusDelivered?'#eee':'',
        borderRadius: checkFocusDelivered?'5px':''
    }
    const styleCanceled = {
        backgroundColor: checkFocusCanceled?'#eee':'',
        borderRadius: checkFocusCanceled?'5px':''
    }
    const styleProcessing = {
        backgroundColor: checkFocusProcessing?'#eee':'',
        borderRadius: checkFocusProcessing?'5px':''
    }

    // hiệu ứng scroll page
    // hiện nút back to
    useEffect(()=>{
        Aos.init({duration: 1000})

        // hiện nút back to
        window.onscroll = ()=> {
            const scrollFunction = ()=> {
                if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                    setBtnBackTop(true)
                } else {
                    setBtnBackTop(false)
                }
            }
            scrollFunction()

            const scrollheader = ()=> {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    setHeader(true)
                } else {
                    setHeader(false)
                }
            }
            scrollheader()
        }
    },[])

    return (
        <>
            {
                header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
            }
            <div className="container-myOrder">
                <div className="crumb">
                    <Link to='/' className="crumb-homepage">
                        <img src={Home} alt=''></img>
                        <span>Trang chủ</span>
                    </Link>
                    <img src={Next} alt=''></img>
                    <span className="crumb-name">Đơn hàng của tôi</span>
                </div>

                <div className="wrap-myorder">
                    <div className="inf-client" data-aos="fade-right" data-aos-once="true" style={showFormInforAcc?{left:'0'}:{}}>
                        <h4>Thông tin tài khoản</h4>
                        <div className="inf-icon-client">
                            <img src={user} alt=''></img>
                            <span>{username}</span>
                        </div>
                        {
                            clients.map(client=>{
                                if(client.user_id===userId){
                                    return  <div key={client._id} className="item-inf-client">
                                                {
                                                    users.map(user=>{
                                                        if(user._id===client.user_id){
                                                            return <p key={user._id}><span>Mã tài khoản:</span> {user.user_id}</p>
                                                        }
                                                    })
                                                }
                                                <p><span>Khách hàng:</span> {client.name_client}</p>
                                                <p><span>SĐT:</span> {client.phone}</p>
                                                <p><span>Email:</span> {client.email}</p>
                                                <p><span>Địa chỉ:</span> {client.address}</p>
                                            </div>
                                }
                            })
                        }
                        <Link to='/updateinforclient' onClick={()=>setShowFormInforAcc(!showFormInforAcc)}>Chỉnh sửa thông tin</Link>
                    </div>

                    <div className="element-order" style={detail?{display:'none'}:{display:'block'}} >
                        <h4 data-aos="fade-left" data-aos-duration="1000" data-aos-once="true">Đơn hàng của tôi</h4>
                        <p className="btn-infor-acc-myOrder" onClick={()=>setShowFormInforAcc(!showFormInforAcc)}>Thông tin tài khoản</p>
                        <br/>
                        <div className="btn-opt-sta-ord" data-aos="fade-up" data-aos-duration="600" data-aos-once="true">
                            <span style={styleAll} onClick={()=>handleStatusOrd('',1)}>Tất cả ({myOrderAll.length})</span>
                            <span style={styleProcessing} onClick={()=>handleStatusOrd('status_order=63f2ef4cd97a1405d8775168',6)}>Đang xử lý ({lengthProcessing})</span>
                            <span style={styleAwait} onClick={()=>handleStatusOrd('status_order=6328789da2e7052bc439f977',2)}>Chờ giao hàng ({lengthWait})</span>
                            <span style={styleDelivering} onClick={()=>handleStatusOrd('status_order=632878d7a2e7052bc439f978',3)}>Đang giao ({lengthDelivering})</span>
                            <span style={styleDelivered} onClick={()=>handleStatusOrd('status_order=632878dea2e7052bc439f979',4)}>Đã giao ({lengthDelivered})</span>
                            <span style={styleCanceled} onClick={()=>handleStatusOrd('status_order=632878eca2e7052bc439f97a',5)}>Đã Hủy ({lengthCancel})</span>
                        </div>

                        <div className="wrap-itemOrder">
                            {
                                listOrder.map((myor)=>{
                                    return <div key={myor._id} className="itemOrder" data-aos="fade-up" data-aos-offset="0">
                                        <div className="head-ord">
                                            <p><b>Mã đơn hàng: </b>{myor.order_id}</p>
                                            <p>
                                                {
                                                    statusOrder.map(el => {
                                                        if(myor.status_order===el._id){
                                                            return <span key={el._id} style={el.name==='Đang xử lý'?{color:'red',fontWeight:'500'}:el.name==='Chờ giao hàng'?{color:'orange',fontWeight:'500'}:el.name==='Đang giao hàng'
                                                            ?{color:'#0066FF',fontWeight:'500'}:el.name==='Đã giao hàng'?{color:'#00CC00',fontWeight:'500'}
                                                            :{color:'#888',fontWeight:'500'}}>{el.name} </span>
                                                        }
                                                    })
                                                }
                                                |
                                                <b> Dự kiến: </b> 
                                                {
                                                    myor.status_order==='63f2ef4cd97a1405d8775168'?
                                                    <span> {myor.deliveryDate}</span>
                                                    : 
                                                    myor.status_order==='6328789da2e7052bc439f977'?
                                                        <span> {myor.deliveryDate}</span>
                                                    : 
                                                    myor.status_order==='632878d7a2e7052bc439f978'?
                                                        <span> Đơn hàng đang được giao đến bạn!</span>
                                                    :
                                                    myor.status_order==='632878dea2e7052bc439f979'?
                                                        <span> Đơn hàng đã được giao!</span>
                                                    :
                                                    myor.status_order==='632878eca2e7052bc439f97a'?
                                                        <span> Đơn hàng đã hủy!</span>
                                                    : ''
                                                }
                                            </p>
                                        </div>
                                        <div className="el-item-ord">
                                            {
                                                myor.product.map(proMyOrd=>{
                                                    return <div key={proMyOrd._id} className="infor_pro1">
                                                        <span className="element-inforPro">
                                                            <img src={proMyOrd.imageMain} alt="" />
                                                            <span>
                                                                <p>
                                                                    <span style={{textTransform:'uppercase',fontWeight:'500'}}>{proMyOrd.title}</span>
                                                                    <span> - {proMyOrd.description}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                    <span>Mã: {proMyOrd.product_id}</span>
                                                                </p>
                                                                <p>
                                                                    <span>Màu: {proMyOrd.colorPro}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                    <span>Size: {proMyOrd.sizeCart}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                </p>
                                                            </span>
                                                        </span>
                                                        <span className="el-item-ord2">
                                                            <p>{proMyOrd.price.toLocaleString("en")} <u>đ</u></p>
                                                            <p>Số lượng: x{proMyOrd.quantity}</p>
                                                        </span>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className="total-ord">
                                            <div className="item-total-ord-1">
                                                <button onClick={()=>DetailMyOrder(myor._id)}>Xem Chi Tiết Đơn Hàng</button>
                                                {
                                                    myor.status_order==='63f2ef4cd97a1405d8775168'?
                                                    <span className="btn-cancel-ord-outside" onClick={()=>CancelOrder(myor._id)}>Hủy đơn hàng</span>
                                                    :''
                                                }
                                                {
                                                    myor.status_order==='632878dea2e7052bc439f979'|| myor.status_order==='632878eca2e7052bc439f97a'?
                                                    <span className="btn-re-order" onClick={()=>handleReOrder(myor._id)}>Đặt hàng lại</span>
                                                    :''
                                                }
                                            </div>
                                            <div className="item-total-ord-2">
                                                <span>Phí giao hàng: 30,000 <u>đ</u></span>
                                                {
                                                    myor.total===0 ? <p>Tổng số tiền: &nbsp;<b>{(myor.product.reduce((prev, item) =>{
                                                        return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                    },0)+ship).toLocaleString("en")}</b> <u>đ</u></p>
                                                    :
                                                    <p>Tổng số tiền: &nbsp;<b>{myor.total.toLocaleString("en")}</b> <u>đ</u></p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        {listOrder.length===0&&<p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
                        <LoadMoreMyOder/>
                    </div>

                    <div className="detail-myorder element-order" style={detail?{display:'block'}:{display:'none'}}>
                        <div>
                            <h4>Chi tiết đơn hàng</h4>
                            <p>Dự kiến giao: 
                                {
                                    myOrder.map(mod=>{
                                        if(mod._id===idOrder&&mod.status_order==='63f2ef4cd97a1405d8775168'){
                                            return  <span key={mod._id}> {mod.deliveryDate}</span>
                                        }
                                        else if(mod._id===idOrder&&mod.status_order==='6328789da2e7052bc439f977'){
                                            return  <span key={mod._id}> {mod.deliveryDate}</span>
                                        }
                                        else if (mod._id===idOrder&&mod.status_order==='632878d7a2e7052bc439f978') {
                                            return <span key={mod._id}> Đơn hàng đang được giao đến bạn!</span>
                                        }
                                        else if (mod._id===idOrder&&mod.status_order==='632878dea2e7052bc439f979') {
                                            return <span key={mod._id}> Đơn hàng đã được giao!</span>
                                        }
                                        else if (mod._id===idOrder&&mod.status_order==='632878eca2e7052bc439f97a') {
                                            return <span key={mod._id}> Đơn hàng đã hủy!</span>
                                        }
                                    })
                                }
                            </p> 
                        </div>
                        {
                            myOrder.map(myo=>{
                                if(myo._id===idOrder&&myo.status_order==="63f2ef4cd97a1405d8775168"){
                                    return <span key={myo._id} className="btn-cancel-ord" onClick={()=>CancelOrder(myo._id)}>Hủy đơn hàng</span>
                                }
                                if((myo._id===idOrder&&myo.status_order==='632878dea2e7052bc439f979')||(myo._id===idOrder&&myo.status_order==='632878eca2e7052bc439f97a')){
                                    return <button key={myo._id} className="btn-re-order" onClick={()=>handleReOrder(myo._id)}>Đặt hàng lại</button>
                                }
                            })
                        }
                        <button onClick={BackToMyOrder} className="btn-back-to-ord">Quay lại</button>
                        <hr></hr>
                        {
                            myOrder.map(myor =>{
                                if(idOrder===myor._id){
                                return  <div key={myor._id} className="detail-Order">
                                            <div className="wrap-infor-myord-detail">
                                                <div className="elementOfWrapDetailLeft">
                                                    <p className="title-head-item-detail">Đơn hàng:</p>
                                                    <div className="item-myord-detail-content"><span>Mã đơn hàng: </span><p>{myor.order_id}</p></div>
                                                    <div className="item-myord-detail-content">
                                                        <span>Tình trạng: </span>
                                                        {
                                                            statusOrder.map(el => {
                                                                if(myor.status_order===el._id){
                                                                    return <p key={el._id} className="item-myord-detail-content">{el.name}</p>
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                    <div className="item-myord-detail-content"><span>Ngày đặt: </span><p>{myor.createdAt.slice(0,10)}</p></div>
                                                </div>
                                                <div className="elementOfWrapDetailMid">
                                                    <p className="title-head-item-detail">Thông tin của bạn:</p>
                                                    <div className="item-myord-detail-content"><span>Tên người nhận:</span><p>{myor.name_client}</p></div>
                                                    <div className="item-myord-detail-content"><span>Điện thoại:</span><p>{myor.phone}</p></div>
                                                    <div><span>Địa chỉ nhận hàng:</span><p className="p-address-dtail-mor">- {myor.address}</p></div>
                                                </div>
                                                <div className="elementOfWrapDetailRight">
                                                    <p className="title-head-item-detail">Chi phí:</p>
                                                    <div className="item-myord-detail-content"><span>Tạm tính: </span>
                                                        <p>
                                                            {
                                                                (myor.product.reduce((prev, item) =>{
                                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                                },0)).toLocaleString("en")
                                                            } <u>đ</u>
                                                        </p>
                                                    </div>

                                                    {
                                                        myor.total===0 ? '': 
                                                        <div>
                                                            <div className="item-myord-detail-content">
                                                                <span>Mã khuyến mãi: </span>
                                                                <p>
                                                                    {
                                                                        ((myor.total - ship)*100/(myor.product.reduce((prev, item) =>{
                                                                            return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                                        },0)))-100
                                                                    }%
                                                                </p>
                                                            </div>
                                                            <p>(áp dụng trên số tiền tạm tính)</p>
                                                        </div>
                                                    }

                                                    <div className="item-myord-detail-content"><span>Phí giao hàng:</span> <p>30,000 <u>đ</u></p></div>
                                                    
                                                    {
                                                        myor.total===0 ? <div className="item-myord-detail-content"><span>Tổng:</span>
                                                            <p style={{color:'red',fontSize:'1.2rem',fontWeight:'500'}}>{(myor.product.reduce((prev, item) =>{
                                                            return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                        },0)+ship).toLocaleString("en")} <u>đ</u></p></div>
                                                        :
                                                        <div className="item-myord-detail-content"><span>Tổng:</span>
                                                            <p style={{color:'red',fontSize:'1.2rem',fontWeight:'500'}}>{myor.total.toLocaleString("en")} <u>đ</u></p>
                                                        </div>
                                                    }
                                                </div> 
                                            </div>
                                            <hr></hr>
                                            <div><span>Ghi chú: </span><p>- {myor.note}</p></div>
                                            <hr></hr>
                                            <h5>Sản phẩm</h5>
                                            {myor.product.map(pro =>{
                                                return  <table key={pro._id}>
                                                            <tbody>
                                                                <tr>
                                                                    <td><img src={pro.imageMain}></img></td>
                                                                    <td><b>Mã: </b>{pro.product_id}</td>
                                                                    <td style={{textTransform:'uppercase'}}>{pro.title}</td>
                                                                    <td><b>Màu: </b>{pro.colorPro}</td>
                                                                    <td><b>Size: </b>{pro.sizeCart}</td>
                                                                    <td>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")} <u>đ</u></td>
                                                                    <td>Số lượng: {pro.quantity}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                })
                                            }
                                        </div>
                                }
                            })
                        }
                    </div>
                </div>
                <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
                    <img src={UpHeadPage} alt="" width="15" />
                </Link>
            </div>
        </>
    )
}
