import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Aos from 'aos'
import 'aos/dist/aos.css'
import ProductItem from '../utils/productitem/Productitem'
import HeaderFixed from '../../header/HeaderFixed'
import UpHeadPage from '../../header/icon/up.svg'
import Next from '../../header/icon/next.svg'
import Prev from '../../header/icon/previous.svg'
// import BgDisc from '../../header/icon/bg-disc.jpg'
import BgDisc from '../../header/icon/bg-disc-2.jpg'
import lockUser from '../../header/icon/user-lock.svg'
import Check from '../../header/icon/news.svg'
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';

export default function HomePage() {
    const state = useContext(GlobalState)
    const [productsAll] = state.productsAPI.productAll
    const [products] = state.productsAPI.products
    const [categories] = state.categoriesAPI.categories
    const [discounts, setDiscount] = useState([])
    const [isLogged] = state.userAPI.isLogged
    const [userDissable] = state.userAPI.dissable
    const [dissablee, setDissable] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [OnOffSlide, setOnOffSlide] = useState(0)
    const [OnOffDisc, setOnOffDisc] =useState(0)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [nextCate, setNextCate] = useState(0)
    const [prevCate, setPrevCate] = useState(0)
    const [checkNextPrev, setCheckNextPre] = useState(false)
    const [category, setCategory] = state.productsAPI.category
    const [NewAnDiscPro, setNewAnDiscPro] = useState(false)
    const [idCategory1, setIdCategory1] = useState('')
    const [idCategory2, setIdCategory2] = useState('')
    const [news] = state.newsAPI.newsAll
    const [createdAt, setCreatedAt] = useState('')
    const [ctrlSlideNews, setCtrlSlideNews] = useState(0)
    const [auto, setAuto] = useState(false)
    const [productBuyMany] = state.productsAPI.productBuyMany
    const [slide1, setSlide1] = useState('')
    const [slide2, setSlide2] = useState('')
    const [slide3, setSlide3] = useState('')

    // xử lý carousel
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const items = [
        {
            id:'1',
            src: (slide1.url),
            altText: '',
            caption: ''
        },
        {
            id:'2',
            src: (slide2.url),
            altText: '',
            caption: ''
        },
        {
            id:'3',
            src: (slide3.url),   
            altText: '',
            caption: ''
        }
    ]

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
        <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.id}
        >
            <img src={item.src} alt={item.altText} />
            <CarouselCaption captionText={item.caption} captionHeader={item.altText} />
        </CarouselItem>
        );
    });

    //get dữ liệu image slide
    useEffect(()=>{
        var data = JSON.stringify([...notify])
        data = JSON.parse(data)
        data.forEach(el=>{
            if(el._id==='635cd52464f5b7334c594007'){
                setSlide1(el.imagesSlide1)
                setSlide2(el.imagesSlide2)
                setSlide3(el.imagesSlide3)
            }
        })
    },[notify])

    // đưa sản phẩm khuyến mãi từ products vào mảng discount
    useEffect(() =>{
        const handle = ()=>{
            const disC = (productsAll || []).filter((pro) =>{
                return (pro.discount>0)
            })
            setDiscount(disC)
        }
        handle()
    }, [productsAll])

    // xử lý ẩn hiện nút back to top khi cuộn chuột và header fixed
    // check tại khoản bị khóa khi đăng nhập
    // lấy dữ liệu slide trong db notify
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

        const dissableUser = ()=>{
            if(isLogged&&userDissable===true){
                setDissable(true)
            }
            else {
                setDissable(false)
            }
        }
        dissableUser()

        const getData = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setOnOffSlide(el.slide)
                    setOnOffDisc(el.discount)
                    setIdCategory1(el.idCategory1)
                    setIdCategory2(el.idCategory2)
                }
            })
        }
        getData()
    })

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // hiệu ứng scroll
    useEffect(()=>{
        scroll()
        Aos.init({duration: 1000, once: false})
    },[OnOffSlide])

    /* check tại khoản bị khóa khi đăng nhập
    // lấy dữ liệu slide trong db notify
    // useEffect(()=>{
    //     const dissableUser = ()=>{
    //         if(isLogged&&userDissable===true){
    //             setDissable(true)
    //         }
    //         else {
    //             setDissable(false)
    //         }
    //     }
    //     dissableUser()

    //     const getData = ()=>{
    //         notify.forEach(el=>{
    //             if(el._id==="635cd52464f5b7334c594007"){
    //                 setOnOffSlide(el.slide)
    //                 setOnOffDisc(el.discount)
    //             }
    //         })
    //     }
    //     getData()
     })*/
    
    // nút quay lại form login khi bị khóa tài khoản
    const backFormlogin = async ()=>{
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/login";
    }

    // nút lùi slide category
    const PrevCategory = (value)=>{
        setCheckNextPre(true)
        if(value===0){
            setPrevCate(categories.length-3)
            setNextCate(categories.length-3)
        }
        else {
            setPrevCate(value-1)
            setNextCate(value-1)
        }
        setAuto(true)
    }

    // nút tới slide category
    const nextCategory = (value)=>{
        setCheckNextPre(false)
        if(value===(categories.length)-3){
            setNextCate(0)
            setPrevCate(0)
        }
        else {
            setNextCate(value+1)
            setPrevCate(value+1)
        }
        setAuto(true)
    }

    // xử lý slide danh mục chạy tự động
    useEffect(()=>{
        if(!auto){
            setTimeout(() => {
                setCheckNextPre(false)
                if(nextCate===(categories.length)-3){
                    setNextCate(0)
                    setPrevCate(0)
                }
                else {
                    setNextCate(nextCate+1)
                    setPrevCate(nextCate+1)
                }
            }, 3000);  
        }
    },[nextCate, auto])

    // style next slide
    const styleNext = {
        transform: `translateX(${(nextCate)*(-405)}px)`,
        transition: 'ease-in-out 0.4s'
    }

    // style prev slide
    const stylePrev = {
        transform: `translateX(${(-prevCate)*(405)}px)`,
        transition: 'ease-in-out 0.4s'
    }

    // lấy ngày đăng
    useEffect(() =>{
        news.forEach(news => {
            var a='', b='', c=''
            a = news.createdAt.slice(0,4)
            b = news.createdAt.slice(5,7)
            c = news.createdAt.slice(8,10)
            setCreatedAt(c+'/'+b+'/'+a)
        })
    },[news])

    // xử lý slide news
    const slideNews = (index)=>{
        setCtrlSlideNews(index)
    }

    // style slide news
    const styleNews = {
        transform: `translateX(${(-ctrlSlideNews)*(100)}%)`,
        transition: 'ease-in-out 0.4s'
    }

  return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="user-dissabled" style={!dissablee?{display:'none'}:{display:'block'}}>
            <img src={lockUser} alt=''></img>
            <h3>Tài khoản của bạn đã bị khóa do vi phạm chính sách của cửa hàng.</h3>
            <span onClick={backFormlogin}>Quay lại</span>
        </div>

        <div className="container-homepage">
            <div className="section-slide" style={OnOffSlide===1?{display:'block'}:{display:'none'}}>
                <Carousel className="wrap-carousel" activeIndex={activeIndex} next={next} previous={previous}>
                    <CarouselIndicators className="item_crs" items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    {slides}
                    <CarouselControl className="ctrl_prev" direction="prev" directionText="Previous" onClickHandler={previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Carousel>
                <div className="opacity-slide"></div>
            </div>

            <div className="content-homepage">
                <div className="wrap-offer line-homepage">
                    <div className="btn-offer-pro btn-new-pro" onClick={()=>setNewAnDiscPro(false)} style={!NewAnDiscPro?{backgroundColor:'#f17183',color:'#fff'}:{backgroundColor:'#99FF99'}}>Sản phẩm mới nhất</div>
                    <div className="btn-offer-pro btn-disc-pro" onClick={()=>setNewAnDiscPro(true)} style={NewAnDiscPro?{backgroundColor:'#f17183',color:'#fff'}:{backgroundColor:'#99FF99'}}>Sản phẩm sắp về</div>
                    <div className="line-break-row"></div>
                </div>

                <div className="new-product-hp" style={!NewAnDiscPro?{display:'flex'}:{display:'none'}}>
                    {
                        products&&products.map((product, index) =>{
                            if(index<=3) {
                                return <ProductItem key={product._id} product={product} />
                            }
                        })
                    }
                </div>

                <div className="discount-product-hp" style={NewAnDiscPro?{display:'flex'}:{display:'none'}}>
                    {
                        productBuyMany.map((discount, index) =>{
                            if(index<4) {
                                return <ProductItem key={discount._id} product={discount}/>
                            }
                        })
                    }
                </div>

                <div className="wrap-offer line-homepage">
                    <p className="seperate"><span></span>DANH MỤC<span></span></p>
                </div>

                <div className="category-homepage" data-aos="fade-left" data-aos-duration="1000">
                    {
                        categories.map(cate=>{
                            return <span key={cate._id} className="wrap-category-homePage" style={!checkNextPrev?styleNext:stylePrev} >
                                <img src={cate.images.url} alt='' />
                                <p className="name-cate-slide">
                                    {cate.name}
                                    <Link to='/product' onClick={()=>setCategory('category='+cate._id)}>Xem</Link>
                                </p>
                                <p className="bg-opa-cate-slide"></p>
                            </span>
                        })
                    }
                </div>
                <div className="wrap-btn-ctrl-silde">
                    <button onClick={()=>PrevCategory(prevCate)}><img src={Prev} alt='' /></button>
                    <button onClick={()=>nextCategory(nextCate, true)}><img src={Next} alt='' /></button>
                </div>

                <div className="wrap-offer line-homepage">
                    <p className="seperate"><span></span>KHUYẾN MÃI<span></span></p>
                </div>
                <h4 style={OnOffDisc===1?{display:'none'}:{display:'block',textAlign:'center',color:'#666'}}>Chưa có thông tin khuyến mãi</h4>
                
                <div className="container-infor-discount-hp" style={OnOffDisc===1?{display:'block'}:{display:'none'}}>
                    <div className="discount-product-hp">
                        {
                            discounts.map((discount, index) =>{
                                if(index<=3) {
                                    return <ProductItem key={discount._id} product={discount}/>
                                }
                            })
                        }
                    </div>
                    <div className="infor-disc-hp">
                        <div className="infor-disc-left" data-aos="fade-up" data-aos-duration="1000">
                            <Link to='/discountpage' className="btn-discout-hp">Xem ngay</Link>
                            <img src={BgDisc} alt='' />
                            <p className="content-discout-hp"></p>
                            <p className="">RẤT NHIỀU SẢN PHẨM GIẢM MẠNH <br/>
                                Với các % ưu đãi cực lớn, nhanh tay đặt ngay nào !</p>
                        </div>

                        <div className="infor-disc-right">
                        {
                            categories.map(cate=>{
                                if(cate._id===idCategory1){
                                    return <div key={cate._id} className="wrap-item-discRight" data-aos="fade-left" data-aos-duration="1300">
                                        <img className="img-discRight" src={cate.images.url} alt='' />
                                        <p className="name-cate-item-discRight">
                                            {cate.name}
                                            <span style={{textTransform:'none',fontSize:'1rem',display:'block'}}>với nhiều ưu đãi cực lớn</span>
                                            <Link to='/discountpage' className="link-cate-disc" style={{textTransform:'none'}} 
                                                onClick={()=>setCategory('category='+cate._id)}>Xem ngay</Link>
                                        </p>
                                    </div>
                                }
                            })
                        }
                        {
                            categories.map(cate=>{
                                if(cate._id===idCategory2){
                                    return <div key={cate._id} className="wrap-item-discRight" style={{marginTop:'30px'}} data-aos="fade-left" data-aos-duration="1300">
                                        <img src={cate.images.url} alt='' />
                                        <p className="name-cate-item-discRight">
                                            {cate.name}
                                            <span style={{textTransform:'none',fontSize:'1rem',display:'block'}}>đang khuyến mãi đủ các loại %</span>
                                            <Link to='/discountpage' className="link-cate-disc" style={{textTransform:'none'}} 
                                                onClick={()=>setCategory('category='+cate._id)}>Xem ngay</Link>
                                        </p>
                                    </div>
                                }
                            })
                        }
                        </div>
                    </div>
                </div>

                <div className="wrap-offer line-homepage">
                    <p className="seperate"><span></span>TIN TỨC<span></span></p>
                </div>
                <div className="news-hompage">
                    <div className="infor-news-left" data-aos="fade-right" data-aos-duration="1000">
                        {
                            news.map((news, index)=>{
                                if(index<4) {
                                    return <div key={news._id} className="item-news-hp" style={styleNews}>
                                        <Link to={`/detail_news/${news._id}`} className="img-news-hp"><img src={news.images.url} alt='' /></Link>
                                        <div className="item-infor-news">
                                            <Link to={`/detail_news/${news._id}`}><h4>{news.title}</h4></Link>
                                            <p>{createdAt}</p>
                                            <Link to={`/detail_news/${news._id}`}><p>Xem thêm {'>>'}</p></Link>
                                        </div>
                                    </div>
                                }
                            })
                        }
                    </div>
                    <div className="wrap-btn-choose" data-aos="fade-left" data-aos-duration="1000">
                        {
                            news.map((news, index)=>{
                                if(index<4){
                                    return <p key={news._id} onClick={()=>slideNews(index)}><img src={Check} alt='' />{news.title}</p>
                                }
                            })
                        }
                    </div>
                </div>
            </div>
            <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
                <img src={UpHeadPage} alt="" width="15" />
            </Link>
        </div>
    </>
  )
}
