import React, {useContext, useState, useEffect} from 'react'
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Productitem from '../utils/productitem/Productitem'
import Loading from '../utils/loading/Loading'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import Pre from '../../header/icon/previous.svg'
import facebook from '../../header/icon/facebook-color.png'
import intagram from '../../header/icon/instagram-color.png'
import skype from '../../header/icon/skype-color.png'
import gmail from '../../header/icon/gmail-color.png'
import star from '../../header/icon/star.png'
import starYello from '../../header/icon/star-yello.png'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'
import 'aos/dist/aos.css'
import Aos from 'aos'

const defaultreview = {
    star: 0,
    content: '',
    _id: ''
}

const initialState = {
    email: '',
    address: '',
    phone: '',
    name_client: '',
    note: '',
    status_order: '',
    _id: ''
}

export default function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [review, setReview] = useState(defaultreview)
    const addCart = state.userAPI.addCart
    const [products] = state.productsAPI.productAll
    const [callback, setCallback] = state.productsAPI.callback1
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token
    const [reviews] = state.reviewsAPI.review
    const [refresh, setRefresh] = state.reviewsAPI.refresh
    const [userId] = state.userAPI.user_id
    const [notify] = state.notifyAPI.notify
    const [orders] = state.orderAPI.orderAll
    const [size, setSize] = useState('')
    const [detailProduct, setdetailProduct] = useState([])
    const [focusBtn, setFocusBtn] = useState(false)
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sold, setSold] = useState(0)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [imageMain, setImageMain] = useState('')
    const [defaultImage, setDefaultImage] = useState(true)
    const [colorPro, setColorPro] = useState('')
    const [colorDefault, setColorDeault] =useState(true)
    const [checkedSize, setCheckedSize] = useState(false)
    const [focusDefaultSize, setFocusDefaultSize] = useState('')
    const [focusImage, setFocusImage] = useState(0)
    const [formbuyNow, setFormbuyNow] = useState(false)
    const [ordersPro] = state.orderAPI.order
    const [callbackOrder, setCallbackOrder] = state.orderAPI.callback
    const [order_id, setOrder_id] = useState('')

    const [inforClient] = state.inforClientAPI.inforClient
    const [discount] = state.discountAPI.discount
    const [user_id] = state.userAPI.user_id
    const [order, setOrder] = useState(initialState)
    const [showInput, setShowInput] = useState(false)
    const [code, setCode] = state.orderAPI.code
    const [checkDiscount, setCheckDiscount] = state.discountAPI.checkCodeDiscount
    const [codeDiscount, setCodeDiscount] = state.orderAPI.code
    const [ship] = useState(30000)
    const [money, setMoney] = useState(0)
    const [quantityBuyNow, setQuantityBuyNow] = useState(1)
    const [hidenNtnChangeInfor, setHidenNtnChangeInfor] = useState(true)
    const [checkBuyNow, setCheckBuyNow] = useState(false)

    const [toDay, setToDay] = useState(0)
    const [lastDay, setLastDay] = useState(0)
    const [month, setMonth] = useState(0)
    const [firstDayNextMonth, setFirstDayNextMonth] = useState(0)
    const [nextMonth, setNextMonth] = useState(0)
    const [deliveryDate, setDeliveryDate] = useState('')

    const [starr1, setStar1] = useState(false)
    const [starr2, setStar2] = useState(false)
    const [starr3, setStar3] = useState(false)
    const [starr4, setStar4] = useState(false)
    const [starr5, setStar5] = useState(false)

    const Star1 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(false)
        setStar3(false)
        setStar4(false)
        setStar5(false)
    }

    const Star2 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(false)
        setStar4(false)
        setStar5(false)
    }

    const Star3 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(false)
        setStar5(false)
    }

    const Star4 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(true)
        setStar5(false)
    }

    const Star5 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(true)
        setStar5(true)
    }

    // xử lý số lượng đã bán
    useEffect(()=>{
        var a=[]
        const sold = ()=>{
            orders.forEach(el=>{
                if(el.status_order==="632878dea2e7052bc439f979"){
                    el.product.forEach(i=>{
                        if(i._id===params.id){
                            a.push(i.quantity)
                        }
                    })
                }
            })
        }
        sold()
        setSold(a.reduce((p, i)=>{
            return p+i
        },0))
    })

    // lấy dữ liệu detail
    useEffect(() =>{
        if(params.id){
            products.forEach(product => {
                if(product._id===params.id) setdetailProduct(product)
            });
        }
    },[params.id, products, callback])

    // xử lý focus nút mô tả
    const ClickFocusDescription = () => {
        setFocusBtn(false)
    }

    // focus nút đánh giá
    const ClickFocusReview = ()=>{
        setFocusBtn(true)
    }

    // thay đổi value input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setReview({...review, [name]:value})
    }

    // tạo bình luận mới
    const createReview = async() => {
        try {
            if(isLogged) {
                const res = await axios.post('/api/review', {product: params.id, ...review}, {
                    headers: {Authorization: token}
                })
                setReview(defaultreview)
                alert(res.data.msg)
                updateNotifyReview()
            }
            else {
               alert("Hãy đăng nhập để đánh giá sản phẩm!")
            }
            setRefresh(!refresh)
            setStar1(false)
            setStar2(false)
            setStar3(false)
            setStar4(false)
            setStar5(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa bình luận
    const deleteReview = async(id) => {
        try{
            if(isLogged) {
                const res = await axios.delete(`/api/review/${id}`, {
                    headers: {Authorization: token}
                })
                setRefresh(!refresh)
                alert(res.data.msg)
            }
            else {
                alert("Bạn chưa đăng nhập.")
            }
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

    // xử lý ẩn hiện nút back to top khi cuộn chuột
    useEffect(()=>{
        window.onscroll = ()=> {
            const scrollFunction = ()=> {
                if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                    setBtnBackTop(true)
                } else {
                    setBtnBackTop(false)
                }
            }
            scrollFunction()

            // show header fixed
            const scrollheader = ()=> {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    setHeader(true)
                } else {
                    setHeader(false)
                }
            }
            scrollheader()
        }
    })

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // cập nhật thông báo khi có đánh giá mới
    const updateNotifyReview = () =>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_newreview/${'635cd52464f5b7334c594007'}`, {newReview: el.newReview+1}, {
                    headers: {Authorization: token}
                })
            })
            localStorage.setItem('reloadPage', true)
            setReload(true)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý nút lùi hình imageMain
    const handlePreImage = () => {
        if(imageMain===detailProduct.images.url||imageMain===''){
            changeImageDetail(4)
        }
        else if(imageMain===detailProduct.images1.url&&focusImage===2){
            changeImageDetail(1)
        }
        else if(imageMain===detailProduct.images2.url&&focusImage===3){
            changeImageDetail(2)
        }
        else if(imageMain===detailProduct.images3.url&&focusImage===4){
            changeImageDetail(3)
        }
    }

    // xử lý nút tăng hình imageMain
    const handleNextImage = () =>{
        if(imageMain===detailProduct.images.url||imageMain===''){
            changeImageDetail(2)
        }
        else if(imageMain===detailProduct.images1.url&&focusImage===2){
            changeImageDetail(3)
        }
        else if(imageMain===detailProduct.images2.url&&focusImage===3){
            changeImageDetail(4)
        }
        else if(imageMain===detailProduct.images3.url&&focusImage===4){
            changeImageDetail(1)
        }
    }

    // đổi hình detail product
    const changeImageDetail = (value) => {
        if (value===1) {
            setDefaultImage(false)
            setImageMain(detailProduct.images.url)
            setColorDeault(false)
            setColorPro(detailProduct.color)
            setFocusImage(1)
        }
        else if (value===2) {
            setDefaultImage(false)
            setImageMain(detailProduct.images1.url)
            setColorDeault(false)
            setColorPro(detailProduct.color1)
            setFocusImage(2)
        }
        else if (value===3) {
            setDefaultImage(false)
            setImageMain(detailProduct.images2.url)
            setColorDeault(false)
            setColorPro(detailProduct.color2)
            setFocusImage(3)
        }
        else if (value===4) {
            setDefaultImage(false)
            setImageMain(detailProduct.images3.url)
            setColorDeault(false)
            setColorPro(detailProduct.color3)
            setFocusImage(4)
        }   
    }

    // xử lý chọn size
    const chosenSize = (size) =>{
        size?setCheckedSize(size):setCheckedSize(false)
        setSize(size)
        setFocusDefaultSize('')
    }

    // xử lý focus vào size mặc định khi chưa chọn size
    useEffect(()=>{
        var a=[]
        if(params.id){
            products.forEach(el=>{
                if(el._id===params.id){
                    el.size.forEach(i=>{
                        if(i!==''){a.push(i)}
                    })
                }
            })
        }
        setFocusDefaultSize(a[0])
        scroll()
    },[params.id, products])

    // xử lý click nút thêm vào giỏ hàng
    const handleAddCart = (product, colorPro, imageMain) =>{
        var a=[]
        product.size.forEach(el => {
            if(el!==''){
                a.push(el)
            }
        })
        size ==='' ? addCart(product, colorPro, imageMain, a[0]) : addCart(product, colorPro, imageMain, size)  
    }

    // reload khi mở trang và sau khi bấm nút đăng để cập nhật thông báo đánh giá mới
    useEffect(()=>{
        if(localStorage.getItem('reloadPage')){
            window.location.reload()
            setLoading(true)
            localStorage.removeItem('reloadPage')
        }
    },[reload])

    //////////////////////////////////////////////////phần mua ngay////////////////////////////////////////////////////////////////////////////////////////////////////////
    // click nút mua ngay
    const buyNow = ()=>{
        if(!isLogged) {alert('Hãy đăng nhập hoặc tạo tài khoản để tiếp tục mua hàng!')}
        else {setFormbuyNow(true)}
        localStorage.setItem('reload', true)
    }

    // lấy dữ liệu từ input
    const handleChangeInputBuyNow = e =>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
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
    },[formbuyNow])

    //xử lý thay đổi thông tin cá nhân (nút mua ngay)
    const handleChangeinFor = ()=>{
        setShowInput(false)
    }

    // lấy dữ liệu từ input mã khuyến mãi
    const handleChangeInputDisc = e =>{
        const {value} = e.target
        setCodeDiscount(value)
    }

    // xử lý hiện/ẩn nút chỉnh sửa thông tin các nhân
    useEffect(()=>{
        inforClient.forEach((client)=>{
            if(user_id===client.user_id){
                setHidenNtnChangeInfor(false)
            }
        })
    },[formbuyNow])

    //tăng số lượng
    const increment = () =>{
        setQuantityBuyNow(quantityBuyNow+1)
        setCheckBuyNow(false)
    }

    // giảm số lượng
    const decrement = () =>{
        quantityBuyNow<=0 ? setQuantityBuyNow(0) : quantityBuyNow===1 ? setQuantityBuyNow(quantityBuyNow) : setQuantityBuyNow(quantityBuyNow-1)
    }

    // xử lý hiện phần trăm khuyến mãi
    const DiscountCode = ()=>{
        discount.forEach((item)=>{
            if(item.code===codeDiscount){
                setMoney(((((detailProduct.price/100)*(100-detailProduct.discount))*quantityBuyNow)/100)*(100-item.persent)+ship)
                setCheckDiscount(true)
                alert("Áp dụng mã khuyến mãi thành công!")
            }
        })
    }

    // xử lý ẩn form mua ngay
    const closeFormBuyNow = ()=>{
        setFormbuyNow(false)

        var reload = localStorage.getItem('reload')
        if(reload){
            localStorage.removeItem('reload')
        }
    }

    // xử lý lấy thời gian dự kiên giao hàng
    useEffect(()=>{
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
    },[])

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

    // chuyển dữ liệu sản phẩm vào đơn hàng
    const handleOrder = async() => {
        try {
            const res = await axios.patch('/api/order', {cart: [{...detailProduct, quantity: quantityBuyNow, sizeCart: size===''?focusDefaultSize:size, colorPro: colorDefault?detailProduct.color:colorPro, 
            imageMain: defaultImage?detailProduct.images.url:imageMain}]}, {
                headers: {Authorization: token}
            })
            setOrder(initialState)
            setFormbuyNow(false)
            alert(res.data.msg)
            
        } catch (err) {
            alert(err.response.data.msg)
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

    // xử lý lấy mã đơn hàng tự động (nếu order_id trong db ko tồn tại useeffect sẽ bị lỗi => đơn hàng mới không có sản phẩm)
    useEffect(()=>{
        var a=''; var b=0
        const getOrd_id = ()=>{
            ordersPro.forEach((el, i)=>{
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
    },[ordersPro])

    // xử lý submit nút đặt hàng mua ngay
    const submitBuyNow = async (e)=>{
        e.preventDefault()
        if(window.confirm("Bấm ok để \"Xác nhận đặt hàng\"."))
        try {
            const res = await axios.post('/api/order', {order_id,...order, money, deliveryDate}, {
                headers: {Authorization: token}
            })
            handleOrder()
            setCode('')
            setCodeDiscount('')
            setMoney(0)
            postInforClient()
            updatePays()
            updateNotifyOrder()
            setDeliveryDate('')
            setCheckDiscount(false)
            setOrder_id('')
            updateQuantityProBuyOrder()
            setCallbackOrder(!callbackOrder)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }

        var reload = localStorage.getItem('reload')
        if(reload){
            setLoading(true)
            window.location.reload()
            localStorage.removeItem('reload')
        }
    }

    // cập nhật số lượng (trừ đi) sản phẩm khi khách đặt hàng
    const updateQuantityProBuyOrder = async ()=>{
        try {
            await axios.put(`/api/update_quantity_pro_order/${params.id}`, {quantity: quantityBuyNow}, {
                headers: {Authorization: token}
            })

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // thay đổi số lượng sản phẩm trực tiếp trong input form mua ngay
    const changeQuantityDetail = (e)=>{
        if(parseInt(e.target.value)<0 || parseInt(e.target.value)===0 || isNaN(e.target.value)){
            setQuantityBuyNow(parseInt(e.target.value))
            setCheckBuyNow(true)
        }
        else if(e.target.value===''){
            setQuantityBuyNow(0)
            setCheckBuyNow(true)
        }
        else if(e.target.value>detailProduct.quantity_product){
            alert(`Số lượng sản phẩm không đủ cung cấp. ${'\n'}Quý khách vui lòng liên hệ đến cửa hàng để được hỗ trợ!`)
        }
        else {
            setQuantityBuyNow(parseInt(e.target.value))
            setCheckBuyNow(false)
        }
    }

    // thông báo số lượng không hợp lệ khi đặt hàng
    const notifyErr = ()=>{
        alert("Số lượng sản phẩm không được nhỏ hơn 1.")
    }

    if(detailProduct.length === 0) return null;

    return (
        
        loading ? <div style={{marginBottom:'150px'}}><Loading/></div>
        :
        <>
            {
                header&&!formbuyNow?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
            }
            <div className={!formbuyNow?"container-detail":"detail-bg-opacity"}>

                <div className="crumb">
                    <Link to='/' className="crumb-homepage">
                        <img src={Home} alt=''></img>
                        <span>Trang chủ</span>
                    </Link>
                    <img src={Next} alt=''></img>
                    <Link to='/product' className="crumb-homepage">
                        <span>Danh mục sản phẩm</span>
                    </Link>
                    <img src={Next} alt=''></img>
                    <span className="crumb-name">Chi tiết sản phẩm</span>
                </div>

                <div className="detail">
                    <div className="detail-img-pro">
                        <div className="wrap-image-main">
                            <TransformWrapper defaultScale={1} defaultRositionX={100} defaultRositionY={200}>
                                {({ zoomIn, zoomOut, ...rest }) => (
                                    <>
                                        <TransformComponent>
                                            <img data-aos="zoom-in" data-aos-duration="900" className="img-main-pro" src={defaultImage?detailProduct.images.url:imageMain} alt="" />
                                        </TransformComponent>
                                        <div className="wrap-btn-zoom">
                                            <p onClick={()=>zoomIn()}>+ phóng to</p>
                                            <p onClick={()=>zoomOut()}>- Thu nhỏ</p>
                                        </div>
                                    </>
                                )}
                            </TransformWrapper>
                            <p data-aos="fade-right" data-aos-duration="900" className="btn-pre-image" onClick={handlePreImage}><img src={Pre} alt=''></img></p>
                            <p data-aos="fade-left" data-aos-duration="900" className="btn-next-image" onClick={handleNextImage}><img src={Next} alt=''></img></p>
                        </div>

                        <div className="img-item-detail">
                            <span onClick={()=>changeImageDetail(1)} data-aos="flip-left" data-aos-duration="2000" data-aos-offset="0" style={focusImage===1?{border:'2px solid Orange'}:{border:'2px solid #aaa'}}>
                                <img src={detailProduct.images.url} alt="" />
                            </span>
                            <span onClick={()=>changeImageDetail(2)} data-aos="flip-left" data-aos-duration="2000" data-aos-offset="0" style={focusImage===2?{border:'2px solid Orange'}:{border:'2px solid #aaa'}}>
                                <img src={detailProduct.images1.url} alt="" />
                            </span>
                            <span onClick={()=>changeImageDetail(3)} data-aos="flip-left" data-aos-duration="2000" data-aos-offset="0" style={focusImage===3?{border:'2px solid Orange'}:{border:'2px solid #aaa'}}>
                                <img src={detailProduct.images2.url} alt="" />
                            </span>
                            <span onClick={()=>changeImageDetail(4)} data-aos="flip-left" data-aos-duration="2000" data-aos-offset="0" style={focusImage===4?{border:'2px solid Orange'}:{border:'2px solid #aaa'}}>
                                <img src={detailProduct.images3.url} alt="" />
                            </span>
                        </div>
                    </div>

                    <div className="box-detail">
                        <div className="row">
                            <h2>{detailProduct.title}</h2>
                            <h6>#Mã: {detailProduct.product_id}</h6>
                        </div>
                        <p data-aos="slide-left" data-aos-duration="500" data-aos-once="true">Tình trạng: {detailProduct.quantity_product===0 || detailProduct.status==="63247a157819fc3aa0ac3f5a" ? "Hết hàng" : detailProduct.status==="632879b1a2e7052bc439f97b" ? "Sắp về"
                            :"Còn hàng"} ({detailProduct.status==="63247a157819fc3aa0ac3f5a" ? 0 : detailProduct.quantity_product} sản phẩm)</p>
                        <p data-aos="slide-left" data-aos-duration="600" data-aos-once="true">Giá bán: {detailProduct.discount>0 ? <del>{(detailProduct.price).toLocaleString("en")} <u>đ</u></del> : <span>{(detailProduct.price).toLocaleString("en")} <u>đ</u></span>}</p>
                        <p data-aos="slide-left" data-aos-duration="700" data-aos-once="true">Khuyến mãi: <span>{detailProduct.discount}%</span></p>
                        <p data-aos="slide-left" data-aos-duration="800" data-aos-once="true" style={detailProduct.discount===0?{display:'none'}:{display:'block'}}>Giá giảm còn: <span>{((detailProduct.price/100)*(100-detailProduct.discount)).toLocaleString("en")} <u>đ</u></span></p>
                        <p data-aos="slide-left" data-aos-duration="900" data-aos-once="true">Chất liệu: {detailProduct.description}</p>
                        <p data-aos="slide-left" data-aos-duration="1000" data-aos-once="true">Đã bán: {sold}</p>
                        
                        {
                            detailProduct.status==="63247a157819fc3aa0ac3f5a"||detailProduct.quantity_product===0?<h3 style={{color:'#FF6600', marginTop:'15px'}}><i>Tạm hết hàng !</i></h3>
                            :
                            <>
                                <Link to='#!' data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" className="cart" onClick={() => handleAddCart(detailProduct, colorDefault?detailProduct.color:colorPro, defaultImage?detailProduct.images.url:imageMain)}>THÊM VÀO GIỎ HÀNG</Link>
                                <Link to="#!" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" className="buy-now" onClick={buyNow}>MUA NGAY</Link>
                            </>
                        }

                        <div className="option-chosen">
                            <span style={{color:'#000',fontSize:'1.3rem'}} className="color">Màu: &nbsp;<span style={{color:'#666'}}>{colorDefault?detailProduct.color:colorPro}</span></span>
                            <br/>
                            <span style={{color:'#000',fontSize:'1.3rem'}} className="size">Chọn kích cỡ: </span>
                            {
                                detailProduct.size.map(size=>{
                                    if(size!==''){
                                        return <span key={size} className="size-item" onClick={()=>chosenSize(size)} style={checkedSize===size||focusDefaultSize===size?{backgroundColor:'#666',color:'#fff'}:{color:'#666'}}>{size}</span>
                                    }
                                })
                            }
                        </div>

                        {/* <div className="icon-share">
                            <Link to='#!'>
                                <img src={facebook} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={intagram} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={skype} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={gmail} alt=''></img>
                            </Link>
                        </div> */}
                    </div>                   
                </div>

                <div className="review-pro">
                    <div className="btn-review">
                        <button onClick={ClickFocusDescription} style={!focusBtn?{backgroundColor: '#00cc00',color:'#fff'}
                            :{backgroundColor: '#fff', color:'#000'}}>Mô tả</button>
                        <button onClick={ClickFocusReview} style={focusBtn?{backgroundColor: '#00cc00',color:'#fff'}
                            :{backgroundColor: '#fff', color:'#000'}}>Đánh giá ()</button>
                    </div>

                    <div className="content-review">
                        <div className="content-description" style={focusBtn?{display:'none'}:{display:'block'}}>
                            <h3>Thông tin về {detailProduct.title}: </h3>
                            <br></br>
                            <p dangerouslySetInnerHTML={{ __html: detailProduct.content}}></p>                       
                        </div>
                        <div className="content-review-item" style={!focusBtn?{display:'none'}:{display:'block'}}>

                            <span>Đánh giá: 
                            <span onClick={()=>Star1(1)}>{starr1?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span> 
                            <span onClick={()=>Star2(2)}>{starr2?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star3(3)}>{starr3?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star4(4)}>{starr4?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star5(5)}>{starr5?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            </span>
                            <br></br>
                            <br></br>
                        
                            <form>
                                <label htmlFor="content">Viết nhận xét:</label>
                                <textarea type="text" name="content" id="content" required value={review.content} rows={4}
                                    onChange={handleChangeInput} placeholder="Nhận xét..." />
                            </form>
                            <button onClick={createReview}>Đăng</button>
                        </div>

                    </div>

                    <div className="showComment">
                    <span>Các bình luận về sản phẩm:</span>
                        <div className="row-comment">
                            {
                                reviews.map((review, index) =>{
                                    if(review.product===params.id){
                                    return <div  key={review._id} data-aos="fade-up" data-aos-duration="1000">
                                                <span className="row-comment-item">
                                                    <div className="inf-user-comment">
                                                        <div>
                                                            <span className="name-comment">{review.username.slice(0,1)}</span>
                                                            <span>{review.username}</span> &nbsp;
                                                            <span style={{color:'#3366FF', fontSize:'14px'}}><i>{review.createdAt.slice(0,10)}</i></span>
                                                            <span className="star-in-comment">
                                                                {
                                                                    review.star===1 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    : 
                                                                    review.star===2 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===3 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===4 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===5 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :''
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="btn-delete-cmt" onClick={()=>deleteReview(review._id)} 
                                                                style={userId===review.user_id?{display:'block'}:{display:'none'}}>X</span>
                                                        </div>
                                                    </div>
                                                    <p>{review.content}</p>
                                                </span>
                                            </div>
                                    }
                                })
                            }
                        </div>
                    <p style={{marginTop:'20px'}}>Cuộn xuống để xem nhiều bình luận hơn!</p>
                    </div>
                </div>

                <div className="offer">
                    <div className="wrap-offer">
                        <div className="line-offer"></div>
                        <p className="title-offer">SẢN PHẨM ĐỀ XUẤT</p>
                    </div>

                    <div className="products">
                        {
                            products.map((product, index) =>{
                                if(product._id!==params.id && index<=3){
                                    return <Productitem key={product._id} product={product} />
                                }
                            })
                        }
                    </div>
                </div>

                <Link to='#!' className={btnBackTop?"head-page":""} onClick={scroll}>
                    <img src={UpHeadPage} alt="" width="15" />
                </Link>
            </div>

            <div className="form-byNow" style={formbuyNow?{display:'flex'}:{display:'none'}}>
                <div className="buyNow-left">
                    <div className="head-buyNow-left">
                        <h4>Thông tin của bạn:</h4>
                        <span onClick={handleChangeinFor} style={hidenNtnChangeInfor?{display:'none'}:{display:'inline-block'}}>Chỉnh sửa</span>
                    </div>
                    <div className="row-infor-order">
                        <label htmlFor="name_client">Họ Tên <span style={{color:'red'}}>*</span></label><br/>
                        {
                            showInput?
                            inforClient.map(user=>{
                                if(user.user_id===user_id){
                                    return <input key={user._id} type="text" name="name_client" id="name_client" required 
                                    value={order.name_client=user.name_client} onChange={handleChangeInputBuyNow} disabled={true}/>
                                }
                            }):''
                        }
                        <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="name_client" id="name_client" required 
                            value={order.name_client} onChange={handleChangeInputBuyNow}/>
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="address">Địa chỉ nhận hàng <span style={{color:'red'}}>*</span></label><br/>
                        {
                            showInput?
                            inforClient.map(user=>{
                                if(user.user_id===user_id){
                                    return <input key={user._id} type="text" name="address" id="address" required 
                                    value={order.address=user.address} onChange={handleChangeInputBuyNow} disabled={true}/>
                                }
                            }):''
                        }
                        <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="address" id="address" required 
                            value={order.address} onChange={handleChangeInputBuyNow}/>
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="phone">Số điện thoại <span style={{color:'red'}}>*</span></label><br/>
                        {
                            showInput?
                            inforClient.map(user=>{
                                if(user.user_id===user_id){
                                    return <input key={user._id} type="text" name="phone" id="phone" required 
                                    value={order.phone=user.phone} onChange={handleChangeInputBuyNow} disabled={true}/>
                                }
                            }):''
                        }
                        <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="phone" id="phone" required 
                            value={order.phone} onChange={handleChangeInputBuyNow}/>
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="email">Email <span style={{color:'red'}}>*</span></label><br/>
                        {
                            showInput?
                            inforClient.map(user=>{
                                if(user.user_id===user_id){
                                    return <input key={user._id} type="text" name="email" id="email" required 
                                    value={order.email=user.email} onChange={handleChangeInputBuyNow} disabled={true}/>
                                }
                            }):''
                        }
                        <input style={showInput?{display:'none'}:{display:'block'}} type="email" name="email" id="email" required 
                            value={order.email} onChange={handleChangeInputBuyNow}/>
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="note">Ghi chú</label> <br></br>
                        <textarea type="text" name="note" id="note" value={order.note} placeholder="Ghi chú về đơn hàng..." rows="4"
                        onChange={handleChangeInputBuyNow}/>
                    </div>
                </div>

                <div className="buyNow-mid">
                    <h4>Thông tin sản phẩm:</h4>
                    <br/>
                    <div className="total-item-order">
                        <span className="title-pro-ord-inf">{detailProduct.title} &nbsp;&nbsp; 
                            <span className="multi">x</span>&nbsp;&nbsp; {quantityBuyNow}</span>
                        <span className="price-pro-ord-inf">
                            {((detailProduct.price/100)*(100-detailProduct.discount)).toLocaleString("en")} <u>đ</u></span>
                    </div>
                    <hr/>
                    <div className="total-item-order">
                        <span className="tt-order-inf">Kích cỡ (Size)</span>
                        <span>{size===''?focusDefaultSize:size}</span>
                    </div>
                    <hr/>
                    <div className="total-item-order">
                        <span className="tt-order-inf">Màu</span>
                        <span>{colorDefault?detailProduct.color:colorPro}</span>
                    </div>
                    <hr/>
                    <div className="total-item-order">
                        <span className="tt-order-inf">Số lượng</span>
                        <span>
                            <span className="btn-quant-buyNow" onClick={()=>decrement()} 
                            style={{borderTopLeftRadius: '4px',borderBottomLeftRadius: '4px',cursor:'pointer'}}>-</span>
                            {/* <span className="btn-quant-buyNow number-quant">{quantityBuyNow}</span> */}
                            <input type='text' name='quantityDetailBuyNow' className='quantityProDetail' value={quantityBuyNow} onChange={changeQuantityDetail} />
                            <span className="btn-quant-buyNow" onClick={()=>increment()}
                            style={{borderTopRightRadius: '4px',borderBottomRightRadius: '4px',cursor:'pointer'}}>+</span>
                        </span>
                    </div>
                    <hr/>
                    <div className="wrap-code-item">
                        <p><b>Nhập mã khuyến mãi (nếu có)</b></p>
                        <div className="code-item">
                            <input type="text" name="code" id="code" value={codeDiscount}
                            onChange={handleChangeInputDisc} />
                            <span onClick={DiscountCode}>Áp dụng</span>
                            <p>(Chỉ áp dụng trên tiền hàng tạm tính)</p>
                        </div>
                    </div>
                </div>

                <div className="buyNow-right">
                    <span className="close-form-byNow" onClick={closeFormBuyNow}>X</span>
                    <h4>Đơn hàng của bạn:</h4>
                    <p>Dự kiến giao: 
                        từ <span>{(parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay?toDay+3:(parseInt(lastDay,10))===toDay?firstDayNextMonth+2:(parseInt(lastDay,10))-1===toDay?firstDayNextMonth+1:(parseInt(lastDay,10))-2===toDay?firstDayNextMonth:toDay+3}</span> tháng <span>{(parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay?nextMonth:month}</span>
                        <span> - {(parseInt(lastDay,10))!==toDay&&(parseInt(lastDay,10))-1!==toDay&&(parseInt(lastDay,10))-2!==toDay&&(parseInt(lastDay,10))-3!==toDay?toDay+4:(parseInt(lastDay,10))===toDay?firstDayNextMonth+3:(parseInt(lastDay,10))-1===toDay?firstDayNextMonth+2:(parseInt(lastDay,10))-2===toDay?firstDayNextMonth+1:(parseInt(lastDay,10))-3===toDay?firstDayNextMonth:toDay+4}</span> tháng <span>{(parseInt(lastDay,10))===toDay||(parseInt(lastDay,10))-1===toDay||(parseInt(lastDay,10))-2===toDay||(parseInt(lastDay,10))-3===toDay?nextMonth:month}</span>
                    </p>
                    <hr></hr>
                    <div className="total-item-order">
                        <p className="tt-order-inf">Tạm tính</p>
                        <p>{(((detailProduct.price/100)*(100-detailProduct.discount))*quantityBuyNow).toLocaleString("en")} <u>đ</u></p>
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
                        <p className="money-ord" style={{fontSize:'1.3rem'}}>{(money!==0?money:(((detailProduct.price/100)*(100-detailProduct.discount))*quantityBuyNow)+ship).toLocaleString("en")} <u>đ</u></p>
                    </div>
                    <p>(Đã bao gồm các hình thức khuyến mãi)</p>
                    <hr></hr>
                    <div className="pay-radio">
                        <input type="radio" name="pay" disabled={true} />
                        <span>Chuyển khoản trực tiếp</span>
                    </div>
                    <div className="pay-radio">
                        <input type="radio" name="pay" defaultChecked={true} />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    {
                        checkBuyNow ?
                        <button onClick={notifyErr}>ĐẶT HÀNG</button>
                        :
                        <button onClick={submitBuyNow}>ĐẶT HÀNG</button> 
                    }
                </div>
            </div>
        </>
    )
}