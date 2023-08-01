
import React, {useState, useContext, useEffect, isValidElement} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../utils/loading/Loading'
import { useHistory, Link } from 'react-router-dom'
import 'aos/dist/aos.css'
import Aos from 'aos'

const initialState = {
    email: '',
    address: '',
    phone: '',
    name_client: '',
    note: '',
    status_order: '',
    _id: ''
}

export default function CreateOrder() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [order, setOrder] = useState(initialState)
    const [cart, setCart] = state.userAPI.cart
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [money, setMoney] = state.orderAPI.money
    const [ship] = useState(30000)
    const [code, setCode] = state.orderAPI.code
    const [discount] = state.discountAPI.discount
    const [checkDiscount, setCheckDiscount] = state.discountAPI.checkCodeDiscount
    const [callback, setCallback] = state.orderAPI.callback
    const [callback1, setCallback1] = state.inforClientAPI.callback
    const [inforClient] = state.inforClientAPI.inforClient
    const [user_id] = state.userAPI.user_id
    const [showInput, setShowInput] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [discounts] = state.discountAPI.discount
    const [codeDiscount, setCodeDiscount] = state.orderAPI.code
    const [toDay, setToDay] = useState(0)
    const [lastDay, setLastDay] = useState(0)
    const [month, setMonth] = useState(0)
    const [firstDayNextMonth, setFirstDayNextMonth] = useState(0)
    const [nextMonth, setNextMonth] = useState(0)
    const [deliveryDate, setDeliveryDate] = useState('')
    const [orders] = state.orderAPI.order
    const [order_id, setOrder_id] = useState('')

    const history = useHistory()

    const [disable, setDisable] = useState(false)

    // xử lý xóa dữ liệu trong giỏ hàng khi đã xác nhận đặt hàng
    useEffect(() =>{
        const updateCart = async () => {
            await axios.patch('/user/addcart', {cart}, {
                headers: {Authorization: token}
            })
        }
        updateCart()
    }, [cart])

    // khóa form không cho nhập liệu khi giỏ hàng đang rỗng
    useEffect(() =>{
        cart.length===0 ? setDisable(true) : setDisable(false)
    })

    // tính tổng tiền hàng
    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) =>{
                return prev + ((item.price/100)*(100-item.discount) * item.quantity)
            },0)

            setTotal(total)
        }
        getTotal()
    },[cart])

    // lấy dữ liệu từ input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
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

        if(a!==''){
            b = (Number.parseInt((a.slice(2)),10)+1)
            if(b<10){
                setOrder_id('DH0'+ b.toString())
            }
            else if(b>=10) {
                setOrder_id('DH'+ b.toString())
            }
        }
        else {
            setOrder_id('DH01')
        }
    })

    // submit form thông tin khách hàng và thêm đơn hàng
    const handleSubmit = async e =>{
        e.preventDefault()
        if(window.confirm("Bấm ok để \"Xác nhận đặt hàng\"."))
        try {
            const res = await axios.post('/api/order', {order_id,...order, money, deliveryDate}, {
                headers: {Authorization: token}
            })
            handleOrder()
            setCode('')
            setMoney(0)
            setCallback(!callback)
            postInforClient()
            updatePays()
            updateNotifyOrder()
            setDeliveryDate('')
            setOrder_id('')
            updateQuantityProOrderCart()

        } catch (err) {
            alert(err.response.data.msg)
        }
        // setConfirm(true)
    }

    // cập nhật số lượng (trừ đi) sản phẩm từ giỏ hàng
    const updateQuantityProOrderCart = async ()=>{
        var a=[]
        cart.forEach(el=>{
            a.push({"id":el._id, "quantity":el.quantity})
        })

        try {
            await axios.put(`/api/update_quantity_create_order_cart`, {listPro: a}, {
                headers: {Authorization: token}
            })
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // chuyển dữ liệu từ giỏ hàng vào đơn hàng
    const handleOrder = async() => {
        try {
            const res = await axios.patch('/api/order', {cart}, {
                headers: {Authorization: token}
            })
            setCart([])
            setOrder(initialState)
            history.push("/cart")
            alert(res.data.msg)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý ẩn input khi tài khoản hiện tại đẵ mua hàng và có thông tin trong db infor_client
    useEffect(()=>{
        const handelInput = ()=>{
            inforClient.map(client=>{
                if(user_id===client.user_id){
                    setShowInput(true)
                }
            })
        }
        handelInput()
    })

    // thêm thông tin của khách hàng mới mua lần đầu vào db infor_client
    const postInforClient = async () =>{
        if(!showInput){
            var a=[]
            inforClient.forEach(el=>{
                a.push(el.user_id)
            })
            
            if(a.length!==0){
                try {
                    if(!a.includes(user_id)){
                        await axios.post('/api/inforclient', {...order}, {
                            headers: {Authorization: token}
                        })
                    }

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            else {
                try {
                    await axios.post('/api/inforclient', {...order}, {
                        headers: {Authorization: token}
                    })

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        }
    }

    // xử lý cập nhật số lần mua của khách hàng
    const updatePays = () =>{
        try {
            inforClient.forEach(async el=>{
                if(user_id===el.user_id){
                    await axios.patch('/api/inforclient', {pays: el.pays+1}, {
                        headers: {Authorization: token}
                    })
                }
            })
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // update newOder trong db Notify để hiển thị thông báo khi có đơn hàng mới
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

    // xóa item "reload" trong localStorage cho chức năng cập nhật thông báo đơn hàng mới (reload đc tạo khi truy cập giỏ hàng)
    // và tính thời gian dự kiến giao hàng
    useEffect(()=>{
        const reload = ()=>{
            const itemReload = localStorage.getItem('reload')
            if(itemReload){
                setLoading(true)
                window.location.reload()
                localStorage.removeItem('reload')
            }
        }
        reload()

        const getTime = () =>{
            var day = new Date()
            var td = day.getDate()

            setToDay(day.getDate()) // ngày hiện tại

            var firstDay = new Date(day.getFullYear(), day.getMonth(), 1); // ngày đầu của tháng hiện tại (tháng chữ + ngày)
            var lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0); // ngày cuối của tháng hiện tại (tháng chữ + ngày)

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

    // lấy dữ liệu từ input mã khuyến mãi
    const handleChangeInputDisc = e =>{
        const {value} = e.target
        setCodeDiscount(value)
    }

    // xử lý button áp dụng mã khuyến mãi
    const DiscountCode = () =>{
        discounts.forEach((item)=>{
            if(item.code===codeDiscount){
                setMoney((total/100)*(100-item.persent)+ship)
                setCheckDiscount(true)
                //setCodeDiscount('')
                alert("Áp dụng mã khuyến mãi thành công!")
            }
        })
    }

    // set dữ liệu thời gian giao hàng về database orders
    useEffect(()=>{
        const dataDeliveryDate = ()=>{
            var a; var b; var c; var d
            (parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay?a=toDay+3:(parseInt(lastDay,10))===toDay?a=firstDayNextMonth+2:(parseInt(lastDay,10))-1===toDay?a=firstDayNextMonth+1:(parseInt(lastDay,10))-2===toDay?a=firstDayNextMonth:a=toDay+3;
            (parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay?b=nextMonth:b=month;
            (parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay&&(parseInt(lastDay,10))-3!==toDay?c=toDay+4:(parseInt(lastDay,10))===toDay?c=firstDayNextMonth+3:(parseInt(lastDay,10))-1===toDay?c=firstDayNextMonth+2:(parseInt(lastDay,10))-2===toDay?c=firstDayNextMonth+1:(parseInt(lastDay,10))-3===toDay?c=firstDayNextMonth:c=toDay+4;
            (parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay||(parseInt(lastDay,10))-3===toDay?d=nextMonth:d=month;
            var e, f, g, h
            a<10 ? e = `0${a}` : e = a
            b<10 ? f = `0${b}` : f = b
            c<10 ? g = `0${c}` : g = c
            d<10 ? h = `0${d}` : h = d
            setDeliveryDate('từ '+e+' tháng '+f+' - '+g+' tháng '+h)
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

    useEffect(()=>{
        Aos.init({duration: 1000})
    },[])

  return (
    
    loading ? <div style={{marginBottom:'150px'}}><Loading/></div>
    :
    <div className="container-order">
        <form onSubmit={handleSubmit} data-aos="fade-right" data-aos-duration="1000">
            <div className="wrap-btnUpdate">
                <h4>Thông tin của bạn:</h4>
                <Link to='/updateinforclient'>Chỉnh sửa</Link>
            </div>

            <div className="row-infor-order">
                <label htmlFor="name_client">Họ Tên<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="name_client" id="name_client" required 
                            value={order.name_client=client.name_client} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="name_client" id="name_client" required 
                value={order.name_client} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="address">Địa chỉ nhận hàng<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="address" id="address" required 
                            value={order.address=client.address} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="address" id="address" required 
                value={order.address} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="phone">Điện thoại<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="phone" id="phone" required 
                            value={order.phone=client.phone} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="phone" id="phone" required 
                value={order.phone} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="email">Email<span> *</span></label> <br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="email" name="email" id="email" required 
                            value={order.email=client.email} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="email" name="email" id="email" required 
                value={order.email} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="note">Ghi chú</label> <br></br>
                <textarea type="text" name="note" id="note" value={order.note} placeholder="Ghi chú về đơn hàng..." rows="7"
                onChange={handleChangeInput} disabled={disable}/>
            </div>

            {/* <div className="tl-btn" style={onEdit?{display:'block'}:{display:'none'}}>
                <div className="row-infor-order">
                    <label htmlFor="status_order">Trạng thái</label>
                    <select name="status_order" value={order.status_order} onChange={handleChangeInput}>
                        <option value="">Chọn trạng thái</option>
                        {
                            statusOrder.map(statusOrder =>(
                                <option value={statusOrder._id} key={statusOrder._id}>
                                    {statusOrder.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>   */}
        </form>

        <div className="infor-pro-order" data-aos="fade-left" data-aos-duration="1000">
            <h4>Đơn hàng của bạn:</h4>
            <p>Dự kiến giao: 
                từ <span>{(parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay?toDay+3:(parseInt(lastDay,10))===toDay?firstDayNextMonth+2:(parseInt(lastDay,10))-1===toDay?firstDayNextMonth+1:(parseInt(lastDay,10))-2===toDay?firstDayNextMonth:toDay+3}</span> tháng <span>{(parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay?nextMonth:month}</span>
                <span> - {(parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay&&(parseInt(lastDay,10))-3!==toDay?toDay+4:(parseInt(lastDay,10))===toDay?firstDayNextMonth+3:(parseInt(lastDay,10))-1===toDay?firstDayNextMonth+2:(parseInt(lastDay,10))-2===toDay?firstDayNextMonth+1:(parseInt(lastDay,10))-3===toDay?firstDayNextMonth:toDay+4}</span> tháng <span>{(parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay||(parseInt(lastDay,10))-3===toDay?nextMonth:month}</span>
            </p>

            <p className="tt-order-inf">Sản phẩm</p>
            <hr></hr>
            {
                cart.map(cart =>{
                    return  <div className="total-item-order" key={cart._id}>
                                <span className="title-pro-ord-inf">{cart.title} &nbsp;&nbsp; 
                                    <span className="multi">x</span>&nbsp;&nbsp; {cart.quantity}</span>
                                <span className="price-pro-ord-inf">
                                    {((cart.price/100)*(100-cart.discount)).toLocaleString("en")} <u>đ</u></span>
                            </div>
                })
            }
            <br></br>
            <div className="total-item-order">
                <p className="tt-order-inf">Tạm tính</p>
                <p>{total.toLocaleString("en")} <u>đ</u></p>
            </div>

            <div className="total-item-order">
                <p className="tt-order-inf">Mã khuyến mãi</p>
                {
                    discount.map(discount=>{
                        if(code===discount.code){
                            return <p key={discount._id} style={checkDiscount?{display:'inline'}:{display:'none'}}>-{discount.persent}%</p>
                        }
                    })
                }
            </div>
            <hr></hr>

            <div className="total-item-order">
                <p className="tt-order-inf">Phí giao hàng</p>
                <p>{ship.toLocaleString("en")} <u>đ</u></p>
            </div>
            <hr></hr>

            <div className="total-item-order">
                <p className="tt-order-inf">Tổng</p>
                <p className="money-ord">{money===0 ? (money+total+ship).toLocaleString("en") : money.toLocaleString("en")} <u>đ</u></p>
            </div>
            <p>(Đã bao gồm các hình thức khuyến mãi)</p>
            <hr></hr>
            <div className="wrap-code-item">
                <p>Nhập mã khuyến mãi (nếu có)</p>
                <div className="code-item">
                    <input type="text" name="code" id="code" value={codeDiscount}
                    onChange={handleChangeInputDisc} />
                    <span onClick={DiscountCode}>Áp dụng</span>
                    <p>(Chỉ áp dụng trên tiền hàng)</p>
                </div>
            </div>
            <hr></hr>
            <div className="pay-radio">
                <input type="radio" name="pay" />
                <span>Chuyển khoản trực tiếp</span>
            </div>
            <div className="pay-radio">
                <input type="radio" name="pay" defaultChecked={true} />
                <span>Thanh toán khi nhận hàng (COD)</span>
            </div>

            <button onClick={handleSubmit}>ĐẶT HÀNG</button>
        </div>

        {/* <button onClick={handleOrder} style={confirm ? {display: 'block'} : {display: 'none'}}>Xác Nhận Đặt Hàng </button>  */}
    </div>
  )
}
