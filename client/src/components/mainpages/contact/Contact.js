import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import Phone from '../../header/icon/phone.svg'
import Email from '../../header/icon/email.svg'
import Address from '../../header/icon/address.svg'

export default function Contact() {
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
    <div className="container-contact">
        <div className="crumb">
            <Link to='/' className="crumb-homepage">
                <img src={Home} alt=''></img>
                <span>Trang chủ</span>
            </Link>
            <img src={Next} alt=''></img>
            <span className="crumb-name">Liên hệ</span>
        </div>

        <div className="inf-contact">
            <div className="item-contact">
                <span className="address-contact"><img src={Address} alt=''></img></span>
                <span>
                    <p style={{display:'inline'}}>Địa chỉ:</p>
                    <p style={{marginLeft:'38px'}}>613 Âu Cơ, P.Phú Trung, Q.Tân Phú, TP.HCM</p>
                </span>
            </div>
            <div className="item-contact">
                <span className="address-contact"><img src={Phone} alt=''></img></span>
                <span>
                    <p style={{display:'inline'}}>Điện thoại:</p>
                    <p style={{marginLeft:'38px',color:'#FF9900'}}>0987654321</p>
                    <p style={{marginLeft:'38px',marginTop:'-15px'}}>mở cửa: 8h - 22h, T2 - CN</p>
                </span>
            </div>
            <div className="item-contact">
                <span className="address-contact"><img src={Email} alt=''></img></span>
                <span>
                    <p style={{display:'inline'}}>Email:</p>
                    <p style={{marginLeft:'38px',color:'#FF9900'}}>hoangvietshop@gmail.com</p>
                </span>
            </div>
        </div>

        <div className="map-contact">
            {
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.352613334668!2d106.63918451474903!3d10.784282192316185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fda472ec235%3A0x2d1dfc8b40b67f8e!2zNjEzIMOCdSBDxqEsIFBow7ogVHJ1bmcsIFTDom4gUGjDuiwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1665329822275!5m2!1svi!2s" width={600} height={450} style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            }
        </div>
    </div>
  )
}
