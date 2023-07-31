import React, {useContext, useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productitem/Productitem'
import DiscountItem from '../discount/DiscountProduct'
import Loading from '../utils/loading/Loading'
import Filters from './Filters'
import LoadMore from './LoadMore'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import CircleRight from '../../header/icon/circle-right.svg'
import Dollar from '../../header/icon/dollar.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'
import axios from 'axios'
import Pre from '../../header/icon/previous.svg'
import 'aos/dist/aos.css'
import Menu from '../../header/icon/menu.svg'
import Close from'../../header/icon/close.svg'


export default function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [categories] = state.categoriesAPI.categories
    const [objectCate] = state.categoriesAPI.objectCategory
    const [category, setCategory] = state.productsAPI.category
    const [result] = state.productsAPI.result
    const [page, setPage] = state.productsAPI.page
    const [callback, setCallback] = state.productsAPI.callback
    const [discounts, setDiscount] = useState([])
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [productPaginating, setProductPaginating] = useState([])
    const [checkPage, setCheckPage] = useState(false)
    const [showCateHover, setShowCateHover] = useState(false)
    const [valueCate, setValueCate] = useState('')

    const [pagePrice, setPagePrice] = useState(1)
    const [numberNextSpace, setNumberNextSpace] = useState(0)   // cách trang hiện tại 2 đơn vị (vd: hiện tại = 1, nextSpace = 3)
    const [midNum, setMidNum] = useState([])
    const [reSultAll] = state.productsAPI.resultAll

    const [lt100, setLt100] = useState(false)
    const [fr100to199, setFr100to199] = useState(false)
    const [fr200to500, setFr200to500] = useState(false)
    const [gt500, setGt500] = useState(false)
    const [refreshPaginating, setRefreshPaginating] = useState(false)
    const [titleHeadPrice, setTitleHeadPrice] = useState('Tất cả giá')

    const [showTabBar, setShowTabBar] = useState(false)

    
    // xử lý đưa các sản phẩm khuyến mãi vào mảng discount
    useEffect(() =>{
        const disC = productPaginating.filter((pro) =>{
            return (pro.discount>0)
        })
        setDiscount(disC)
    }, [products, productPaginating])

    // truyền id của category về db để get ra sản phẩm cùng loại
    const handleCategory = id =>{
        setCategory(id)
        setPage(1)
        setCheckPage(false)
        setPagePrice(1)
        setMidNum([])
        setCallback(!callback)
        setTitleHeadPrice('Tất cả giá')
        setShowCateHover(false)
        scroll()
        setShowTabBar(false)
    }

    // show sản phẩm của tất cả thể loại
    const displayAllPro = () => {
        setCallback(!callback)
        setCategory('')
        setPage(1)
        setPagePrice(1)
        setCheckPage(false)
        setMidNum([])
        setTitleHeadPrice('Tất cả giá')
        setShowTabBar(false)
    }

    // xử lý click lọc theo giá sản phẩm
    const allPrice = () =>{
        setCallback(!callback)
        setCheckPage(false)
        setPagePrice(1)
        setMidNum([])
        setTitleHeadPrice('Tất cả giá')
        scroll()
        setShowTabBar(false)
    }

    const less100 = async (value) =>{
        try {
            setLt100(true)
            setFr100to199(false)
            setFr200to500(false)
            setGt500(false)
            setRefreshPaginating(true)
            setTitleHeadPrice(value)
            scroll()
            setShowTabBar(false)

            const res = await axios.get(`/api/priceLT100000?limit=${pagePrice*9}&${category}`)
            setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            setCheckPage(true)   // check ẩn hiện phân trang (true === ẩn)
            setPage(1)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const from_100_to_199 = async (value) =>{    
        try {
            setLt100(false)
            setFr100to199(true)
            setFr200to500(false)
            setGt500(false)
            setRefreshPaginating(true)
            setTitleHeadPrice(value)
            scroll()
            setShowTabBar(false)

            const res = await axios.get(`/api/price_IN100_IN199?limit=${pagePrice*9}&${category}`)
            setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            setCheckPage(true)
            setPage(1)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const from_200_to_500 = async (value) =>{
        try {
            setLt100(false)
            setFr100to199(false)
            setFr200to500(true)
            setGt500(false)
            setRefreshPaginating(true)
            setTitleHeadPrice(value)
            scroll()
            setShowTabBar(false)
            
            const res = await axios.get(`/api/priceL_IN200_IN500?limit=${pagePrice*9}&${category}`)
            setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            setCheckPage(true)
            setPage(1)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const bigger500 = async (value) =>{
        try {
            setLt100(false)
            setFr100to199(false)
            setFr200to500(false)
            setGt500(true)
            setRefreshPaginating(true)
            setTitleHeadPrice(value)
            scroll()
            setShowTabBar(false)

            const res = await axios.get(`/api/priceGT500?limit=${pagePrice*9}&${category}`)
            setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            setCheckPage(true)
            setPage(1)

        } catch (err) {
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
        products.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*9){
                a.push(el)
                scroll()
            }
        })
        setProductPaginating(a)
    },[products, page])

    // nút lùi trang
    const handlePre = (value) =>{
        if (pagePrice===1){
            setPagePrice(pagePrice)
        } 
        else {
            setPagePrice(pagePrice-1);
            setNumberNextSpace((value-1)+1)
            midNum.pop()
        }
    }

    // nút next trang
    const handleNext = (valuePage) =>{
        var check = false
        if(reSultAll/9<=pagePrice){
            setPagePrice(pagePrice)
            setNumberNextSpace(false)
            check=true
        }
        else {
            setPagePrice(pagePrice+1)
            setNumberNextSpace(valuePage+1)
        }

        if(reSultAll/9<=valuePage){
            setNumberNextSpace(false)
        }

        var a=[]
        for(let i=1; i<=valuePage; i++){
            if(i<=valuePage&&i>1){
                a.push(i)
            }
        }
        if(check===true){
            a.pop()
        }
        setMidNum(a)
    }

    // xử lý click vào số trang
    const handleLoadNumber = (value) =>{
        var check = false
        if(value!==1){
            setPagePrice(value)
            setNumberNextSpace(0)
            if(reSultAll/9<=value-1){
                setNumberNextSpace(false)
                check=true
            }
        }
        else {
            setPagePrice(1)
            setNumberNextSpace(0)
        }

        if(reSultAll/9<=value){
            setNumberNextSpace(false)
        }

        var a=[]
        for(let i=1; i<=value; i++){
            if(i<=value&&i>1){
                a.push(i)
            }
        }
        
        if(check===true){
            a.pop()
        }
        setMidNum(a)
    }

    // xử lý phân trang theo API lọc theo giá
    useEffect(()=>{
        const getData = async ()=>{
            if(lt100){
                const res = await axios.get(`/api/priceLT100000?limit=${pagePrice*9}&${category}`)
                setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            }
            else if(fr100to199){
                const res = await axios.get(`/api/price_IN100_IN199?limit=${pagePrice*9}&${category}`)
                setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            }
            else if(fr200to500){
                const res = await axios.get(`/api/priceL_IN200_IN500?limit=${pagePrice*9}&${category}`)
                setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            }
            else if(gt500){
                const res = await axios.get(`/api/priceGT500?limit=${pagePrice*9}&${category}`)
                setProductPaginating(res.data.proPrice.slice((pagePrice*9)-9))
            }
            scroll()
        }
        getData()
    },[pagePrice])

    // xử lý set phân trang về trang 1 khi chuyển giá trị lọc (lọc theo giá)
    useEffect(()=>{
        const refresh = ()=>{
            if(refreshPaginating){
                setPagePrice(1)
                setMidNum([])
            }
            setRefreshPaginating(false)
        }
        refresh()
    },[refreshPaginating])

    // xử lý show menu category
    const hoverCategory = (value)=>{
        setValueCate(value)
        setShowCateHover(true)
    }

    // bở hover khỏi menu category
    const outHover = ()=>{
        setShowCateHover(false)
    }

    return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="container-pro">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Danh mục sản phẩm</span>
            </div>

            <div className="wrap-list-category">
                <div className="list-category" style={showTabBar?{left:'0'}:{}}>
                    <img src={Close} alt='' className="icon-close-menu-pro" onClick={()=>setShowTabBar(false)} style={!showTabBar?{display:'none'}:{}} />
                    <div className="list-category-item" data-aos="fade-right" data-aos-duration="1000" data-aos-once="true"> 
                        <h3>DANH MỤC SẢN PHẨM</h3>
                        <ul className="list-row">
                            <li className="all" onClick={displayAllPro}><img src={CircleRight} alt=''></img>Tất cả</li>
                            {
                                objectCate.map(obj =>(
                                    <li key={obj._id} onMouseMove={()=>hoverCategory(obj._id)} onMouseLeave={outHover}>
                                        <img src={CircleRight} alt=''></img>
                                        {obj.name}
                                        <ul className="list-category-hover" style={valueCate===obj._id&&showCateHover?{display:'block'}:{display:'none'}}>
                                            {
                                                categories.map(category =>{
                                                    if(category.object===obj._id){
                                                        return <li key={category._id} onClick={()=>handleCategory('category='+category._id)}>
                                                                    <img src={CircleRight} alt=''></img>
                                                                    {category.name}
                                                                </li>
                                                    }
                                                    
                                                })
                                            }
                                        </ul>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="list-price-item" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
                        <h3>LỌC THEO GIÁ</h3>
                        <ul className="list-row">
                            <li onClick={()=>allPrice('Tất cả giá')}><img src={Dollar} alt=''></img>Tất cả</li>
                            <li onClick={()=>less100('Giá dưới 100,000đ')}><img src={Dollar} alt=''></img>Dưới 100,000đ</li>
                            <li onClick={()=>from_100_to_199('Giá: 100,000đ - 199,000đ')}><img src={Dollar} alt=''></img>100,000đ - 199,000đ</li>
                            <li onClick={()=>from_200_to_500('Giá: 200,000đ - 500,000đ')}><img src={Dollar} alt=''></img>200,000đ - 500,000đ</li>
                            <li onClick={()=>bigger500('Giá trên 500,000đ')}><img src={Dollar} alt=''></img>Trên 500,000đ</li>
                        </ul>
                    </div>

                    <div className="list-discount-item" data-aos="fade-right" data-aos-duration="1000" data-aos-once="true">
                        <h3>ĐANG KHUYẾN MÃI</h3>
                        {
                            discounts.map((pro, index) =>{
                                if(index<=2){
                                    return <DiscountItem key={pro._id} pro={pro} />
                                }
                            })
                        }
                    </div>

                </div>

                <div className="pro-card">
                    <div className="head-list-pro">
                        {
                            category==='' ?
                            <span className="title-category">
                                <img src={Menu} alt='' className="icon-img-menu-pro-page" onClick={()=>setShowTabBar(!showTabBar)}/>
                                Tất cả sản phẩm <span> / {titleHeadPrice}</span>
                            </span>
                            :
                            categories.map(cate=>{
                                if(cate._id===category.slice(9)){
                                    return <span key={cate._id} className="title-category">
                                                <img src={Menu} alt='' className="icon-img-menu-pro-page" onClick={()=>setShowTabBar(!showTabBar)}/>
                                                {cate.name}
                                                <span> / {titleHeadPrice}</span>
                                            </span>
                                }
                            })
                        }
                        <Filters />
                    </div>

                    <div className="line"></div>

                    <div className='products'>
                        {
                            productPaginating.map(product =>{
                                return <ProductItem key={product._id} product={product}/>
                            })
                        }
                    </div>
                    
                    {(productPaginating.length === 0 || products === 0) && <p className="notify-not-found">Không tìm thấy kết quả</p>}
                    <div style={checkPage?{display:'none'}:{display:'block'}}>
                        <LoadMore />
                    </div>

                    <div className="load_more" style={!checkPage?{display:'none'}:{display:'block'}}>
                        <span className="btn-number-load" onClick={()=>handlePre(pagePrice)}><img src={Pre} alt=''></img></span>
                        <span className="btn-number-load" onClick={()=>handleLoadNumber(1)} style={pagePrice===1?{color:'#fff', backgroundColor:'#999'}:{color:'#000', backgroundColor:'#fff'}}>1</span>
                        {
                            midNum.map((num)=>{
                                return <span key={num} className="btn-number-load" onClick={()=>handleLoadNumber(num)} 
                                style={num===midNum[midNum.length-1]?{color:'#fff', backgroundColor:'#999'}:{color:'#000', backgroundColor:'#fff'}}>{num}</span>
                            })
                        }
                        {
                            numberNextSpace===false?'':<span className="btn-number-load" onClick={()=>handleLoadNumber(numberNextSpace===0?pagePrice+1:numberNextSpace)}>
                                {numberNextSpace===0?pagePrice+1:numberNextSpace}</span>
                        }
                        <span className="btn-number-load" onClick={()=>handleNext(pagePrice+1)}><img src={Next} alt=''></img></span>
                    </div>

                    <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
                        <img src={UpHeadPage} alt="" width="15" />
                    </Link>
                </div>
            </div>
        </div>
    </>
    )
}