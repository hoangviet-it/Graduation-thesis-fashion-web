
import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from '../../GlobalState'
import {Link} from 'react-router-dom'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import User from './icon/user-solid.svg'
import Down from './icon/down.svg'
import Logo from './icon/logo.png'
import Search from './icon/search.svg'
import login from './icon/login.svg'
import logout from './icon/logout.svg'
import register from './icon/register.svg'
import order from './icon/order.svg'
import setting from './icon/setting.svg'
import userCheck from './icon/usercheck.svg'
import headerBG from './icon/header_bg.jpg'
import up from './icon/up-dropdown.svg'
import axios from 'axios'

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [isClient] = state.userAPI.isClient
    const [cart] = state.userAPI.cart
    const [user] = state.userAPI.user
    const [search, setSearch] = state.productsAPI.search
    const [category, setCategory] = state.productsAPI.category
    const [click, setClick] = useState(false)
    const [page, setPage] = state.productsAPI.page
    const [pageNews, setPageNews] = state.newsAPI.page
    const [showHeaderResponsive, setShowHeaderResponsive] = useState(false)
    const [showSearchRes, setShowSearchRes] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    const logoutUser = async () =>{
        await axios.get('/user/logout')
        localStorage.removeItem('Login')
        localStorage.removeItem('reload')
        window.location.href = "/";
    }

    // xủ lý click vào mục tài khoản
    const handleClickAccount = () =>{
        setClick(!click)
        setShowHeaderResponsive(false)
    }

    // xử lý click mục đơn hàng của tôi
    const handelMyOrder = ()=>{
        setClick(!click)
        localStorage.setItem('reload', true)    // tạo item 'reload' trong localStorage
        setShowHeaderResponsive(false)
    }

    // xử lý refresh homepage
    const refreshHomePage = () =>{
        setCategory('')
        setSearch('')
        setPage(1)
        setPageNews(1)
        setClick(false)
        setShowHeaderResponsive(false)
        setCallback(!callback)
    }


return (
    <header id="header" style={isClient>0?{display:'none'}:{display:'block'}}>
        <div className="container-header">

            <div className="wrap-logo">
                <Link to='/' onClick={refreshHomePage}>
                    <h1>
                        <img className="logo" src={Logo}></img>
                    </h1>
                </Link>
            </div>

            <div className="content-header">
                <div className="function-header">

                    <div className="func-search">
                        <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                            onChange={e=>setSearch(e.target.value.toLowerCase())} />

                        <Link to='/product'>
                            <span className="wrap-icon-search">
                                <img className="icon-search" src={Search} alt=""></img>
                            </span>
                        </Link>
                    </div>
                    
                    <div className="account">
                        <span className="icon-acc" onClick={handleClickAccount}>
                            {
                                // isLogged ? <img className="icon-user" src={userCheck} alt=''></img>
                                isLogged ? <span style={{margin:'0 2px'}}>
                                    {user.slice(0,1)}</span>
                                : <img className="icon-user" src={User} alt=''></img>
                            }
                        </span>

                        <span className="dropdown-acc" onClick={handleClickAccount}>
                            {
                                isLogged ? <span>{user}</span> : <span>Tài khoản</span>
                            }
                            {
                                click ?
                                <span>
                                    <img className="icon-dropdown" src={up}></img>
                                </span>
                                :
                                <span>
                                    <img className="icon-dropdown" src={Down}></img>
                                </span>

                            }
                        </span>
                        
                        <div className="ctrl-acc" style={click ? {display: 'block'} : {display: 'none'}}>
                            {
                                isLogged ?  <div>
                                                <Link to='/myorder' onClick={handelMyOrder}>
                                                    <p><img src={order} alt=''></img>Đơn hàng của tôi</p></Link>
                                                <Link to='/updateinforclient' onClick={handleClickAccount}>
                                                    <p style={{borderBottom:'1px solid #bbb'}}><img src={setting} alt=''></img>Thiết lập</p></Link>
                                                <Link to='/' onClick={logoutUser}>
                                                    <p><img src={logout} alt=''></img>Đăng xuất</p></Link>
                                            </div>
                                :   <div>
                                        <Link to='/login' onClick={handleClickAccount}>
                                            <p><img src={login} alt=''></img>Đăng nhập</p></Link>
                                        <Link to='/register' onClick={handleClickAccount}>
                                            <p><img src={register} alt=''></img>Đăng ký</p></Link>
                                    </div>
                            }
                        </div>
                        
                        <span className="wrap-cart">
                            <Link to='/cart'>
                                <img className="icon-cart" src={Cart}></img>
                                <span className="lenght-cart-header" style={cart.length>0?{backgroundColor:'red',color:'#fff',fontSize:'1rem'}:{backgroundColor:'#fff',color:'#000'}}>{cart.length}</span>
                                <span className="char-cart-pro">sản phẩm</span>
                            </Link>
                            {/* <span style={cart.length<=0?{display:'none'}:{display:'block'}}>{cart.length}</span> */}
                        </span>
                    </div>
                    <img src={Search} alt='' className="icon-search-respon-600" onClick={()=>setShowSearchRes(!showSearchRes)}/> 
                    <img src={Menu} alt='' className="icon-img-menu" onClick={()=>setShowHeaderResponsive(!showHeaderResponsive)}/> 
                </div>
            </div>

            <div className="menu-header menu-main" style={showHeaderResponsive?{transform:'translateX(0px)'}:{}}>
                <ul>
                    <Link to='/' onClick={refreshHomePage}>                          
                        <li>TRANG CHỦ</li>
                    </Link>
                    <Link to='/intro' onClick={refreshHomePage}>                          
                        <li>GIỚI THIỆU</li>
                    </Link>
                    <Link to='/product' onClick={refreshHomePage}>                         
                        <li>SẢN PHẨM</li>
                    </Link>
                    <Link to='/discountpage' onClick={refreshHomePage}>                          
                        <li>KHUYẾN MÃI</li>
                    </Link>
                    <Link to='/news' onClick={refreshHomePage}>                          
                        <li>TIN TỨC</li>
                    </Link>
                    <Link to='/contact' onClick={refreshHomePage}>                          
                        <li>LIÊN HỆ</li>
                    </Link>

                    {   /* responsive max-width: 768px */
                        isLogged ?  
                        <div className="infor-name-user-menu">
                            <Link to='/myorder' onClick={handelMyOrder}>
                                <li>ĐƠN HÀNG CỦA TÔI</li></Link>
                            <Link to='/updateinforclient' onClick={handleClickAccount}>
                                <li style={{borderBottom:'1px solid #bbb'}}>THIẾT LẬP</li></Link>
                            <Link to='/' onClick={logoutUser}>
                                <li>ĐĂNG XUẤT</li></Link>
                        </div> : 
                        <div className="infor-name-user-menu">
                                <Link to='/login' onClick={handleClickAccount}>
                                    <li>ĐĂNG NHẬP</li></Link>
                                <Link to='/register' onClick={handleClickAccount}>
                                    <li>ĐĂNG KÝ</li></Link>
                        </div>
                    }
                </ul>
            </div>

            {/* form search resposive */}
            <div className="search-respon-form" style={showSearchRes?{display:'block'}:{}}>
                <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                    onChange={e=>setSearch(e.target.value.toLowerCase())} />

                <Link to='/product' onClick={()=>setShowSearchRes(false)}>
                    <span className="wrap-icon-search">Tìm kiếm</span>
                </Link>
                <span className="close-form-search-res" onClick={()=>setShowSearchRes(false)}>X</span>
            </div>
        </div>
    </header>
  )
}
export default Header;