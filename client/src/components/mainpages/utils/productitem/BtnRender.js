import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'
import cart from '../../../header/icon/cart.svg'

export default function BtnRender({product}) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart

    // xử lý click nút thêm vào giỏ hàng
    const handleAddCart = (product, colorPro, imageMain) =>{
        var a=[]
        product.size.forEach(el => {
            if(el!==''){
                a.push(el)
            }
        })
        addCart(product, colorPro, imageMain, a[0])
    }

    return (
        <div className="row_btn">
            <Link id="btn_buy" to='#!' onClick={() => handleAddCart(product, product.color, product.images.url)}>
                <img id="icon-btn-addCart" src={cart} alt='' />THÊM VÀO GIỎ</Link>
        </div>
    )
}