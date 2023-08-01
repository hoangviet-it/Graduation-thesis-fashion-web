import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from '../../GlobalState'
import {Link} from 'react-router-dom'
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
import up from './icon/up-dropdown.svg'
import axios from 'axios'

export default function HeaderFixed() {
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
    const [showSearch, setShowSearch] = useState(false)
    const [pageNews, setPageNews] = state.newsAPI.page
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
    }

    // xử lý click mục đơn hàng của tôi
    const handelMyOrder = ()=>{
        setClick(!click)
        localStorage.setItem('reload', true)    // tạo item 'reload' trong localStorage
    }

    // xử lý refresh homepage
    const refreshHomePage = () =>{
        setCategory('')
        setSearch('')
        setPage(1)
        setPageNews(1)
        setClick(false)
        setCallback(!callback)
    }


return (
    <div id="header" style={isClient>0?{display:'none'}:{display:'block'}}>
        <div className="container-header">
            <div className="wrap-logo">
                <Link to='/' onClick={refreshHomePage}>
                    <h1>
                        <img className="logo logo-header-scroll" src={Logo}></img>
                    </h1>
                </Link>
            </div>
            <div className="menu-header header-second">
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
                    <Link to='#!' className="link-header" onClick={()=>setShowSearch(!showSearch)}>
                        <li>
                            <img src={Search} alt="" style={{width:'20px',height:'20px'}}></img>
                        </li>
                    </Link>
                    <Link to='/cart' onClick={refreshHomePage} className="link-header">
                        <li className="li-number-cart">
                            <img className="icon-cart" src={Cart}></img>
                            <span className="lenght-cart-hd-scroll" style={cart.length<=0?{display:'none'}:{display:'block'}}>{cart.length}</span>
                        </li>
                    </Link>
                    <Link to='#!' className="link-header" onClick={handleClickAccount}>
                        <li>
                        {
                            isLogged ? <span className="name-acc-login-scroll" style={{margin:'0 2px'}}>
                                {user.slice(0,1)}</span>
                            : <img className="icon-user" src={User} alt=''></img>
                        }
                        </li>
                    </Link>
                </ul>
                <div className="ctrl-acc ctrlAcc-header-scroll" style={click ? {display: 'block'} : {display: 'none'}}>
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
                <div className="func-search search-hd-scroll" style={showSearch?{display:'block'}:{display:'none'}}>
                    <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                        onChange={e=>setSearch(e.target.value.toLowerCase())} />

                    <Link to='/product'>
                        <span className="wrap-icon-search">
                            <img className="icon-search icon-search-seccond" src={Search} alt=""></img>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}
