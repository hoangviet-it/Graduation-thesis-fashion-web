import React, {useState, useContext} from 'react'
import { GlobalState } from '../../GlobalState'
import Fb from '../header/icon/facebook.svg'
import Intagram from '../header/icon/instagram.svg'
import Youtube from '../header/icon/youtube.svg'
import Phone from '../header/icon/phone.svg'
import Email from '../header/icon/email.svg'
import Address from '../header/icon/address.svg'
import Dot from '../header/icon/dot.svg'
import { Link } from 'react-router-dom'

export default function Footer() {
    const state = useContext(GlobalState)
    const [email, setEmail] = useState('')
    const [isAdmin] = state.userAPI.isAdmin
    const [isClient] = state.userAPI.isClient
    const [products] = state.productsAPI.products

    // thông báo khi click đăng ký email
    const registerEmail = ()=>{
        if(email===''){
            alert('Bạn chưa nhập email.')
        }
        else {
            alert('Đăng ký email thành công!')
            setEmail('')
        }
    }

    return (
        <div className="footer" style={isClient>0?{display:'none'}:{display:'block'}}>
            <div className="head-ft">
                <div className="icon-mxh">
                    <div className="item-mxh">
                        <img className="icon-footer" src={Fb} alt="" width="30px" />
                        <img className="icon-footer" src={Intagram} alt="" width="30px" />
                        <img className="icon-footer" src={Youtube} alt="" width="30px" />
                    </div>
                    <div className="input-register-acc">
                        <label htmlFor='email'>Nhận thông báo: </label>
                        <input type="email" name="email" placeholder="Email của bạn..." value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <button onClick={registerEmail}>Đăng ký</button>
                    </div>
                </div>
            </div>

            <div className="mid-ft">
                <div className="infor">
                    <div className="col1">
                        <h5 style={{color:'orange'}}><i>HOANGVIET SHOP</i></h5>
                        <p><img className="icon-infor" src={Address} alt="" width="11px" />  613 Âu Cơ, P.Phú Trung, Q.Tân Phú, TP.HCM</p>
                        <p><img className="icon-infor" src={Phone} alt="" width="12px" />  0987 654 321</p>
                        <p><img className="icon-infor" src={Email} alt="" width="12px" />  hoangvietshop@gmail.com</p>
                    </div>

                    <div className="col2">
                        <h5>SẢN PHẨM MỚI NHẤT</h5>
                        <ul>
                            {
                                products.map((pro, index)=>{
                                    if(index<4){
                                        return <Link to={`/detail/${pro._id}`} key={pro._id}><li><img className="icon-dot" src={Dot} alt="" width="7px" />  {pro.title} -
                                        &nbsp;{pro.price.toLocaleString("en")}<u>đ</u></li></Link>
                                    }
                                })
                            }
                        </ul>
                    </div>

                    <div className="col3">
                        <h5>THÔNG TIN</h5>
                        <ul>
                            <Link to='/intro'><li><img className="icon-dot" src={Dot} alt="" width="7px" />  Giới thiệu</li></Link>
                            <Link to='/privacy'><li><img className="icon-dot" src={Dot} alt="" width="7px" />  Chính sách bảo mật</li></Link>
                            <Link to='/rules'><li><img className="icon-dot" src={Dot} alt="" width="7px" />  Điều khoản & điều kiện</li></Link>
                            <Link to='/intruct'><li><img className="icon-dot" src={Dot} alt="" width="7px" />  Hướng dẫn đặt hàng</li></Link>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="copyright">
                <p>© 2023 Copyright : Hoangvietshop.com</p>
            </div>
        </div>
    )
}