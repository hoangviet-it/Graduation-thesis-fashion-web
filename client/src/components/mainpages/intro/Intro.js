import React, {useEffect, useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'
import { GlobalState } from '../../../GlobalState'

export default function Intro() {
    const state = useContext(GlobalState)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [content, setContent] = useState('')

    // lấy dữ liệu intro
    useEffect(()=>{
        notify.forEach(el=>{
            if(el._id==='635cd52464f5b7334c594007'){
                setContent(el.intro)
            }
        })
    },[notify])

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

    useEffect(()=>{
        scroll()
    },[])

  return (
    <>
    {
        header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
    }
    <div className="container-intro">
        <div className="crumb">
            <Link to='/' className="crumb-homepage">
                <img src={Home} alt=''></img>
                <span>Trang chủ</span>
            </Link>
            <img src={Next} alt=''></img>
            <span className="crumb-name">Giới thiệu</span>
        </div>
        <div className="content-intro-page" dangerouslySetInnerHTML={{ __html: content}}></div>
        <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
            <img src={UpHeadPage} alt="" width="15" />
        </Link>
    </div>
    </>
  )
}
