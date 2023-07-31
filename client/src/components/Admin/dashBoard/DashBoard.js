import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Turnover from '../../header/icon/money.svg'
import Order from '../../header/icon/order.svg'
import Product from '../../header/icon/product.svg'
import User from '../../header/icon/user-solid.svg'
import Bg from '../../header/icon/bg-dashboard.jpg'

export default function DashBoard() {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [orders] = state.orderAPI.orderAll
    const [productAll] = state.productsAPI.productAll
    const [categories] = state.categoriesAPI.categories
    const [users] = state.userAPI.users
    const [totalTurnover, setTotalTurnover] = useState(0)
    const [ordProcessing, setOrdProcessing] = useState(0)
    const [ordDelivering, setOrdDelivering] = useState(0)
    const [ordDelivered, setDelivered] = useState(0)
    const [ordAwait, setOrdAwait] = useState(0)
    const [ordCancel, setOrdCancel] = useState(0)
    const [amountPro, setAmountPro] = useState(0)
    const [amountUser, setAmountUser] = useState(0)
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    const [amountTurnoverdMonth, setAmountTurnoverMonth] = useState(0)
    const [amountTurnoverdMonth_1, setAmountTurnoverMonth_1] = useState(0)
    const [amountTurnoverdMonth_2, setAmountTurnoverMonth_2] = useState(0)
    const [amountTurnoverdMonth_3, setAmountTurnoverMonth_3] = useState(0)

    const [cateCircle, setCateCircle] = useState([])

    // xử lý lý các thông tin thống kê ở dashboard
    useEffect(()=>{
        // tổng doanh thu tất cả các đơn hàng đã giao (đã bán)
        const turnover =()=>{
            var t=[]; var d=0; var c=0; var b=0; var a=0; var e=0; var f=0
            orders.forEach(el=>{
                if(el.status_order==="632878dea2e7052bc439f979"){
                    c++
                    if(el.total===0){
                        el.product.forEach(i=>{
                            t.push(((i.price/100)*(100-i.discount))*(i.quantity))
                        })
                    }
                    else {
                        d++
                        t.push(el.total)
                    }
                }
                else if (el.status_order==="6328789da2e7052bc439f977"){
                    a++
                }
                else if (el.status_order==="632878eca2e7052bc439f97a"){
                    e++
                }
                else if (el.status_order==="632878d7a2e7052bc439f978"){
                    b++
                }
                else if (el.status_order==="63f2ef4cd97a1405d8775168"){
                    f++
                }
            })
            setTotalTurnover(t.reduce((pre, item)=>{    // tổng doanh thu (đơn hàng đã giao)
                return pre + item
            },0)+((c*30000)-(d*30000)))

            setDelivered(c)  // số đơn hàng đã giao
            setOrdDelivering(b)   //số đơn hàng đang giao
            setOrdAwait(a)   // số đơn hàng chờ giao
            setOrdCancel(e)  // số đơn hàng đã hủy
            setOrdProcessing(f) // số đơn hàng đang xử lý
        }
        turnover()

        // xử lý số lượng tổng sản phẩm trong db
        const product = ()=>{
            var f=0
            productAll.forEach(el=>{
                f++
            })
            setAmountPro(f)
        }
        product()

        // xử lý tổng user trong db
        const user = ()=>{
            var k=0
            users.forEach(el=>{
                if(el.role===0){
                    k++
                }
            })
            setAmountUser(k)
        }
        user()

        // lấy tháng và năm hiện tại
        const date = ()=>{
            var today = new Date();
            var month = today.getMonth()+1
            var y = today.getFullYear()
            setMonth(month)
            setYear(y)
        }
        date()

        // doanh thu của tháng hiện tại
        const amountTurnoverMonth = ()=>{
            var a=0; var b=[]; var c=0; var d=0; var e
            if((month)<10){
                d = '0' + (month)
                e = year
            }
            else {
                d = month
                e = year
            }
            orders.forEach(el=>{
                if((el.createdAt.slice(0,4))===e.toString() && (el.createdAt.slice(5,7))===d.toString()&&el.status_order==="632878dea2e7052bc439f979"){
                    a++
                    if(el.total===0){
                        el.product.forEach(i=>{
                            b.push(((i.price/100)*(100-i.discount))*(i.quantity))
                        })
                    }
                    else {
                        c++
                        b.push(el.total)
                    }
                }
            })
            setAmountTurnoverMonth(b.reduce((p, i)=>{
                return p+i
            },0)+(a*30000)-(c*30000))
        }
        amountTurnoverMonth()

        // doanh thu của tháng (hiện tại -1)
        const amountTurnoverMonth1 = ()=>{
            var a=0; var b=[]; var c=0; var d=0; var e
            if((month===1?12:month-1)<10){
                d = '0' + (month===1?12:month-1)
                e = month===1?year-1:year
            }
            else {
                d = month===1?12:month-1
                e = month===1?year-1:year
            }
            orders.forEach(el=>{
                if((el.createdAt.slice(0,4))===e.toString() && (el.createdAt.slice(5,7))===d.toString()&&el.status_order==="632878dea2e7052bc439f979"){
                    a++
                    if(el.total===0){
                        el.product.forEach(i=>{
                            b.push(((i.price/100)*(100-i.discount))*(i.quantity))
                        })
                    }
                    else {
                        c++
                        b.push(el.total)
                    }
                }
            })
            setAmountTurnoverMonth_1(b.reduce((p, i)=>{
                return p+i
            },0)+(a*30000)-(c*30000))
        }
        amountTurnoverMonth1()

        // doanh thu của tháng (hiện tại -2)
        const amountTurnoverMonth2 = ()=>{
            var a=0; var b=[]; var c=0; var d=0; var e
            if((month===1?11:month===2?12:month===3?1:month-2)<10){
                d = '0' + (month===1?11:month===2?12:month===3?1:month-2)
                e = month===1?year-1:month===2?year-1:year
            }
            else {
                d = month===1?11:month===2?12:month===3?1:month-2
                e = month===1?year-1:month===2?year-1:year
            }
            orders.forEach(el=>{
                if((el.createdAt.slice(0,4))===e.toString() && (el.createdAt.slice(5,7))===d.toString()&&el.status_order==="632878dea2e7052bc439f979"){
                    a++
                    if(el.total===0){
                        el.product.forEach(i=>{
                            b.push(((i.price/100)*(100-i.discount))*(i.quantity))
                        })
                    }
                    else {
                        c++
                        b.push(el.total)
                    }
                }
            })
            setAmountTurnoverMonth_2(b.reduce((p, i)=>{
                return p+i
            },0)+(a*30000)-(c*30000))
        }
        amountTurnoverMonth2()

        // doanh thu của tháng (hiện tại -3)
        const amountTurnoverMonth3 = ()=>{
            var a=0; var b=[]; var c=0; var d=0 ; var e
            if((month===1?10:month===2?11:month===3?12:month-3)<10){
                d = '0' + (month===1?10:month===2?11:month===3?12:month-3)
                e = month===1?year-1:month===2?year-1:month===3?year-1:year
            }
            else {
                d = month===1?10:month===2?11:month===3?12:month-3
                e = month===1?year-1:month===2?year-1:month===3?year-1:year
            }
            orders.forEach(el=>{
                if((el.createdAt.slice(0,4))===e.toString() && (el.createdAt.slice(5,7))===d.toString() && el.status_order==="632878dea2e7052bc439f979"){
                    a++
                    if(el.total===0){
                        el.product.forEach(i=>{
                            b.push(((i.price/100)*(100-i.discount))*(i.quantity))
                        })
                    }
                    else {
                        c++
                        b.push(el.total)
                    }
                }
            })
            setAmountTurnoverMonth_3(b.reduce((p, i)=>{
                return p+i
            },0)+(a*30000)-(c*30000))
        }
        amountTurnoverMonth3()
    })

    // sơ đồ doanh thu theo tháng (cột)
    const options = {
        chart: {
            backgroundColor: '#fff',
            polar: true,
            type: 'column'
         },
        title: {
            text: 'Sơ đồ thống kê doanh thu theo tháng (4 tháng gần nhất)'
        },
        subtitle: {
            text: 'Dựa trên đơn hàng đã giao cho khách',
            floating: true,
            fontSize: '18px',
            y: 33
        },
        xAxis: {
            crosshair: true,
            labels: {
                style: {
                    fontSize: '18px',
                    color: '#000'
                }
            },
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Số Tiền',
                style: {
                    fontSize: '18px',
                    color: '#000'
                }
            }
        },
        tooltip: {
            valueSuffix: ' VNĐ'
        },
        series: [{
            name: 'Tổng ',
            //colorByPoint: true,
            data: [
                ['Thg '+ (month===1?10:month===2?11:month===3?12:month-3).toString()+'/'+(month===1?year-1:month===2?year-1:month===3?year-1:year).toString(), amountTurnoverdMonth_3],
                ['Thg '+ (month===1?11:month===2?12:month===3?1:month-2).toString()+'/'+(month===1?year-1:month===2?year-1:year).toString(), amountTurnoverdMonth_2],
                ['Thg '+ (month===1?12:month-1).toString()+'/'+(month===1?year-1:year).toString(), amountTurnoverdMonth_1],
                ['Thg '+ month.toString()+'/'+year.toString(), amountTurnoverdMonth]
            ],
            showInLegend: false,
            marker: {
                radius: 7
            },
            color: '#FFCC66',
            
        }]
    }

    // sơ đồ thể loại sản phẩm (tròn)
    const optionsCircle = {
        chart: {
            backgroundColor: '#fff',
            polar: true,
            type: 'pie'
        },
        title: {
            text: 'Sơ đồ thống kê thể loại sản phẩm'
        },
        xAxis: {
            crosshair: true,
            labels: {
                style: {
                    fontSize: '18px',
                    color: '#000'
                }
            },
            type: 'category'
        },
        yAxis: {
            min: 0
        },
        tooltip: {
            valueSuffix: ' sản phẩm'
        },
        series: [{
            name: 'Tổng ',
            colorByPoint: true,
            data: cateCircle,
            showInLegend: false
        }]
    }

    // lấy dữ liệu sơ đồ tròn (thể loại)
    useEffect(()=>{
        // số lượng sản phẩm thuộc thể loại sơ đồ tròn
        const amountProInCate = ()=>{
            var a=[], b=[], c=[]

            productAll.forEach(el=>{
                a.push(el.category)
            })

            const map = a.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
            b = ([...map.entries()])

            b.forEach(el=>{
                categories.forEach(i=>{
                    if(el[0]===i._id)
                    c.push([i.name, el[1]])
                })
            })
            setCateCircle(c)
        }
        amountProInCate()
    },[categories, productAll])

