import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMore from '../../Admin/utilAdmin/LoadMore'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import LoadMoreOrders from '../utilAdmin/LoadMoreOrders'
import jsPDF from 'jspdf'
import logo from '../../header/icon/logostickers.PNG'
import {CSVLink} from 'react-csv'

const statusDefault = {
    status_order: ''
}

export default function Ordermanagement() {
    const state = useContext(GlobalState)
    const [order, setOrder] = useState(statusDefault)
    const [orders] = state.orderAPI.order
    const [statusOrder] = state.statusOrderAPI.statusOrder
    const [token] = state.token
    const [id_Order, setId_Order] = useState('')
    const [showInputUpdate, setShowInputUpdate] = useState(false)
    const [callback, setCallback] = state.orderAPI.callback
    const [status, setStatus] = state.orderAPI.status
    const [idOrder, setIdOrder] = useState('')
    const [showDetail, setShowDetail] = useState(false)
    const [search, setSearch] = state.orderAPI.search
    const [notify] = state.notifyAPI.notify
    const [newNotify, setNewNotify] = useState(0)
    const [users] = state.userAPI.users
    const [products] = state.productsAPI.productAll
    const [userId] = state.userAPI.userIdChar
    const [valueSearchUser, setValueSearchUser] = useState('')
    const [searchUser, setSearchUser] = state.orderAPI.searchUser

    const [listNeedPack, setListNeedPack] = useState(false)
    const [listPack, setListPack] = useState([])
    const [updateDay, setUpdateDay] = useState('')
    const [exportExcel, setExportExcel] = useState([])
    const [dayFillter, setDayFillter] = useState([])
    const [valueDay, setValeDay] = useState('')
    const [today, setToday] = useState('')
    const [deadlineOrd, setDeadlineOrd] = useState(0)
    const [listId, setListId] = useState([])
    const [btn_back, setBtn_back] = useState(false)

    const [listDelivery, setListDelivery] = useState(false)
    const [dataDelivery, setDataDelivery] = useState([])

    const [productPaginating, setProductPaginating] = useState([])
    const [page, setPage] = state.orderAPI.page
    const [result] = state.orderAPI.result

    const [checkBox, setCheckBox] = useState(false)
    const [valueSelect, setValueSelect] = useState('')
    const [CheckAll, setCheckAll] = useState(false)
    const [orderAll] = state.orderAPI.orderAll

    const [ord_id, setOrd_id] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [quantity, setQuantity] = useState('')
    const [total, setTotal] = useState('')

    const [isAdmin] = state.userAPI.isAdmin
    const [adminOrder] = state.userAPI.adminOrder
    const [adminProduct] = state.userAPI.adminProduct
    const [isShipper] = state.userAPI.isShipper

    // hàm DownLoad file PDF nhãn dán đơn hàng
    const Generate = ()=>{
        const doc = new jsPDF("portrait", "px", [250, 350]);
        doc.addImage(logo, "PNG", 10, 10, 50, 40)

        doc.setFontSize(15)
        doc.text("Van chuyen: HOANGVIET SHOP", 70, 25)
        doc.text(ord_id, 100, 40)
        doc.text(60, 47.5, '_____________________________')

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text("Tu:", 12, 70)
        doc.setFont('helvetica', 'normal')
        doc.text("HOANGVIET SHOP", 12, 85)
        doc.text("613 Au co, P.Phu Trung,", 12, 95)
        doc.text("Q.Tan Phu, Tp.HCM", 12, 105)
        doc.text("SDT: 0987 654 321", 12, 115)

        doc.setFont('helvetica', 'bold')
        doc.text("Den:", 118, 70)
        doc.text(name, 118, 85)
        doc.setFont('helvetica', 'normal')
        doc.text(address.slice(0,29), 118, 95)
        doc.text(address.slice(29,58), 118, 105)
        if(address.slice(58,87)===''){
            doc.text(phone, 118, 115)
        }
        else {
            if(address.slice(87,116)===''){
                doc.text(address.slice(58,87), 118, 115)
                doc.text(phone, 118, 125)
            }
            else {
                doc.text(address.slice(58,87), 118, 115)
                doc.text(address.slice(87,116), 118, 125)
                doc.text(phone, 118, 135)
            }
        }

        if(address.slice(87,116)===''){
            doc.text('__________________________________________________', 10, 130)
            doc.setFont('helvetica', 'bold')
            doc.text("Noi dung hang (Tong so luong san pham: "+quantity+")", 10, 145)
            doc.setFont('helvetica', 'normal')
            orders.forEach(el=>{
                if(el._id===idOrder){
                    var a = 145, b
                    el.product.forEach((i, index)=>{
                        if(index>4){return doc.text(".........", 10, a+=10)}
                        else {
                            doc.text("- "+Stickers(i.title.slice(0,10))+"..., ma: "+i.product_id+", size: "+i.sizeCart+", màu: "+Stickers(i.colorPro)
                            +", SL: x"+i.quantity.toString(), 10, a+=10)
                        }
                    })
                }
            })
            doc.setFont('helvetica', 'italic')
            doc.text("Mot so san pham co the bi an do danh sach qua dai.", 10, 215)
            doc.setFont('helvetica', 'normal')
            doc.text('__________________________________________________', 10, 220)

            doc.text("Tien thu nguoi nhan:", 10, 235)
            doc.text("Khoi luong toi da 2.800g", 145, 235)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text(total+" VND", 15, 250)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(11)
            doc.text("Chi dan giao hang:", 10, 265)
            doc.text("- Khong dong kiem", 15, 280)
            doc.text("- Chuyen hoan sau 3 lan phat", 15, 293)
            doc.text("- Luu kho toi da 5 ngay", 15, 306)

            doc.rect(135, 250, 105, 80);
            doc.setFont('helvetica', 'bold')
            doc.text("Chu ky nguoi nhan", 150, 260)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.text("Xac nhan hang nguyen ven,", 152, 270)
            doc.text("khong mop meo, be/vo", 160, 278)
        }
        else {
            doc.text('__________________________________________________', 10, 140)
            doc.setFont('helvetica', 'bold')
            doc.text("Noi dung hang (Tong so luong san pham: "+quantity+")", 10, 155)
            doc.setFont('helvetica', 'normal')
            orders.forEach(el=>{
                if(el._id===idOrder){
                    var a = 155
                    el.product.forEach((i, index)=>{
                        if(index>4){return doc.text("..........", 10, a+=10)}
                        else {
                            doc.text("- "+Stickers(i.title.slice(0,10))+", ma: "+i.product_id+", size: "+i.sizeCart+", màu: "+Stickers(i.colorPro)
                            +", SL: x"+i.quantity.toString(), 10, a+=10)
                        }
                    })
                }
            })
            doc.setFont('helvetica', 'italic')
            doc.text("Mot so san pham co the bi an do danh sach qua dai.", 10, 225)
            doc.setFont('helvetica', 'normal')
            doc.text('__________________________________________________', 10, 230)

            doc.text("Tien thu nguoi nhan:", 10, 245)
            doc.text("Khoi luong toi da 2.800g", 145, 245)
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text(total+" VND", 15, 260)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(11)
            doc.text("Chi dan giao hang:", 10, 275)
            doc.text("- Khong dong kiem", 15, 290)
            doc.text("- Chuyen hoan sau 3 lan phat", 15, 303)
            doc.text("- Luu kho toi da 5 ngay", 15, 316)

            doc.rect(135, 250, 105, 80);
            doc.setFont('helvetica', 'bold')
            doc.text("Chu ky nguoi nhan", 150, 260)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.text("Xac nhan hang nguyen ven,", 152, 270)
            doc.text("khong mop meo, be/vo", 160, 278)
        }

        doc.save(ord_id.slice(13)+".pdf")
    }

    // set dữ liệu xuất nhãn dán
    useEffect(()=>{
        orders.forEach(el=>{
            if(el._id===idOrder){
                setOrd_id("Ma don hang: "+el.order_id)
                setName(Stickers(el.name_client))
                setAddress(Stickers(el.address))
                setPhone("SDT: "+el.phone)
                if(el.product.length<10){setQuantity("0"+el.product.length.toString())}
                else {setQuantity(el.product.length.toString())}

                var a = ''
                if(el.total===0){
                    a = (el.product.reduce((prev, item) =>{
                        return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                    },0)+30000).toLocaleString("en").toString()
                }
                else {
                    a = el.total.toLocaleString("en").toString()
                }
                setTotal(a)
            }
        })
    },[orders, idOrder])

    // hàm xử lý bỏ dấu dữ liệu trong stickers
    const Stickers = (n) => {
        n = n.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        n = n.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        n = n.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        n = n.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        n = n.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        n = n.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        n = n.replace(/đ/g,"d");
        n = n.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        n = n.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        n = n.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        n = n.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        n = n.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        n = n.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        n = n.replace(/Đ/g, "D");
        n = n.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        n = n.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        n = n.replace(/ + /g," ");
        n = n.trim();
        // n = n.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return n
    }

    // lấy data của newOrder trong db Notify
    useEffect(()=>{
        const tickNewOrder = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setNewNotify(el.newOrder)
                }
            })
        }
        tickNewOrder()
    },[notify])

    // xóa đơn hàng
    const deleteOrder = async (id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            const res = await axios.delete(`api/order/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // lấy id khi click vào đơn hàng
    const handleUpdateOrder = (id)=>{
        setIdOrder(id)
        orders.forEach(el=>{
            if(el._id===id){
                setId_Order(el.order_id)
            }
        })
        setShowInputUpdate(true)
    }

    // change value input
    const handelInputUpdate = e =>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
    }

    // cập nhật đơn hàng
    const updateOrder = async ()=> {
        var a=[]
        try {
            const res = await axios.patch(`api/order/${idOrder}`, {...order, arrPro: a}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setShowInputUpdate(false)
            setOrder(statusDefault)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý "-1 sản phẩm" khi duyệt đơn hàng (cập nhật từ "đang xử lý" => "chờ giao hàng")
    const orderBrowsing = async (id)=>{
        if(window.confirm("Xác nhận duyệt đơn hàng?"))
        try {
            const res = await axios.put(`/api/update_order_browsing/${id}`,{status_order: '6328789da2e7052bc439f977'},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            updateOrderDate(idOrder)
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
        // var a=[], b=[], c=[], idPro=[]

        // orderAll.forEach(el=>{
        //     if(el._id===id){
        //         el.product.forEach(i=>{
        //             a.push(i._id)
        //             b.push({'id':i._id, 'quantity':i.quantity})
        //         })
        //     }
        // })

        // products.forEach(el=>{
        //     a.forEach(i=>{
        //         if(el._id.toString()===i){
        //             c.push(el)
        //         }
        //     })
        // })
        
        // var d=0, e=0        // d: hợp lệ, e: không hợp lệ
        // c.forEach(el=>{
        //     b.forEach(i=>{
        //         if(i.id===el._id.toString()){
        //             if(i.quantity<=el.quantity_product){
        //                 d++
        //             }
        //             else {
        //                 e++
        //                 idPro.push(el.product_id)
        //             }
        //         }
        //     })
        // })
        
        // if(e===0){
        //     if(window.confirm("Xác nhận duyệt đơn hàng?"))
        //     try {
        //         const res = await axios.put(`/api/update_order_browsing/${id}`,{status_order: '6328789da2e7052bc439f977'},{
        //             headers: {Authorization: token}
        //         })
        //         alert(res.data.msg)
        //         updateOrderDate(idOrder)
        //         setCallback(!callback)
                
        //     } catch (err) {
        //         alert(err.response.data.msg)
        //     }
        // }
        // else {
        //     alert(`Số lượng sản phẩm ${idPro} không đủ đáp ứng đơn hàng.`)
        // }
    }

    // đóng input cập nhật trạng thái
    const closeUpdate = ()=>{
        setShowInputUpdate(false)
    }

    // láy id đơn hàng khi nhấp nút chi tiết đơn hàng
    const DetailOrder = (id)=>{
        setIdOrder(id)
        setShowDetail(true)
    }

    // ẩn detail
    const BackToOrder = ()=>{
        setShowDetail(false)
        setShowInputUpdate(false)
    }

    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        orders.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*9){
                a.push(el)
                scroll()
            }
        })
        setProductPaginating(a)
    },[orders, page])

    // set page phân trang về trang 1 khi lọc thể lọc hoặc trạng thái
    useEffect(()=>{
        setPage(1)
    },[status])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // cập nhật checked trong db (chức năng xóa tất cả)
    const updateCheckOrd = async (e)=>{
        var a
        orders.forEach(el=>{
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
            const res =  await axios.put(`/api/check_order/${e.target.value}`, {checked: a},{
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
                    await axios.put(`/api/check_all_order`,{},{
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
            if(isShipper){
                setListDelivery(true)
                setBtn_back(true)
            }
            else {
                const cancelCheck = async ()=>{
                    try {
                        await axios.put(`/api/cancel_check_order`,{},{
                            headers: {Authorization: token}
                        })
                        setCallback(!callback)
    
                    } catch (err) {
                        alert(err.response.data.msg)
                    }
                }
                cancelCheck()
            }
        }
    },[CheckAll, checkBox])

    // xóa đơn hàng đã check
    const deleteOrdChecked = ()=>{
        if(window.confirm("Bạn chắc chắn muốn xóa?"))
        orderAll.forEach(async el=>{
            if(el.checked){
                try {
                    const res = await axios.delete(`/api/order/${el._id}`,{
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

    // set dữ liệu mảng danh sách cần đóng gói
    useEffect(()=>{
        // xử lý lấy danh sách ngày chốt đơn (các đơn hàng "chờ giao")
        var b=[]
        orderAll.forEach(el=>{
            if(el.status_order==='6328789da2e7052bc439f977'){
                b.push(el.order_date)
            }
        })

        // xóa phần tử giống nhau trong mảng b
        const uniqueSet = new Set(b)
        const backToArray = [...uniqueSet];
        setDayFillter(backToArray)

        //lấy dữ liệu (ngày/tháng/năm) hiện tại
        var today = new Date();
        var day
        if(today.getDate()<10){day = `0${today.getDate()}`} else {day = today.getDate()}
        var month
        if((today.getMonth()+1)<10){month = `0${today.getMonth()+1}`} else {month = today.getMonth()+1}
        var year = today.getFullYear()
        setToday(day+'/'+month+'/'+year)

        // xử lý danh sách đang giao hàng
        var delivery=[]
        orderAll.forEach(el=>{
            if(el.status_order==='632878d7a2e7052bc439f978'){
                delivery.push(el)
            }
        })
        setDataDelivery(delivery)

    },[orderAll])

    // xử lý lấy danh sách đã lọc theo ngày chốt đơn
    useEffect(()=>{
        var a=[], b=[], idDelivering=[]
        orderAll.forEach(el=>{
            if(el.status_order==='6328789da2e7052bc439f977'&&el.order_date.toString()===valueDay.toString()){
                a.push(el)
                b.push(el.deliveryDate)
                idDelivering.push(el._id)
            }
        })
        setListPack(a)
        setListId(idDelivering)

        // xóa phần tử giống nhau trong mảng b, lất dữ liệu thời hạn giao hàng
        var c
        const uniqueSet = new Set(b)
        const backToArray = [...uniqueSet];
        if(backToArray.length>0){
            if(backToArray.length===1){
                c = backToArray[0].slice(17).trim()
            }
            else {
                var d, e
                d = backToArray[0].slice(17,19).trim()
                e = backToArray[1].slice(17,19).trim()
                if(Number(d)>Number(e)){
                    c = backToArray[1].slice(17).trim()
                }
                else if (Number(d)<Number(e)) {
                    c = backToArray[0].slice(17).trim()
                }
            }
        }
        setDeadlineOrd(c)

    },[valueDay])

    // xử lý set dữ liệu export file excel danh sách cần đóng gói
    useEffect(()=>{
        const getDataExport = ()=>{
            var a = []
            listPack.forEach((el, index)=>{
                el.product.forEach(i=>{
                    a.push({
                        'STT': index+1,
                        'Mã Đơn Hàng': el.order_id,
                        'Mã Sản Phẩm': i.product_id,
                        'Tên Sản Phẩm': i.title,
                        'Size': i.sizeCart,
                        'Màu': i.colorPro,
                        'Số lượng': i.quantity,
                        'Ngày chốt': el.order_date.toString(),
                        'Thời hạn giao hàng': deadlineOrd,
                        'Ghi Chú': '',
                        'Ký tên':''
                    })
                })
                // ngày chốt đơn hàng (cập nhật trạng thái "chờ giao hàng")
                setUpdateDay(el.order_date)
            })
            setExportExcel(a)
        }
        getDataExport()
    },[listPack])

    // xử lý cập nhật ngày chốt dơn
    const updateOrderDate = async (id)=>{
        try {
            await axios.put(`/api/update_order_date/${id}`,{order_date: today},{
                headers: {Authorization: token}
            })
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý cập nhật trạng thái đã giao hàng trong danh sách hàng cần giao
    const updateDelivered = async (id)=>{
        if(window.confirm("Bấm ok để \"xác nhận cập nhật\"."))
        try {
            const res =  await axios.put(`/api/update_delivered/${id}`,{status_order: '632878dea2e7052bc439f979'},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            updateUserAndDeliveredDate(id)
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // cập nhật người giao và ngày giao hàng (được gọi trong hàm updateDelivered)
    const updateUserAndDeliveredDate = async (id)=>{
        try {
            var today = new Date()
            var a, b, c, d = ''
            a = today.getDate()
            b = today.getMonth()+1
            c = today.getFullYear()
            a < 10 ? a = `0${a}` : a = a
            b < 10 ? b = `0${b}` : b = b
            d = `${a}/${b}/${c}`

            await axios.put(`/api/update_user_and_date_delivered/${id}`,{user_delivery: userId, delivered_date: d},{
                headers: {Authorization: token}
            })
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý cập nhật chờ giao => đang giao (chuyển danh sách đóng gói sang danh sách giao hàng)
    const updateDelivering = async ()=>{
        if(window.confirm("Bạn muốn chuyển dữ liệu này sang danh sách giao hàng?"))
        try {
            const res = await axios.put(`/api/update_await_to_delivering`,{listId},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setValeDay('')
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý search đơn hàng theo mã tài khoản
    useEffect(()=>{
        if(valueSearchUser!==''){
            if(valueSearchUser.slice(0,1)==='K'){
                var a=[]
                users.forEach(el=>{
                    a.push(el.user_id)
                })

                if(a.includes(valueSearchUser)){
                    users.forEach(el=>{
                        if(valueSearchUser===el.user_id){
                            setSearchUser(el._id)
                        }
                    })
                }
                else {
                    setSearchUser(valueSearchUser)
                }
            }
            else {
                alert("Mã tài khoản phải bắt đầu bằng \"KH\".")
            }
        }
        else {
            setSearchUser('')
        }
    },[valueSearchUser])

return (
    <>
        {
            <div className={showInputUpdate?"bg-disa-black container-list-order-mana-ad":"container-list-order-mana-ad"}>
                <div className="createPro-and-title tabar-order">
                    <h5>QUẢN LÝ ĐƠN HÀNG</h5>
                    <div className="filter-status-ord-ad" style={listNeedPack||listDelivery||showDetail?{display:'none'}:{display:'block'}}>
                        <span style={{fontWeight:'600'}}>Lọc theo trạng thái: </span>
                        <select value={status} onChange={e=>setStatus(e.target.value)}>
                            <option value={''}>Tất cả</option>
                            {
                                statusOrder.map(sta=>{
                                    return <option key={sta._id} value={`status_order=${sta._id}`}>{sta.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <input type="text" value={search} placeholder="Nhập mã đơn hàng . . ." 
                        onChange={e=>setSearch(e.target.value.trim())} style={listNeedPack||listDelivery||showDetail?{display:'none'}:{display:'block'}}/>
                </div>

                <div className="container-ord-mana-ad" style={!listDelivery&&!showDetail&&!listNeedPack?{display:'block'}:{display:'none'}}>
                    <div className="option-select-all">
                        <select value={valueSelect} onChange={(e)=>{setValueSelect(e.target.value)}}>
                            <option value={'0'}>{CheckAll||checkBox?"Bỏ chọn":"Chọn"}</option>
                            <option value={'1'}>Chọn nhiều</option>
                            <option value={'2'}>Chọn tất cả</option>
                        </select>
                        <button onClick={deleteOrdChecked}>Xóa</button>

                        <span className="btn-search-ord-user">Lọc theo tài khoản: </span>
                        <span className="searchUserOrd">
                            <input type="text" value={valueSearchUser} placeholder="Nhập mã tài khoản"
                                onChange={e=>setValueSearchUser(e.target.value.trim())} style={listNeedPack||listDelivery||showDetail?{display:'none'}:{display:'block'}}/>
                        </span>
                    </div>
                    
                    <button className="btn-list-need-pack btn-list-delivery" onClick={()=>setListDelivery(true)}>Danh sách giao hàng</button>
                    <button className="btn-list-need-pack" onClick={()=>setListNeedPack(true)}>Danh sách đóng gói</button>

                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Tên người nhận</th>
                                <th>Tổng tiền</th>
                                <th>{status!=='status_order=632878dea2e7052bc439f979'?'Ngày đặt':'Ngày giao'}</th>
                                <th>Trạng thái</th>
                                <th className="setting-pro-mana-table">Tùy chỉnh</th>
                            </tr>
                            {
                                productPaginating.map((ord, index)=>{
                                    return <tr key={ord._id} className={newNotify===0?"row-table-ord-ad":(index+1)<=newNotify?"tickNewOrd row-table-ord-ad":"row-table-ord-ad"} 
                                                style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#FFF'}}>
                                        <td>
                                            <input type="checkbox" name="checkbox" id="check-delete-all" readOnly checked={ord.checked} value={ord._id} onClick={updateCheckOrd} style={checkBox||CheckAll?{display:'inline'}:{display:'none'}} />
                                            <span className="th-tablel-res-ord">STT: </span>{index+1}
                                        </td>
                                        <td><span className="th-tablel-res-ord">Mã đơn hàng: </span>{ord.order_id}</td>
                                        <td><span className="th-tablel-res-ord">Tên người nhận: </span>{ord.name_client}</td>
                                            {
                                                ord.total===0 ? <td><span className="th-tablel-res-ord">Tổng tiền: </span>{(ord.product.reduce((prev, item) =>{
                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)+30000).toLocaleString("en")}đ</td>
                                                :
                                                <td><span className="th-tablel-res-ord">Tổng tiền: </span>{ord.total.toLocaleString("en")}đ</td>
                                            }
                                        <td>
                                            <span className="th-tablel-res-ord">{status!=='status_order=632878dea2e7052bc439f979'?'Ngày đặt':'Ngày giao'}
                                            </span>{status!=='status_order=632878dea2e7052bc439f979'?ord.createdAt.slice(0,10):ord.delivered_date}
                                        </td>
                                        {
                                            statusOrder.map(sta=>{
                                                if(sta._id===ord.status_order){
                                                    return <td key={sta._id}><span className="th-tablel-res-ord">Tình trạng: </span>{sta.name}</td>
                                                }
                                            })
                                        }
                                        <td className="collum-table-mana-pro">
                                            <span className="btn-detail-order-ad" onClick={()=>DetailOrder(ord._id)}>Chi tiết</span>
                                            <span><img onClick={()=>handleUpdateOrder(ord._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                            <span><img onClick={()=>deleteOrder(ord._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <br/>
                    {productPaginating.length===0&&<p className="notify-not-found-pro-mana">Không tìm thấy kết quả</p>}
                    <LoadMoreOrders />
                </div>

                <div className="detail-order-mana-ad" style={showDetail?{display:'block'}:{display:'none'}}>
                    <div className="tt-and-btn-detail-upd-ad">
                        <div>
                            <h4>Thông tin chi tiết đơn hàng</h4>
                            {
                                orderAll.map(ord=>{
                                    if(idOrder===ord._id&&(ord.status_order==='63f2ef4cd97a1405d8775168'||ord.status_order==='6328789da2e7052bc439f977')){
                                        return <p key={ord._id}><i>Thời hạn giao: {ord.deliveryDate}</i></p>
                                    }
                                    else if(idOrder===ord._id&&ord.status_order==='632878d7a2e7052bc439f978'){
                                        return <p key={ord._id}><i>Thời hạn giao: {ord.deliveryDate}.</i></p>
                                    }
                                    else if(idOrder===ord._id&&ord.status_order==='632878dea2e7052bc439f979'){
                                        return <p key={ord._id}><i>Đơn hàng đã được giao.</i></p>
                                    }
                                    else if(idOrder===ord._id&&ord.status_order==='632878eca2e7052bc439f97a'){
                                        return <p key={ord._id}><i>Đơn hàng đã hủy.</i></p>
                                    }
                                })
                            }
                            
                        </div>
                        <div>
                            {
                                orderAll.map(ord=>{
                                    if(ord._id===idOrder&&ord.status_order==='63f2ef4cd97a1405d8775168'){
                                        return <span key={ord._id} onClick={()=>orderBrowsing(idOrder)} className="update-sta-ord-ad" 
                                            style={listNeedPack||listDelivery?{display:'none'}:{display:'inline'}}>Duyệt đơn hàng</span>
                                    }
                                })
                            }
                            
                            {
                                orderAll.map(ord=>{
                                    if((ord._id===idOrder&&ord.status_order==='63f2ef4cd97a1405d8775168')||(ord._id===idOrder&&ord.status_order==='6328789da2e7052bc439f977')){
                                        return <button key={ord._id} className="btn-export-stickers" onClick={Generate}
                                            style={listNeedPack||listDelivery?{display:'none'}:{display:'inline',marginLeft:'20px'}}>Xuất nhãn dán</button>
                                    }
                                })
                            }
                            <button onClick={BackToOrder} className="btn-back-to-ord btn-back-detail-ord-ad"
                                style={listNeedPack||listDelivery?{marginLeft:'40px'}:{marginLeft:'35px'}}>Trở về</button>
                        </div>
                    </div>
                    <hr></hr>
                    {
                        orderAll.map(myor =>{
                            if(idOrder===myor._id){
                            return  <div key={myor._id} className="detail-Order content-detail-ord-ad">
                                        <div className="inf-detail-ord-ad">
                                            <p>
                                                <span>Đơn hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.order_id}
                                            </p>
                                            <p>
                                                <span>Ngày đặt:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.createdAt.slice(0,10)}
                                            </p>
                                            <p>
                                                <span>Ngày giao hàng:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.delivered_date}
                                            </p>
                                            {
                                                statusOrder.map(el => {
                                                    if(myor.status_order===el._id){
                                                        return <p key={el._id}><span>Trạng thái: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            {el.name}</p>
                                                    }
                                                })
                                            }
                                            <p>
                                                <span>Người giao hàng:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.user_delivery}
                                            </p>

                                            <p><span>Tài khoản đặt hàng:</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                {
                                                    users.map(user=>{
                                                        if(user._id===myor.user_id){
                                                            return user.user_id
                                                        }
                                                    })
                                                }
                                            </p>

                                            <p>
                                                <span>Tên người nhận:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.name_client}
                                            </p>

                                            <p><span>Điện thoại:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.phone}
                                            </p>

                                            <p><span>Email: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {myor.email}
                                            </p>

                                            <p>
                                                <span>Địa chỉ nhận hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.address}
                                            </p>

                                            <p><span>Tạm tính: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {
                                                    (myor.product.reduce((prev, item) =>{
                                                        return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                    },0)).toLocaleString("en")
                                                }đ
                                            </p>

                                            {
                                                myor.total===0 ? '': 
                                                <p><span>Mã khuyến mãi: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {
                                                        ((myor.total - 30000)*100/(myor.product.reduce((prev, item) =>{
                                                            return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                        },0)))-100
                                                    }%
                                                    &nbsp;(áp dụng trên số tiền tạm tính)
                                                </p>
                                            }

                                            <p><span>Phí giao hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30,000đ</p>
                                            
                                            {
                                                myor.total===0 ? <p><span>Tổng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {(myor.product.reduce((prev, item) =>{
                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)+30000).toLocaleString("en")}đ &nbsp;(Đã bao gồm các hình thức khuyến mãi)</p>
                                                :
                                                <p><span>Tổng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {myor.total.toLocaleString("en")}đ &nbsp;(Đã bao gồm các hình thức khuyến mãi)
                                                </p>
                                            }

                                            <p><span>Ghi chú: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {myor.note}
                                            </p>
                                        </div>

                                        <div className="table-pro-detail-prrd-ad">
                                            <h5>Sản phẩm</h5>
                                            {myor.product.map(pro =>{
                                                return  <table key={pro._id}>
                                                            <tbody>
                                                                <tr>
                                                                    <td><img src={pro.imageMain}></img></td>
                                                                    <td><span className="th-table-respon-detai-ord-ad">STT: </span>{pro.product_id}</td>
                                                                    <td><span className="th-table-respon-detai-ord-ad">Tên sản phẩm: </span>{pro.title.slice(0,15)}...</td>
                                                                    <td>Màu: {pro.colorPro}</td>
                                                                    <td>Size: {pro.sizeCart}</td>
                                                                    <td><span className="th-table-respon-detai-ord-ad">Giá: </span>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")}đ</td>
                                                                    <td>SL: {pro.quantity}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                })
                                            }
                                        </div>
                                    </div>
                            }
                        })
                    }
                </div>

                <div className={showInputUpdate?"update-status-ord-ad":"close-update-status-ord-ad"}>
                    <div className="wrap-form-update-ord">
                        <h5>Cập nhật trạng thái đơn hàng</h5>
                        <span><span style={{fontWeight:'600'}}>Đơn hàng: </span>&nbsp;{id_Order}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <br/>
                        <select value={order.status_order} name="status_order" onChange={handelInputUpdate}>
                            <option>Chọn trạng thái</option>
                            {
                                statusOrder.map(sta=>{
                                    return <option key={sta._id} value={sta._id}>{sta.name}</option>
                                })
                            }
                        </select>
                        <span onClick={updateOrder} className="btn-update-status-ord">Cập nhật</span><br/>
                        <span onClick={closeUpdate} className="btn-close-update-sta-ord">Hủy</span>
                    </div>
                </div>

                <div className="container-ord-mana-ad list-need-pack-ordAd" style={listNeedPack&&!showDetail?{display:'block'}:{display:'none'}}>
                    <button className="btn-back-orders-listAll-ad btn-back-list-pick" onClick={()=>setListNeedPack(false)}>Trở về</button>
                    
                    <CSVLink className="btn-export-excel-ad" data={exportExcel} filename={`${updateDay}_danh_sach_dong_goi`} 
                        style={valueDay===''?{display:'none'}:{display:'block'}}>Xuất danh sách</CSVLink>
                    
                    <button className="btn-update-stt-delivering" onClick={updateDelivering} style={valueDay===''?{display:'none'}:{display:'block'}}>Giao hàng</button>
                    
                    <div className="fillter-day-update-list-pack">
                        <span>Ngày chốt đơn: </span>
                        <select value={valueDay} onChange={(e)=>setValeDay(e.target.value)}>
                            <option value={''}>{valueDay===''?"Chọn ngày":"Bỏ chọn"}</option>
                            {
                                dayFillter.map(day=>{
                                    return <option key={day} value={day}>{day}</option>
                                })
                            }
                        </select>
                        <span className="deadline-order-ad">
                            <span>Thời hạn giao hàng: </span>
                            <span>({deadlineOrd})</span>
                        </span>
                    </div>

                    <h5>Danh sách cần đóng gói:</h5>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Thông tin sản phẩm</th>
                                <th>Ghi chú</th>
                                <th></th>
                            </tr>
                            {
                                listPack.map((ord, index)=>{
                                    // if(ord.status_order==='6328789da2e7052bc439f977')
                                    return <tr key={ord._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#FFF'}}>
                                        <td>{index+1}</td>
                                        <td>{ord.order_id}</td>
                                        <td>
                                            {
                                                ord.product.map(pro=>{
                                                    return <div key={pro._id}>
                                                        <span>Mã: {pro.product_id}, &nbsp;&nbsp;</span>
                                                        <span>{pro.title}, &nbsp;&nbsp;</span>
                                                        <span>size: {pro.sizeCart}, &nbsp;&nbsp;</span>
                                                        <span>màu: {pro.colorPro}, &nbsp;&nbsp;</span>
                                                        <span>SL: x{pro.quantity}</span>
                                                    </div>
                                                })
                                            }
                                        </td>
                                        <td>{}</td>
                                        <td>
                                            {<span className="btn-detail-order-ad" onClick={()=>DetailOrder(ord._id)}>Chi tiết</span>}
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {listPack.length===0 ?<h3 className="list-need-pack-empty">Chọn ngày chốt đơn để xem danh sách!</h3>:''}
                </div>

                <div className="container-ord-mana-ad list-need-pack-ordAd" style={listDelivery&&!showDetail?{display:'block'}:{display:'none'}}>
                    <button className="btn-back-orders-listAll-ad btn-back-list-delivery-res" onClick={()=>setListDelivery(false)} style={btn_back?{display:'none'}:{display:'block'}}>Trở về</button>

                    <h5>Danh sách đơn hàng cần giao:</h5>
                    <table>
                        <tbody>
                            <tr>
                                <th className="th-list-delivery-res">STT</th>
                                <th className="th-list-delivery-res">Mã đơn hàng</th>
                                <th className="th-list-delivery-res">Địa chỉ</th>
                                <th className="th-list-delivery-res">Người nhận</th>
                                <th className="th-list-delivery-res">SĐT</th>
                                <th className="th-list-delivery-res">Tổng tiền</th>
                                <th className="th-list-delivery-res"></th>
                            </tr>
                            {
                                dataDelivery.map((del, index)=>{
                                    return <tr key={del._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#FFF'}}>
                                        <td className="options-list-delivery"><span className="th-table-respon-deli">STT: </span>{index+1}</td>
                                        <td className="options-list-delivery"><span className="th-table-respon-deli">Mã đơn hàng: </span>{del.order_id}</td>
                                        <td className="col-address-list-deli options-list-delivery"><p className="address-list-delivering"><span className="th-table-respon-deli">Địa chỉ: </span>{del.address}</p></td>
                                        <td className="options-list-delivery"><span className="th-table-respon-deli">Người nhận: </span>{del.name_client}</td>
                                        <td className="options-list-delivery"><span className="th-table-respon-deli">Số điện thoại: </span>{del.phone}</td>
                                        <td className="options-list-delivery">
                                            <span className="th-table-respon-deli">Tổng tiền: </span>
                                            {
                                                del.total===0?
                                                (del.product.reduce((prev, item) =>{
                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)+30000).toLocaleString("en")
                                                : del.total.toLocaleString("en")
                                            }
                                            <u>đ</u>
                                        </td>
                                        <td className="options-list-delivery">
                                            <span className="btn-detail-order-ad" onClick={()=>DetailOrder(del._id)}>Chi tiết</span>
                                            <span onClick={()=>updateDelivered(del._id)} className="update-sta-ord-ad btn-update-list-delivery">Đã giao hàng</span>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        }
    </>
  )
}
