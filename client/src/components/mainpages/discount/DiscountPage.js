import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Productitem from '../utils/productitem/Productitem'
import LoadMoreDiscountPro from './LoadMoreDiscountPro'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'
import CircleRight from '../../header/icon/circle-right.svg'
import Menu from '../../header/icon/menu.svg'
import 'aos/dist/aos.css'

export default function DiscountPage() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [objectCate] = state.categoriesAPI.objectCategory
    const [category, setCategory] = state.productsAPI.category
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [showCateHover, setShowCateHover] = useState(false)
    const [valueCate, setValueCate] = useState('')

    const [productPaginating] = state.productsAPI.discountProducts
    const [page, setPage] = state.productsAPI.pageDis
    const [result] = state.productsAPI.resultDiscountPro
    const [listProDis, setlistProDis] = useState([])
    const [titleCategory, setTitleCategory] = useState('')

    const [showMenuProDisc, setShowMenuProDisc] = useState(false)

    // show sản phẩm của tất cả thể loại
    const displayAllPro = () => {
        setCategory('')
        setTitleCategory('')
        setPage(1)
        setShowMenuProDisc(false)
    }

    // truyền id của category về db để get ra sản phẩm cùng loại
    const handleCategory = id =>{
        setCategory(id)
        setTitleCategory(id.slice(9))
        setPage(1)
        setShowCateHover(false)
        setShowMenuProDisc(false)
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

    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        productPaginating.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*8){
                a.push(el)
                scroll()
            }
        })
        setlistProDis(a)
    },[productPaginating, page])

    // xử lý show menu category
    const hoverCategory = (value)=>{
        setValueCate(value)
        setShowCateHover(true)
    }

    // bỏ hover khỏi list category
    const outHover = ()=>{
        setShowCateHover(false)
    }

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    useEffect(()=>{
        scroll()
    },[])

return (
    <>
    {
        header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
    }
    <div className="container-discountpage">
        <div>
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Khuyến mãi</span>
                <img src={Next} alt='' style={titleCategory===''?{display:'none'}:{display:'inline-block'}}></img>
                {
                    categories.map(category=>{
                        if(titleCategory===category._id){
                            return <span className="crumb-name" key={category._id}>{category.name}</span>
                        }
                    })
                }
            </div>

            <div className="list-cate-page-disc">
                <h3 data-aos="slide-down" data-aos-duration="500" data-aos-once="true">
                    <img src={Menu} alt='' className="icon-img-menu-pro-page icon-img-menu-disc" onClick={()=>setShowMenuProDisc(!showMenuProDisc)} />
                    DANH MỤC KHUYẾN MÃI
                </h3>
                <ul className="row-list-disc-page" data-aos="flip-down" data-aos-duration="1100" data-aos-once="true"
                    style={showMenuProDisc?{left:'0'}:{}}>
                    <li className="all item-cate-disc-page" onClick={displayAllPro}>Tất cả</li>
                    {
                        objectCate.map(obj =>(
                            <li className="item-cate-disc-page" key={obj._id} onMouseMove={()=>hoverCategory(obj._id)} onMouseLeave={outHover}>
                                {obj.name}
                                <ul className="ul-discount-page" style={valueCate===obj._id&&showCateHover?{display:'block'}:{display:'none'}}>
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
        </div>

        <div className="wrap-card-pro-disc">
            <div className="card-pro-discountPage">
                {
                    listProDis.map(pro =>{
                        return <Productitem key={pro._id} product={pro} />
                    })
                }
                {listProDis.length === 0 && <p className="notify-not-found-disc">Không tìm thấy kết quả</p>}
            </div>

            <LoadMoreDiscountPro />

        </div>

        <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
            <img src={UpHeadPage} alt="" width="15" />
        </Link>
    </div>
    </>
  )
}
