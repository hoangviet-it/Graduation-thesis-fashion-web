import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import CtrlIntro from './CtrlIntro'
import CtrlPolicy from './CtrlPolicy'
import CtrlRules from './CtrlRules'
import CtrlIntruct from './CtrlIntruct'

export default function GeneralManagement() {
    const [value, setValue] = useState(1)

  return (
    <div className="container-general-ad">
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad">THÔNG TIN CHUNG</div>
        </div>
        <div className="container-mana-general-ad">
            <button className="btn-gen-ad" onClick={()=>setValue(1)} 
                style={value===1?{backgroundColor:'#00cc00',color:'#fff'}:{backgroundColor:'#fff'}}>Giới thiệu Website</button>
            <button className="btn-gen-ad" onClick={()=>setValue(2)}
                style={value===2?{backgroundColor:'#00cc00',color:'#fff'}:{backgroundColor:'#fff'}}>Chính sách bảo mật</button>
            <button className="btn-gen-ad" onClick={()=>setValue(3)}
                style={value===3?{backgroundColor:'#00cc00',color:'#fff'}:{backgroundColor:'#fff'}}>Điều khoản & điều kiện</button>
            <button className="btn-gen-ad" onClick={()=>setValue(4)}
                style={value===4?{backgroundColor:'#00cc00',color:'#fff'}:{backgroundColor:'#fff'}}>Hướng dẫn đặt hàng</button>
            {
                value===1 ? <CtrlIntro/> : value===2 ? <CtrlPolicy/> : value===3 ? <CtrlRules/> : <CtrlIntruct/>
            }
        </div>
    </div>
  )
}
