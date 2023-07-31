import React from 'react'
import { Link } from 'react-router-dom'

export default function DiscountProduct({pro}) {

    // công thức tính % khuyến mãi:   D = (giá / 100) * (100 - discountPersent)
    
    return (
        <div className="row-discount" key={pro._id}>
            <Link to={`/detail/${pro._id}`} className="item-discount">
                <img src={pro.images.url} alt="" />
                <span>
                    <p className="title-dis">{pro.title}</p>
                    <p className="price-dis">{((pro.price/100)*(100-pro.discount)).toLocaleString("en")} đ</p>
                    <p className="price-old"><del>{(pro.price).toLocaleString("en")} đ</del></p>
                </span>
            </Link>
        </div>
    )
}
