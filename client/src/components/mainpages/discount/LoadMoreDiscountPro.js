import React, {useContext, useState, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import Next from '../../header/icon/next.svg'
import Pre from '../../header/icon/previous.svg'

export default function LoadMoreDiscountPro() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.productsAPI.pageDis
    const [reSultAll] = state.productsAPI.resultAll
    const [numberNextSpace, setNumberNextSpace] = useState(0)   // cách trang hiện tại 2 đơn vị (vd: hiện tại = 1, nextSpace = 3)
    const [midNum, setMidNum] = useState([])
    const [number] = useState(8)

    // nút lùi trang
    const handlePre = (value) =>{
        if (page===1){
            setPage(page)
        } 
        else {
            setPage(page-1);
            setNumberNextSpace((value-1)+1)
            midNum.pop()
        }
    }

    // nút next trang
    const handleNext = (valuePage) =>{
        var checkPage = false
        if(reSultAll/number<=page){
            setPage(page)
            setNumberNextSpace(false)
            checkPage=true
        }
        else {
            setPage(page+1)
            setNumberNextSpace(valuePage+1)
        }

        if(reSultAll/number<=valuePage){
            setNumberNextSpace(false)
        }

        var a=[]
        for(let i=1; i<=valuePage; i++){
            if(i<=valuePage&&i>1){
                a.push(i)
            }
        }
        if(checkPage===true){
            a.pop()
        }
        setMidNum(a)
    }

    // xử lý click vào số trang
    const handleLoadNumber = (value) =>{
        var checkPage = false
        if(value!==1){
            setPage(value)
            setNumberNextSpace(0)
            if(reSultAll/number<=value-1){
                setNumberNextSpace(false)
                checkPage=true
            }
        }
        else {
            setPage(1)
            setNumberNextSpace(0)
        }

        if(reSultAll/number<=value){
            setNumberNextSpace(false)
        }

        var a=[]
        for(let i=1; i<=value; i++){
            if(i<=value&&i>1){
                a.push(i)
            }
        }
        
        if(checkPage===true){
            a.pop()
        }
        setMidNum(a)
    }

    // set lại mãng khi bấm lọc theo giá trị (# tất cả)
    useEffect(()=>{
        if(page===1){setMidNum([]); setNumberNextSpace(page+1)}
    },[page])

  return (
        <div className="load_more">
            <span className="btn-number-load" onClick={()=>handlePre(page)}><img src={Pre} alt=''></img></span>
            <span className="btn-number-load" onClick={()=>handleLoadNumber(1)} style={page===1?{color:'#fff', backgroundColor:'#999'}:{color:'#000', backgroundColor:'#fff'}}>1</span>
            {
                midNum.map((num)=>{
                    return <span key={num} className="btn-number-load" onClick={()=>handleLoadNumber(num)} 
                    style={num===midNum[midNum.length-1]?{color:'#fff', backgroundColor:'#999'}:{color:'#000', backgroundColor:'#fff'}}>{num}</span>
                })
            }
            {
                numberNextSpace===false?'':<span className="btn-number-load" onClick={()=>handleLoadNumber(numberNextSpace===0?page+1:numberNextSpace)}>
                    {numberNextSpace===0?page+1:numberNextSpace}</span>
            }
            <span className="btn-number-load" onClick={()=>handleNext(page+1)}><img src={Next} alt=''></img></span>
        </div>
    )
}
