import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from '../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Down from '../header/icon/down.svg'
import Noti from '../header/icon/notification.svg'
import menu from '../header/icon/menu.svg'
import logout from '../header/icon/logout.svg'
import ProductManagement from './productManagement/ProductManagement'
import DashBoard from './dashBoard/DashBoard'
import Ordermanagement from './orderManagement/Ordermanagement'
import CategoryManagement from './categoryManagement/CategoryManagement'
import UserClient from './userClient/UserClient'
import StatusManagement from './statusManagement/StatusManagement'
import DiscountManagement from './discountManagement/DiscountManagement'
import ReviewManagement from './reviewManagement/ReviewManagement'
import ReportManagement from './reportManagement/ReportManagement'
import ListProductDiscount from './productManagement/ListProductDiscount'
import NewsManagement from './newsManagement/NewsManagement'
import GeneralManagement from './generalManagement/GeneralManagement'
import imgDashboard from '../header/icon/dashboard.svg'
import imgUser from '../header/icon/user-solid.svg'
import imgPro from '../header/icon/product.svg'
import imgCategory from '../header/icon/category.svg'
import imgOrder from '../header/icon/order.svg'
import imgStatus from '../header/icon/status.svg'
import imgDiscount from '../header/icon/discount.svg'
import imgReview from '../header/icon/review.svg'
import imgHomepage from '../header/icon/home.svg'
import imgReport from '../header/icon/report.svg'
import imgNews from '../header/icon/news.svg'
import imgGeneral from '../header/icon/general.svg'
import imgInfor from '../header/icon/infor.svg'
import imgAd from '../header/icon/ad.svg'
import LoadingMini from '../mainpages/utils/loading/LoadingMini'
import AdminList from './adminListManagerment/AdminList'
import lockUser from '../header/icon/user-lock.svg'
import Search from '../header/icon/search.svg'
import imgMoneyHand from '../header/icon/hand-money.svg'

