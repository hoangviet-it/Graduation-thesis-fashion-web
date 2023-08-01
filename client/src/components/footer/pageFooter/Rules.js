import React, {useContext, useState, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import {Link} from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'

export default function Rules() {
    const state = useContext(GlobalState)
    const [notify] = state.notifyAPI.notify
    const [content, setContent] = useState('')

    useEffect(()=>{
        notify.forEach(el => {
            if(el._id==='635cd52464f5b7334c594007'){
                setContent(el.rules)
            }
        })
    },[notify])

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
    <div className="container-policy">
        <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Điều khoản & điều kiện</span>
            </div>
        <div className="content-policy" dangerouslySetInnerHTML={{ __html: content}}></div>
    </div>
  )
}
