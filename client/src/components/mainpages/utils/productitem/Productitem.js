import React, {useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import BtnRender from './BtnRender'
import { GlobalState } from '../../../../GlobalState'
import cart from '../../../header/icon/cart.svg'
import Aos from 'aos'
import 'aos/dist/aos.css'

export default function Productitem({product}) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart

    // set item localStorage cho chức năng thông báo đánh giá ở component DetailProduct
    const setItemLocalSto = ()=>{
        localStorage.setItem('reloadPage', true)
    }

    // xử lý click nút đặt trước
    const handleAddCart = (product, colorPro, imageMain) =>{
        var a=[]
        product.size.forEach(el => {
            if(el!==''){
                a.push(el)
            }
        })
        addCart(product, colorPro, imageMain, a[0])
    }

    // hiệu ứng scroll page
    useEffect(()=>{
        Aos.init({duration: 1000})
    },[])

    return (
        <>
            <div className="product_card" data-aos="flip-left">
                <p className="p-link-detail-pro" onClick={setItemLocalSto}><Link to={`/detail/${product._id}`}><img src={product.images.url} alt="" /></Link></p>

                <div className="product_box">
                    <Link to={`/detail/${product._id}`}><h4 title={product.title}>{product.title}</h4></Link>
                    {
                        product.discount>0 ? 
                        <span>
                            <span>{((product.price/100)*(100-product.discount)).toLocaleString("en")} <u>đ</u></span>
                            <p style={{color: '#888'}}><del>{(product.price).toLocaleString("en")} <u>đ</u></del></p>
                        </span>
                        : <span>{(product.price).toLocaleString("en")} <u>đ</u></span>
                    }
                    {
                        product.discount>0 ? '' : <p className="description-pro">Chất liệu: {product.description}</p>
                    }               
                </div>  
                {
                    product.discount>0?<div className="persent-number">-{product.discount}%</div>:''
                }
                {
                    product.status==="632879b1a2e7052bc439f97b"?<div className="notify-near-pro">Hàng sắp về</div>:''
                }
                {
                    product.status==="63247a157819fc3aa0ac3f5a" || product.quantity_product===0 ? <h5 style={{textAlign:'center',marginTop:'10px',color:'#FF6600'}}><i>Tạm hết hàng !</i></h5> 
                    :
                    product.status==="632879b1a2e7052bc439f97b"? <Link id="btn_buy" className="btn-pre-order" to='#!' onClick={() => handleAddCart(product, product.color, product.images.url)}>
                        <img id="icon-btn-addCart" src={cart}></img>ĐẶT TRƯỚC</Link>
                    :
                    <BtnRender product={product}/>
                }
            </div>
        </> 
    )
}