return (
    <>
        {
            !isAdmin ? 
            <div className="wrap-dashboard-ad bg-not-admin">
                <img src={Bg} alt='' />
            </div>
            :
            <div className="wrap-dashboard-ad">
                <div className="title-line-create-pro-ad tt-line-mana-disc">
                    <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">THỐNG KÊ CHUNG</div>
                </div>

                <div className="container-dashboard-ad">
                    <div className="report-all-ad">
                        <div className="item-report-all-ad">
                            <div className="inf-turnover-db-ad">
                                <p>Tổng cộng</p>
                                <p>{totalTurnover.toLocaleString("en")} <u>đ</u></p>
                            </div>
                            <div className="icon-turnover-db-ad">
                                <p>Doanh thu</p>
                                <img className="img-icon-dashboard" src={Turnover} alt=''></img>
                            </div>
                        </div>

                        <div className="item-report-all-ad">
                            <div className="inf-order-db-ad">
                                <p><span>Đang xử lý: </span>{ordProcessing}</p>
                                <p><span>Chờ giao: </span>{ordAwait}</p>
                                <p><span>Đang giao: </span>{ordDelivering}</p>
                                <p><span>Đã giao: </span>{ordDelivered}</p>
                                <p><span>Đã Hủy: </span>{ordCancel}</p>
                            </div>
                            <div className="icon-order-db-ad">
                                <p>Đơn hàng</p>
                                <img className="img-icon-dashboard" src={Order} alt=''></img>
                            </div>
                        </div>

                        <div className="item-report-all-ad">
                            <div className="inf-pro-db-ad">
                                <p>Số lượng</p>
                                <p>{amountPro}</p>
                            </div>
                            <div className="icon-pro-db-ad">
                                <p>Sản phẩm</p>
                                <img className="img-icon-dashboard" src={Product} alt=''></img>
                            </div>
                        </div>

                        <div className="item-report-all-ad">
                            <div className="inf-user-db-ad">
                                <p>Số lượng</p>
                                <p>{amountUser}</p>
                            </div>
                            <div className="icon-user-db-ad">
                                <p>Khách hàng</p>
                                <img className="img-icon-dashboard" src={User} alt=''></img>
                            </div>
                        </div>
                    </div>

                    <div className="wrap-chart">
                        <div className="chart">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                            />
                        </div>
                        <div className="chartCircle">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={optionsCircle}
                            />
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
  )
}
