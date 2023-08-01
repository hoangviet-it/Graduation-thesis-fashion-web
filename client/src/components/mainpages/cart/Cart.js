import React,{useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import 'aos/dist/aos.css'
import Aos from 'aos'

export default function Cart() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [cart, setCart] = state.userAPI.cart
    const [money, setMoney] = state.orderAPI.money
    const [total, setTotal] = useState(0)
    const [ship] = useState(30000)
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [linkOrder, setLinkOrder] = useState(false)
    const [checkLinkOrder, setCheckLinkOrder] = useState(false)
    const [products] = state.productsAPI.productAll
    const [callback, setCallback] = state.productsAPI.callback

    //tính tổng tiền hàng
    useEffect(() =>{
        const getTotal = async () =>{
            const total = await cart.reduce((prev, item) =>{
                return prev + ((item.price/100)*(100-item.discount) * item.quantity)
            },0)

            setTotal(total)
        }
        getTotal()
    },[cart])

    // cập nhật dữ liệu mới cho cart
    const addToCart = async () =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }

    //tăng số lượng
    const increment = (id) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.quantity+=1
            }
        })
        setCart([...cart])
        addToCart()
        setCheckLinkOrder(false)
    }

    // giảm số lượng
    const decrement = (id) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.quantity === 0 ? item.quantity = 0 : item.quantity === 1 ? item.quantity = 1 : item.quantity-=1
            }
        })
        setCart([...cart])
        addToCart()
    }

    // xóa khỏi giỏ hàng
    const removeProduct = id =>{
        if(window.confirm("Bạn chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng ?")){
            cart.forEach((item, index) =>{
                if(item._id === id){
                    cart.splice(index,1)
                }
            })
            setCart([...cart])
            addToCart()
        }
    }

    // thay đổi số lượng trực tiếp trong input  
    const changeQuantityPro = (value, id)=>{
        var sl
        products.forEach(el=>{
            if(id===el._id){
                sl = el.quantity_product
            }
        })

        var a
        if(value==='' || parseInt(value)<0){a = 0}
        else if(parseInt(value)>sl) {alert(`Số lượng sản phẩm không đủ cung cấp. ${'\n'}Quý khách vui lòng liên hệ đến cửa hàng để được hỗ trợ!`); a = 1}
        else {a = parseInt(value)}

        if(a===0){setCheckLinkOrder(true)} else {setCheckLinkOrder(false)}

        cart.forEach(item =>{
            if(item._id === id){
                item.quantity = a
            }
        })
        setCart([...cart])
        addToCart()
    }

    // check số lượng khi tiến hành đặt hàng
    useEffect(()=>{
        var a=[]
        cart.forEach(item =>{
            if(item.quantity===0){
                a.push(item.quantity)
            }
        })
        if(a.length!==0){
            setCheckLinkOrder(true)
        }
        else {
            setCheckLinkOrder(false)
        }
    },[cart])

    // check số lượng sản phẩm khi tiến hành đặt hàng
    const CheckTotal = ()=> {
        alert("Số lượng từng sản phẩm phải lớn hơn hoặc bằng 1.")
    }

    // xử lý thay đổi size sản phẩm
    const changeSize = (id, siz) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.sizeCart === siz ? item.sizeCart = item.sizeCart : item.sizeCart = siz
            }
        })
        setCart([...cart])
        addToCart()
        setSize('')
    }

    // xủ lý đổi màu sản phẩm
    const changeColor = (id, col) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.colorPro === col ? item.colorPro = item.colorPro : item.colorPro = col

                col === item.color ? item.imageMain = item.images.url 
                : col === item.color1 ? item.imageMain = item.images1.url
                : col === item.color2 ? item.imageMain = item.images2.url
                : col === item.color3 ? item.imageMain = item.images3.url
                : item.imageMain = ''
            }
        })
        setCart([...cart])
        addToCart()
        setColor('')
    }

    // lấy dữ liệu từ input
    // const handleChangeInput = e =>{
    //     const {value} = e.target
    //     setCodeDiscount(value)
    // }

    // xử lý button áp dụng mã khuyến mãi
    // const DiscountCode = () =>{
    //     discounts.forEach((item)=>{
    //         if(item.code===codeDiscount){
    //             setMoney((total/100)*(100-item.persent)+ship)
    //             setCheckDiscount(true)
    //             //setCodeDiscount('')
    //             alert("Áp dụng mã khuyến mãi thành công!")
    //         }
    //     })
    // }

    // tạo item "reload" trong localStorage để load lại page cho chức năng cập nhật số thông báo ở component CreateOrder
    useEffect(()=>{
        if(cart.length===0){
            localStorage.removeItem('reload')
        }
        else {
            localStorage.setItem('reload', true)
        }
        scroll()
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
        Aos.init({duration: 1000})
    },[])

    if(cart.length === 0)
        return  <div className="empty-cart">
                    <h2>Giỏ hàng</h2>
                    <h2>Chưa có sản phẩm nào</h2>
                    <Link to='/product' className="continue-buy" onClick={()=>setCallback(!callback)}>QUAY LẠI TRANG MUA HÀNG</Link>
                </div>

    return (
        <div className="wrap-container-cart">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Giỏ hàng</span>
            </div>

            <p className="title-cart-head">GIỎ HÀNG (<span>{cart.length} sản phẩm</span>)</p>

            <div className="container-cart">

                <div className="cart-item" data-aos="fade-right">
                    {
                        cart.map(product =>(
                            <div className="cart" key={product._id}>
                                <div className="box-cart-left">
                                    <img src={product.imageMain} alt="" />
                                    <span>
                                        <h4>{product.title}</h4>
                                        <p><b>Chất liệu: </b>{product.description}</p>
                                        <p><b>Màu: </b>{product.colorPro}</p>
                                        <p><b>Kích cỡ (size): </b><span className="sizeCart">{product.sizeCart}</span></p>
                                        <div className="delete-pro-cart" onClick={()=>removeProduct(product._id)}>Xóa khỏi giỏ hàng</div>
                                    </span>
                                </div>

                                <div className="box-cart">
                                    <div className="price-cart">
                                        <p>{((product.price/100)*(100-product.discount)).toLocaleString("en")} <u>đ</u></p>
                                        <div>
                                            <span style={product.discount===0?{display:'none'}:{display:'inline'}}>
                                                <del style={{color:'#888'}}>{product.price.toLocaleString("en")} <u>đ</u></del>&nbsp;&nbsp;|&nbsp;</span>
                                            <span>-{product.discount}%</span>
                                        </div>
                                    </div>
                                    <span className="amount">
                                        <span className="btn-amount" onClick={()=>decrement(product._id)} 
                                        style={{borderTopLeftRadius: '4px',borderBottomLeftRadius: '4px',cursor:'pointer'}}>-</span>
                                        {/* <span>{product.quantity}</span> */}
                                        <input type='text' name='quantity' id='quantityProCart' value={product.quantity} onChange={(e)=>changeQuantityPro(e.target.value, product._id)} />
                                        <span className="btn-amount" onClick={()=>increment(product._id)}
                                        style={{borderTopRightRadius: '4px',borderBottomRightRadius: '4px',cursor:'pointer'}}>+</span>
                                        
                                        <div className="changeSize">
                                            <select value={size} onChange={(e)=>setSize(e.target.value)} onClick={(e)=>changeSize(product._id, size)}>
                                                <option value={product.sizeCart}>Đổi size</option>                                          
                                                {
                                                    product.size.map(siz=>{
                                                        if(siz!==''){
                                                            return <option key={siz} value={siz}>{siz}</option>
                                                        }
                                                    })
                                                }
                                            </select>
                                            <br/>   
                                            <select value={color} onChange={(e)=>setColor(e.target.value)} onClick={(e)=>changeColor(product._id, color)}>
                                                <option value={product.colorPro}>Đổi Màu</option>  
                                                {
                                                    product.color===''?'':<option value={product.color}>{product.color}</option>
                                                }
                                                {
                                                    product.color1===''?'':<option value={product.color1}>{product.color1}</option>
                                                }
                                                {
                                                    product.color2===''?'':<option value={product.color2}>{product.color2}</option>
                                                }
                                                {
                                                    product.color3===''?'':<option value={product.color3}>{product.color3}</option>
                                                }
                                            </select>
                                        </div>
                                    </span>

                                    {/* <div className="delete-pro-cart" onClick={()=>removeProduct(product._id)}>X</div> */}
                                </div>
                            </div>
                        ))
                    }
                    <Link to='/product' className="continue-buy">TIẾP TỤC MUA HÀNG</Link>
                </div>

                <div className="total" data-aos="fade-left">
                    {/* <div className="wrap-code-item">
                        <p>Nhập mã khuyến mãi (nếu có)</p>
                        <div className="code-item">
                            <input type="text" name="code" id="code" value={codeDiscount}
                            onChange={handleChangeInput} />
                            <span onClick={DiscountCode}>Áp dụng</span>
                            <p>(Chỉ áp dụng trên tiền hàng)</p>
                        </div>
                    </div> */}

                    <div className="item-total">
                        {/* <p>
                            <span style={{color:'#000', marginLeft:'0',}}>Mã khuyến mãi: </span>         
                            {
                                discounts.map(discount=>{
                                    if(codeDiscount===discount.code){
                                        return <span key={discount._id} 
                                        style={checkDiscount?{display:'inline',color:'#3366CC'}:{display:'none'}}>- {discount.persent}%</span>
                                    }
                                })
                            }
                        </p> */}
                        <p>Tiền hàng: &nbsp;<span style={{color:'#3366CC'}}>{(total).toLocaleString("en")} <u>đ</u></span></p>
                        <p>Phí vận chuyển: <span style={{color:'#3366CC'}}>{ship.toLocaleString("en")} <u>đ</u></span></p>
                        <hr></hr>
                        <p>Thành tiền: <span>{money===0?((total+ship).toLocaleString("en")):(money.toLocaleString("en"))} <u>đ</u></span></p>
                        <div className="note-total">(Đã bao gồm các hình thức khuyến mãi)</div>
                        {
                            checkLinkOrder ?
                            <Link to='#!' onClick={CheckTotal}>TIẾN HÀNH ĐẶT HÀNG</Link>
                            :
                            <Link to='/order'>TIẾN HÀNH ĐẶT HÀNG</Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}