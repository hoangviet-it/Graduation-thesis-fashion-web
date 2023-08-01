import React, {useContext, useState, useEffect} from 'react'
import { useParams, Link} from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import HeaderFixed from '../../header/HeaderFixed'
import UpHeadPage from '../../header/icon/up.svg'
import 'aos/dist/aos.css'
import Aos from 'aos'

export default function DetailNews() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [news] = state.newsAPI.newsAll
    const [detailNews, setDetailNews] = useState([])
    const [createdAt, setCreatedAt] = useState('')
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)

    // lấy dữ liệu detail
    useEffect(() =>{
        if(params.id){
            news.forEach(news => {
                if(news._id===params.id){
                    setDetailNews(news)

                    var a='', b='', c=''
                    a = news.createdAt.slice(0,4)
                    b = news.createdAt.slice(5,7)
                    c = news.createdAt.slice(8,10)
                    setCreatedAt(c+'/'+b+'/'+a)
                }
            });
        }
    },[params.id, news])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // cuộn về đầu trang khi mở trang
    useEffect(()=>{
        scroll()
    },[params.id])

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

    // set hiệu ứng scroll
    useEffect(()=>{
        Aos.init({duration: 1000})
    },[])

  return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="container-detail-news">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Chi tiết tin tức</span>
            </div>

            <h3 className="title-detail-news">{detailNews.title}</h3>
            <p style={{textAlign:'center'}}>Ngày đăng: {createdAt}</p>
            <div data-aos="fade-up" data-aos-duration="1000" data-aos-offset="0" dangerouslySetInnerHTML={{ __html: detailNews.content}} className="content-detail-news"></div>
            
            <div className="other-news">
                <h5>Tin tức khác:</h5>
                <div>
                    <ul>
                        {
                            news.map((news, index)=>{
                                if(news._id!==params.id && index<5)
                                return <Link to={`/detail_news/${news._id}`} key={news._id}><li>- {news.title}</li></Link>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
        <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
            <img src={UpHeadPage} alt="" width="15" />
        </Link>
    </>
  )
}
