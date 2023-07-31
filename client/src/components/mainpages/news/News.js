import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import Eye from '../../header/icon/eye.svg'
import Day from '../../header/icon/day.svg'
import LoadMoreNews from './LoadMoreNews'
import HeaderFixed from '../../header/HeaderFixed'
import UpHeadPage from '../../header/icon/up.svg'
import 'aos/dist/aos.css'
import Aos from 'aos'
import axios from 'axios'

export default function News() {
    const state = useContext(GlobalState)
    const [newws] = state.newsAPI.news
    const [newsViewMany] = state.newsAPI.newsViewMany
    const [page, setPage] = state.newsAPI.page
    const [result] = state.newsAPI.result
    const [newsPaginating, setNewsPaginating] = useState([])
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [createdAt, setCreatedAt] = useState('')
    const [callback, setCallback] = state.newsAPI.callback

    // lấy ngày đăng
    useEffect(() =>{
        newws.forEach(news => {
            var a='', b='', c=''
            a = news.createdAt.slice(0,4)
            b = news.createdAt.slice(5,7)
            c = news.createdAt.slice(8,10)
            setCreatedAt(c+'/'+b+'/'+a)
        })
    },[newws])

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
        newws.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*3){
                a.push(el)
                scroll()
            }
        })
        setNewsPaginating(a)
    },[newws, page])

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

    // hiệu ứng scroll
    useEffect(()=>{
        Aos.init({duration: 1000})
    },[])

    // cập nhật lượt xem
    const updateView = async (id)=>{
        var a=0
        newws.forEach(el=>{
            if(id===el._id){
                a=(el.view+1)
            }
        })

        try {
            await axios.put(`/api/view/${id}`, {view: a})
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

  return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="container-news-page">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Tin tức</span>
            </div>
            <div className="wrap-news-page">
                <div className="list-news-page-left" data-aos="fade-right" data-aos-duration="1000" data-aos-offset="0">
                    <h3>Tin tức</h3>
                    <hr/>
                    {
                        newsPaginating.map(news=>{
                            return <div key={news._id} className="news-item">
                                <Link to={`/detail_news/${news._id}`} onClick={()=>updateView(news._id)}><img className="img-avt-news" src={news.images.url} /></Link>
                                <div className="infor-news">
                                    <Link to={`/detail_news/${news._id}`} onClick={()=>updateView(news._id)}><h4 className="title-news">{news.title}</h4></Link>
                                    <div>
                                        <span><img className="icon-view-news" src={Day} alt='' /> {createdAt}</span>
                                        <span> | <img className="icon-view-news" src={Eye} alt='' /> {news.view} Lượt xem</span>
                                    </div>
                                    <p className="desc-news">{news.description}</p>
                                    <Link to={`/detail_news/${news._id}`} onClick={()=>updateView(news._id)} className="read-more">
                                        <p className="read-more-content">Đọc thêm...</p>
                                    </Link>
                                </div>
                            </div>
                        })
                    }
                    {(newsPaginating.length===0) && <p className="notify-not-found-news">Không tìm thấy kết quả</p>}
                    <LoadMoreNews/>
                </div>

                <div className="list-news-view-many" data-aos="fade-left" data-aos-duration="1000" data-aos-offset="0">
                    <h3>Xem nhiều nhất</h3>
                    <hr/>
                    {
                        newsViewMany.map((news, index)=>{
                            if(index<3){
                                return <div key={news._id} className="item-view-many-right">
                                    <Link to={`/detail_news/${news._id}`} onClick={()=>updateView(news._id)}><img className="img-avt-newsMany-view" src={news.images.url} alt='' /></Link>
                                    <div className="item-infor-news-Many">
                                        <Link to={`/detail_news/${news._id}`} onClick={()=>updateView(news._id)}><h6 className="title-news-many">{news.title}</h6></Link>
                                        <div>
                                            <span><img className="icon-view-news" src={Eye} alt='' /> {news.view} Lượt xem</span>
                                        </div>
                                    </div>
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