function ControlAd() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [user] = state.userAPI.user
    const [search, setSearch] = state.productsAPI.searchProAd
    const [notify] = state.notifyAPI.notify
    const [callback, setcallback] = state.notifyAPI.callback
    const [checkCreatePro, setCheckCreatePro] = state.productsAPI.checkCreatePro
    const [categories] = state.categoriesAPI.categories
    const [hide, setHide] = useState(false)
    const [show, setShow] =useState(false)
    const [newNotify, setNewNotify] = useState(0)
    const [notifyOrder, setNotifyOrder] = useState(0)
    const [notifyReview, setNotifyReview] = useState(0)
    const [OnOffSlide, setOnOffSlide] =useState(0)
    const [OnOffDisc, setOnOffDisc] =useState(0)
    const [notifyCancelOrd, setNotifyCancelOrd] = useState(0)
    const [idCategory1, setIdCategory1] = useState('')
    const [idCategory2, setIdCategory2] = useState('')
    const [checkFormCateDisc, setCheckFormCateDisc] = useState(false)
    const [showCreateNews, setShowCreateNews] = state.newsAPI.showCreateNews    // check hiện form tạo tin tức mới
    const [checkUpdate, setCheckUpdate] = state.newsAPI.checkUpdate     // check hiện form cập nhật tin tức
    const [checkFormSlide, setCheckFormSlide] = useState(false)
    const [userDissable] = state.userAPI.dissable
    const [dissablee, setDissable] = useState(false)
    const [showControlPanel, setShowControlPanel] = useState(false)
    
    const [DashboardPage, setDashboardPage] = useState(true)
    const [ProductPage, setProductPage] = useState(false)
    const [OrderPage, setOrderPage] = useState(false)
    const [CategoryPage, setCategoryPage] = useState(false)
    const [UserClientPage, setUserClientPage] = useState(false)
    const [StatusPage, setStatusPage] = useState(false)
    const [DiscountPage, setDiscountPage] = useState(false)
    const [ReviewPage, setReviewPage] = useState(false)
    const [ReportPage, setReportPage] = useState(false)
    const [NotifyPage, setNotifyPage] = useState(false)
    const [Home, setHome] = useState(false)
    const [listProDisc, setListProDisc] = useState(false)
    const [NewsPage, setNewsPage] = useState(false)
    const [GeneralPage, setGeneralPage] = useState(false)
    const [AdminListPage, setAdminListPage] = useState(false)
    const [checkInputSearch, setCheckInputSearch] = useState(false)

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [images1, setImages1] = useState(false)
    const [images2, setImages2] = useState(false)
    const [images3, setImages3] = useState(false)

    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [isClient] = state.userAPI.isClient
    const [adminOrder] = state.userAPI.adminOrder
    const [adminProduct] = state.userAPI.adminProduct
    const [isShipper] = state.userAPI.isShipper

    // hiển thị thông báo
    // số liệu trong thông báo
    useEffect(()=>{
        const sum = ()=>{
            var a=[]
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    a.push(el.newOrder)
                    a.push(el.newReview)
                    a.push(el.cancelOrder)
                }
            })
            setNewNotify(a.reduce((p, i)=>{
                return p+i
            },0))
        }
        sum()

        const sum1 = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setNotifyOrder(el.newOrder)
                    setNotifyReview(el.newReview)
                    setNotifyCancelOrd(el.cancelOrder)
                    setOnOffSlide(el.slide)
                    setOnOffDisc(el.discount)
                }
            })
        }
        sum1()
    },[notify])

    /* số liệu trong thông báo
    // useEffect(()=>{
    //     const sum = ()=>{
    //         notify.forEach(el=>{
    //             if(el._id==="635cd52464f5b7334c594007"){
    //                 setNotifyOrder(el.newOrder)
    //                 setNotifyReview(el.newReview)
    //                 setNotifyCancelOrd(el.cancelOrder)
    //                 setOnOffSlide(el.slide)
    //                 setOnOffDisc(el.discount)
    //             }
    //         })
    //     }
    //     sum()
    // })

    // lấy dữ liệu slide, discount trong db notify
    // useEffect(()=>{
    //     const getData = ()=>{
    //         notify.forEach(el=>{
    //             if(el._id==="635cd52464f5b7334c594007"){
    //                 setOnOffSlide(el.slide)
    //                 setOnOffDisc(el.discount)
    //             }
    //         })
    //     }
    //     getData()
    // })*/

    // đăng xuất
    const logoutUser = async () =>{
        await axios.get('/user/logout')
        localStorage.removeItem('Login')
        window.location.href = "/";
    }

    // ẩn hiện bảng điều khiển
    const hideDashboard = ()=>{
        setHide(!hide)
    }

    // ẩn hiện option tài khoản
    const showOptionAd = () =>{
        setShow(!show)
    }

    // show component các nội dung page
    const ShowPage = (value)=>{
        if(value===4){
            if(!isAdmin&&!adminProduct){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setProductPage(true)
                setDashboardPage(false)
                setOrderPage(false)
                setCategoryPage(false)
                setUserClientPage(false)
                setStatusPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===1){
            setDashboardPage(true)
            setProductPage(false)
            setOrderPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
            setNewsPage(false)
            setShowCreateNews(false)
            setCheckUpdate(false)
            setGeneralPage(false)
            setAdminListPage(false)
            setShowControlPanel(false)
        }
        else if(value===6){
            if(!isAdmin&&!adminOrder&&!isShipper){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setOrderPage(true)
                setDashboardPage(false)
                setProductPage(false)
                setCategoryPage(false)
                setUserClientPage(false)
                setStatusPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===5){
            if(!isAdmin&&!adminProduct){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setCategoryPage(true)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setUserClientPage(false)
                setStatusPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===3){
            if(!isAdmin&&!adminOrder){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setUserClientPage(true)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setStatusPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===7){
            if(!isAdmin&&!adminProduct&!adminOrder){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setStatusPage(true)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===8){
            if(!isAdmin&&!adminProduct){
                alert("Quyền truy cập bị từ chối!")
            }
            else{
                setDiscountPage(true)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===9){
            if(!isAdmin){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setReviewPage(true)
                setDiscountPage(false)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===10){
            if(!isAdmin){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setNewsPage(true)
                setReviewPage(false)
                setDiscountPage(false)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===11){
            if(!isAdmin){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setReportPage(true)
                setReviewPage(false)
                setDiscountPage(false)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setGeneralPage(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===12){
            if(!isAdmin){
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setGeneralPage(true)
                setReportPage(false)
                setReviewPage(false)
                setDiscountPage(false)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
        else if(value===13){
            if(!isAdmin){
                alert("Quyền truy cập bị từ chối!")
            }
            else{
                setAdminListPage(true)
                setGeneralPage(false)
                setReportPage(false)
                setReviewPage(false)
                setDiscountPage(false)
                setStatusPage(false)
                setUserClientPage(false)
                setCategoryPage(false)
                setOrderPage(false)
                setDashboardPage(false)
                setProductPage(false)
                setNotifyPage(false)
                setHome(false)
                setListProDisc(false)
                setNewsPage(false)
                setShowCreateNews(false)
                setCheckUpdate(false)
                setShowControlPanel(false)
            }
        }
    }

    // click vào thông báo đơn hàng mới (cập nhật lại newOrder = 0)
    const ShowPageOrder = (value) =>{
        if(value===6){
            setOrderPage(true)
            setDashboardPage(false)
            setProductPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
            setGeneralPage(false)
            setAdminListPage(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_neworder/${'635cd52464f5b7334c594007'}`, {newOrder: el.newOrder=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 3*1000)
    }

    // click vào thông báo hủy đơn hàng (cập nhật lại cancelOrder = 0)
    const ShowPageCancelOrder = (value) =>{ 
        if(value===6){
            setOrderPage(true)
            setDashboardPage(false)
            setProductPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
            setGeneralPage(false)
            setAdminListPage(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_cancelorder/${'635cd52464f5b7334c594007'}`, {cancelOrder: el.cancelOrder=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 1000)
    }

    // click vào thông báo đánh giá mới
    const ShowPageReview = (value) =>{
        if(value===9){
            setReviewPage(true)
            setDiscountPage(false)
            setStatusPage(false)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
            setGeneralPage(false)
            setAdminListPage(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_newreview/${'635cd52464f5b7334c594007'}`, {newReview: el.newReview=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 3*1000);
    }

    // show form thông báo
    const ShowPageNotify = ()=>{
        if(!isAdmin&&!adminOrder){
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            setNotifyPage(true)
        }
    }

    // đóng form thông báo
    const hidenNotifyPage = ()=>{
        setNotifyPage(false)
    }

    // xử lý show form control trang chủ
    // const showManaHome = ()=>{
    //     setHome(true)
    // }

    // // xử lý ẩn form control trang chủ
    // const hidenManaHome = ()=>{
    //     setHome(false)
    // }

    // xử lý bật tắt slide
    const slide = async ()=>{
        if (!isAdmin) {
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            var a=0; var b=1
            if(OnOffSlide===1){
                if(window.confirm("Tắt slide?"))
                try {
                    const res = await axios.put(`/api/update_slide/${'635cd52464f5b7334c594007'}`, {slide: a}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                    alert("Đã tắt Slide !")
    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            else {
                if(window.confirm("Bật slide?"))
                try {
                    await axios.put(`/api/update_slide/${'635cd52464f5b7334c594007'}`, {slide: b}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                    alert("Đã bật Slide !")
    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        }
    }

    // xử lý bật tắt discount on home page
    const discount = async ()=>{
        if (!isAdmin) {
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            var a=0; var b=1
            if(OnOffDisc===1){
                if(window.confirm("Tắt thông tin khuyến mãi?"))
                try {
                    const res = await axios.put(`/api/update_discount/${'635cd52464f5b7334c594007'}`, {discount: a}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                    alert("Đã tắt thông tin khuyến mãi !")
    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            else {
                if(window.confirm("Bật thông tin khuyến mãi?"))
                try {
                    await axios.put(`/api/update_discount/${'635cd52464f5b7334c594007'}`, {discount: b}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                    alert("Đã bật thông tin khuyến mãi !")
    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        }
    }

    // xem danh sách các sản phẩm đang khuyến mãi
    const showListProDisc = (value)=>{
        if(value===12){
            if(!isAdmin&&!adminProduct) {
                alert("Quyền truy cập bị từ chối!")
            }
            else {
                setListProDisc(true)
                setProductPage(false)
                setDashboardPage(false)
                setOrderPage(false)
                setCategoryPage(false)
                setUserClientPage(false)
                setStatusPage(false)
                setDiscountPage(false)
                setReviewPage(false)
                setReportPage(false)
                setNotifyPage(false)
                setHome(false)
                setAdminListPage(false)
                setShowControlPanel(false)
            }
        }
    }

    // xử lý update idCategory1, idCategory2 vào db
    const updateIdCategoryDisc = async ()=>{
        if(window.confirm("Bạn muốn cập nhật danh mục khuyến mãi?"))
        try {
            const res = await axios.put(`/api/update_idCategory/${'635cd52464f5b7334c594007'}`, {idCategory1, idCategory2}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setIdCategory1('')
            setIdCategory2('')
            setcallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // click show form cập nhật id category khuyến mãi về db notify
    const handleShowFormCate = ()=>{
        if(!isAdmin){
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            setCheckFormCateDisc(true)
            setHome(false)
        }
    }

    // click show form cập nhật thay đổi slide trang chủ
    const handleShowFormSlide = ()=>{
        if(!isAdmin){
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            setCheckFormSlide(true)
            setHome(false)
        }
    }

    // thêm hình
    const handleUpload1 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading1(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
    
            setLoading1(false)
            setImages1(res.data)   

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // thêm hình
    const handleUpload2 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading2(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
    
            setLoading2(false)
            setImages2(res.data)   

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // thêm hình
    const handleUpload3 = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading3(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
    
            setLoading3(false)
            setImages3(res.data)   

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa hình slide
    const handleDestroy = async (value) =>{
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            value===1 ? setLoading1(true) : value===2 ? setLoading2(true) : setLoading3(true)

            if(value===1){
                await axios.post('/api/destroy', {public_id: images1.public_id}, {
                    headers: {Authorization: token}
                })
            }

            else if(value===2){
                await axios.post('/api/destroy', {public_id: images2.public_id}, {
                    headers: {Authorization: token}
                })
            }

            else if(value===3){
                await axios.post('/api/destroy', {public_id: images3.public_id}, {
                    headers: {Authorization: token}
                })
            }

            value===1 ? setImages1(false) : value===2 ? setImages2(false) : setImages3(false)
            value===1 ? setLoading1(false) : value===2 ? setLoading2(false) : setLoading3(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // định dạng style hiển thị ảnh
    const styleUpload1 = {
        display: images1 ? "block" : "none"
    }

    const styleUpload2 = {
        display: images2 ? "block" : "none"
    }

    const styleUpload3 = {
        display: images3 ? "block" : "none"
    }

    // submit ảnh slide về db notify
    const updateImageSlide = async ()=>{
        if(window.confirm("Bạn muốn cập nhật ảnh mới cho slide?"))
        try {
            const res = await axios.put(`api/updateImageSlide/635cd52464f5b7334c594007`, {imagesSlide1: images1, imagesSlide2: images2, imagesSlide3: images3}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // get hiển thị dữ liệu image slide
    useEffect(()=>{
        notify.forEach(el=>{
            if(el._id==='635cd52464f5b7334c594007'){
                setImages1(el.imagesSlide1)
                setImages2(el.imagesSlide2)
                setImages3(el.imagesSlide3)
            }
        })
    },[notify])

    // check tài khoản bị khóa
    useEffect(()=>{
        const dissableUser = ()=>{
            if(isAdmin&&userDissable===true){
                setDissable(true)
            }
            else {
                setDissable(false)
            }
        }
        dissableUser()
    })

    // nút quay lại form login khi bị khóa tài khoản
    const backFormlogin = async ()=>{
        await axios.get('/user/logout')
        localStorage.removeItem('Login')
        window.location.href = "/login";
    }

return (
    <>
        <div className="user-dissabled" style={!dissablee?{display:'none'}:{display:'block'}}>
            <img src={lockUser} alt=''></img>
            <h3>Tài khoản đã bị khóa. <br/>Vui lòng liên hệ quản lý để được giải quyết.</h3>
            <span onClick={backFormlogin}>Quay lại</span>
        </div>
        <div className={!checkFormCateDisc&&!checkFormSlide&&!Home?"container-admin":"container-admin bg-opacity-ad-ctrl-home"}>
            <div className="navigation-ad" style={hide?{transform:'translateX(-100%)',transition:'linear 0.4s'}:{transform:'translateX(0)',transition:'linear 0.4s'}}>
                <div className="logo-ad">
                    <p>
                        HOANGVIET SHOP
                    </p>
                </div>

                <div className="list-nav-ad">
                    <p onClick={()=>ShowPage(1)}><span><img className="img-icon-control-ad" src={imgDashboard} alt=''/>Tổng quan</span></p>
                    <p onClick={()=>ShowPage(13)}><span><img className="img-icon-control-ad" src={imgAd} alt=''/>Quản trị viên</span></p>
                    <p onClick={()=>ShowPage(3)}><span><img className="img-icon-control-ad" src={imgUser} alt=''/>Khách hàng</span></p>
                    <p onClick={()=>ShowPage(4)}><span><img className="img-icon-control-ad" src={imgPro} alt=''/>Sản phẩm</span></p>
                    <p onClick={()=>showListProDisc(12)}><span><img className="img-icon-control-ad" src={imgMoneyHand} alt=''/>Đang khuyến mãi</span></p>
                    <p onClick={()=>ShowPage(5)}><span><img className="img-icon-control-ad" src={imgCategory} alt=''/>Thể loại</span></p>
                    <p onClick={()=>ShowPage(6)}><span><img className="img-icon-control-ad" src={imgOrder} alt=''/>Đơn hàng</span></p>
                    <p onClick={()=>ShowPage(7)}><span><img className="img-icon-control-ad" src={imgStatus} alt=''/>Trạng thái</span></p>
                    <p onClick={()=>ShowPage(8)}><span><img className="img-icon-control-ad" src={imgDiscount} alt=''/>Khuyến mãi</span></p>
                    <p onClick={()=>ShowPage(9)}><span><img className="img-icon-control-ad" src={imgReview} alt=''/>Đánh giá</span></p>
                    <p onClick={()=>ShowPage(10)}><span><img className="img-icon-control-ad" src={imgNews} alt=''/>Tin tức</span></p>
                    <div className="item-ctrl-ad-form" onClick={()=>setHome(!Home)}>
                        <span>
                            <img className="img-icon-control-ad" src={imgHomepage} alt=''/>Trang chủ
                            <div className="HomeManagement-ad" style={Home?{display:'block'}:{display:'none'}}>
                                <div className="item-contrl-home-mana">
                                    <div className="item-mana-home-ad" onClick={handleShowFormSlide}>Quản lý Slider</div>
                                    <div className="btn-contrl-home" onClick={slide} style={OnOffSlide===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                        {OnOffSlide===1?"Tắt":"Bật"}</div>
                                </div>

                                <div className="item-contrl-home-mana">
                                    <div className="item-mana-home-ad" onClick={handleShowFormCate}>Quản lý Khuyến mãi</div>
                                    <div className="btn-contrl-home" onClick={discount} style={OnOffDisc===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                        {OnOffDisc===1?"Tắt":"Bật"}</div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <p onClick={()=>ShowPage(11)}><span><img className="img-icon-control-ad" src={imgReport} alt=''/>Thống kê doanh thu</span></p>
                    <p onClick={()=>ShowPage(12)}><span><img className="img-icon-control-ad" src={imgGeneral} alt=''/>Thông tin chung</span></p>
                </div>
            </div>

            {/* thanh điều khiển responsive */}
            <div className="navigation-ad navigation-ad-responsive" style={!showControlPanel?{transform:'translateX(-100%)',transition:'linear 0.4s'}:{transform:'translateX(0)',transition:'linear 0.4s'}}>
                <div className="logo-ad">
                    <p>
                        HOANGVIET SHOP <span className="close-control-ad-res" onClick={()=>setShowControlPanel(false)}>X</span>
                    </p>
                </div>

                <div className="list-nav-ad">
                    <p onClick={()=>ShowPage(1)}><span><img className="img-icon-control-ad" src={imgDashboard} alt=''/>Tổng quan</span></p>
                    <p onClick={()=>ShowPage(13)}><span><img className="img-icon-control-ad" src={imgAd} alt=''/>Quản trị viên</span></p>
                    <p onClick={()=>ShowPage(3)}><span><img className="img-icon-control-ad" src={imgUser} alt=''/>Khách hàng</span></p>
                    <p onClick={()=>ShowPage(4)}><span><img className="img-icon-control-ad" src={imgPro} alt=''/>Sản phẩm</span></p>
                    <p onClick={()=>showListProDisc(12)}><span><img className="img-icon-control-ad" src={imgMoneyHand} alt=''/>Đang khuyến mãi</span></p>
                    <p onClick={()=>ShowPage(5)}><span><img className="img-icon-control-ad" src={imgCategory} alt=''/>Thể loại</span></p>
                    <p onClick={()=>ShowPage(6)}><span><img className="img-icon-control-ad" src={imgOrder} alt=''/>Đơn hàng</span></p>
                    <p onClick={()=>ShowPage(7)}><span><img className="img-icon-control-ad" src={imgStatus} alt=''/>Trạng thái</span></p>
                    <p onClick={()=>ShowPage(8)}><span><img className="img-icon-control-ad" src={imgDiscount} alt=''/>Khuyến mãi</span></p>
                    <p onClick={()=>ShowPage(9)}><span><img className="img-icon-control-ad" src={imgReview} alt=''/>Đánh giá</span></p>
                    <p onClick={()=>ShowPage(10)}><span><img className="img-icon-control-ad" src={imgNews} alt=''/>Tin tức</span></p>
                    <div className="item-ctrl-ad-form" onClick={()=>setHome(!Home)}>
                        <span>
                            <img className="img-icon-control-ad" src={imgHomepage} alt=''/>Trang chủ
                            <div className="HomeManagement-ad" style={Home?{display:'block'}:{display:'none'}}>
                                <div className="item-contrl-home-mana">
                                    <div className="item-mana-home-ad" onClick={handleShowFormSlide}>Quản lý Slider</div>
                                    <div className="btn-contrl-home" onClick={slide} style={OnOffSlide===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                        {OnOffSlide===1?"Tắt":"Bật"}</div>
                                </div>

                                <div className="item-contrl-home-mana">
                                    <div className="item-mana-home-ad" onClick={handleShowFormCate}>Quản lý Khuyến mãi</div>
                                    <div className="btn-contrl-home" onClick={discount} style={OnOffDisc===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                        {OnOffDisc===1?"Tắt":"Bật"}</div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <p onClick={()=>ShowPage(11)}><span><img className="img-icon-control-ad" src={imgReport} alt=''/>Thống kê doanh thu</span></p>
                    <p onClick={()=>ShowPage(12)}><span><img className="img-icon-control-ad" src={imgGeneral} alt=''/>Thông tin chung</span></p>
                </div>
            </div>

            <div className="content-ad">
                <div className="header-content-ad" style={hide?{marginLeft:'-17%',width:'100%',transition:'linear 0.4s'}:{marginLeft:'0',transition:'linear 0.4s'}}>
                    <div className="header-ad-left">
                        {/* responsive */}
                        <img src={menu} alt='' className="icon-menu-header-admin-respon" onClick={()=>setShowControlPanel(!showControlPanel)}></img>
                        {/* responsive */}
                        <img src={Search} alt='' className="icon-search-res-ad" onClick={()=>setCheckInputSearch(!checkInputSearch)} style={ProductPage&&!checkCreatePro?{}:{display:'none'}}/> 
                        
                        <img src={menu} alt='' className="icon-menu-header-admin" onClick={hideDashboard}></img>
                        <input type="text" value={search} placeholder="Nhập mã sản phẩm . . ." className="input-search-pro"
                            onChange={e=>setSearch(e.target.value.trim())} style={ProductPage&&!checkCreatePro?{}:{display:'none'}} />
                        
                        {/* responsive */}
                        <input type="text" value={search} placeholder="Nhập mã sản phẩm . . ." className="input-search-res-pro"
                            onChange={e=>setSearch(e.target.value.trim())} style={checkInputSearch?{}:{display:'none'}} />

                        <span onClick={()=>showListProDisc(12)} className="Btn-list-discounting" style={ProductPage&&!checkCreatePro?{}:{display:'none'}}>Đang khuyến mãi</span>
                    </div>

                    <div className="header-ad-right">
                        <span className="notification-ad" onClick={ShowPageNotify}>
                            <img src={Noti} alt=''></img>
                            {
                                newNotify===0?'': <span className="lenght-noti-ad">{newNotify}</span>
                            }
                        </span>
                        <span className="icon-ad-login" onClick={showOptionAd}>AD</span>
                        <span className="name-ad" onClick={showOptionAd}>{user}</span>
                        <span>
                            <img className="icon-dropdown" src={Down}></img>
                        </span>
                        <div className="option-acc-ad" style={show?{display:'block'}:{display:'none'}}>
                            {/* <p><img src={imgInfor} alt='' />Thông tin</p> */}
                            <p onClick={logoutUser}><img src={logout} alt=''></img>Đăng Xuất</p>
                        </div>
                    </div>
                </div>

                <div className={NotifyPage?"bg-disc-body-content-ad body-content-ad":"body-content-ad"} style={hide?{marginLeft:'30px'}:{marginLeft:'23%'}}>
                    {
                        ProductPage?<ProductManagement/>:''
                    }
                    {
                        DashboardPage?<DashBoard/>:''
                    }
                    {
                        OrderPage?<Ordermanagement/>:''
                    }
                    {
                        CategoryPage?<CategoryManagement/>:''
                    }
                    {
                        UserClientPage?<UserClient/>:''
                    }
                    {
                        StatusPage?<StatusManagement/>:''
                    }
                    {
                        DiscountPage?<DiscountManagement/>:''
                    }
                    {
                        ReviewPage?<ReviewManagement/>:''
                    }
                    {
                        ReportPage?<ReportManagement/>:''
                    }
                    {
                        listProDisc?<ListProductDiscount/>:''
                    }
                    {
                        NewsPage?<NewsManagement/>:''
                    }
                    {
                        GeneralPage?<GeneralManagement/>:''
                    }
                    {
                        AdminListPage?<AdminList/>:''
                    }

                    <div className={NotifyPage?"notify-form-ad-ctrl":"hiden-notify-page"}>
                        <div className="tt-and-close-notify-ad">
                            <h5>Thông báo</h5>
                            <p className="btn-close-notify" onClick={hidenNotifyPage}>X</p>
                        </div>
                        {
                            newNotify===0 ? <h5 className="notify-when-db-empty">Chưa có thông báo mới !</h5>
                            :
                            <div className="container-notify-ad">
                                <p style={notifyOrder===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageOrder(6)}><span></span>Có {notifyOrder} đơn hàng mới!</p>
                                <p style={notifyReview===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageReview(9)}><span></span>Có {notifyReview} đánh giá mới từ khách hàng !</p>
                                <p style={notifyCancelOrd===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageCancelOrder(6)}><span></span>Có {notifyCancelOrd} đơn hàng bị hủy !</p>
                            </div>
                        }
                    </div>

                    <div className="form-ctrl-hompage-ad" style={checkFormCateDisc?{top:'50vh'}:{top:'-1000px'}}>
                        <span className="btn-close-form-ctrl-hp" onClick={()=>setCheckFormCateDisc(false)}>X</span>
                        <div className="wrap-item-fromCtrl">
                            <h5>Danh mục khuyến mãi 1</h5>
                            {
                                notify.map(notify=>{
                                    return categories.map(cate=>{
                                        if(cate._id===notify.idCategory1) {
                                            return <span className="name-cate-disc" key={cate._id}>{cate.name}</span>
                                        }
                                    })
                                })
                            }
                            <select value={idCategory1} onChange={(e)=>setIdCategory1(e.target.value)}>
                                <option value={''}>Chọn danh mục</option>
                                {
                                    categories.map(cate=>{
                                        return <option key={cate._id} value={cate._id}>{cate.name}</option>
                                    })
                                }
                            </select>
                            <hr style={{color:'#333'}}/>
                            <h5>Danh mục khuyến mãi 2</h5>
                            {
                                notify.map(notify=>{
                                    return categories.map(cate=>{
                                        if(cate._id===notify.idCategory2) {
                                            return <span className="name-cate-disc" key={cate._id}>{cate.name}</span>
                                        }
                                    })
                                })
                            }
                            <select value={idCategory2} onChange={(e)=>setIdCategory2(e.target.value)}>
                                <option value={''}>Chọn danh mục</option>
                                {
                                    categories.map(cate=>{
                                        return <option key={cate._id} value={cate._id}>{cate.name}</option>
                                    })
                                }
                            </select>
                            <button onClick={updateIdCategoryDisc}>Cập nhật</button>
                        </div>
                    </div>

                    <div className="form-ctrl-hompage-ad form-ctrl-slide" style={checkFormSlide?{top:'50vh'}:{top:'-1000px'}}>
                        <div className="wrap-item-fromCtrl wrap-item-CtrlSlide">
                            <div>
                                <h6>Slider 1</h6>
                                <div className="upload-img-CtrlSlide">
                                    <input type="file" name="file" id="file-img-CtrlSlide" onChange={handleUpload1} onClick={e => (e.target.value = null)} />
                                    {
                                        loading1 ? <div id="wrap_img-Slide"><LoadingMini/></div>
                                        :<div id="wrap_img-Slide" style={styleUpload1}>
                                            <img src={images1 ? images1.url: ''} alt="" />
                                            <span onClick={()=>handleDestroy(1)}>X</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div>
                                <h6>Slider 2</h6>
                                <div className="upload-img-CtrlSlide">
                                    <input type="file" name="file" id="file-img-CtrlSlide" onChange={handleUpload2} onClick={e => (e.target.value = null)} />
                                    {
                                        loading2 ? <div id="wrap_img-Slide"><LoadingMini/></div>
                                        :<div id="wrap_img-Slide" style={styleUpload2}>
                                            <img src={images2 ? images2.url: ''} alt="" />
                                            <span onClick={()=>handleDestroy(2)}>X</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div>
                                <h6>Slider 3</h6>
                                <div className="upload-img-CtrlSlide">
                                    <input type="file" name="file" id="file-img-CtrlSlide" onChange={handleUpload3} onClick={e => (e.target.value = null)} />
                                    {
                                        loading3 ? <div id="wrap_img-Slide"><LoadingMini/></div>
                                        :<div id="wrap_img-Slide" style={styleUpload3}>
                                            <img src={images3 ? images3.url: ''} alt="" />
                                            <span onClick={()=>handleDestroy(3)}>X</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                            <button onClick={updateImageSlide}>Cập nhật</button>
                            <span className="btn-close-formSlide" onClick={()=>setCheckFormSlide(false)}>Đóng</span>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
export default ControlAd;