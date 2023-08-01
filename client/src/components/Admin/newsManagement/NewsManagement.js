import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import CreateNews from './CreateNews'
import UpdateNews from './UpdateNews'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import LoadingMini from '../../mainpages/utils/loading/LoadingMini'
import Loading from '../../mainpages/utils/loading/Loading'
import LoadMore from './LoadMore'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function NewsManagement() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [callback, setCallback] = state.newsAPI.callback
    const [newsData] = state.newsAPI.newsAdmin
    const [showCreateNews, setShowCreateNews] = state.newsAPI.showCreateNews
    const [idnews, setIdNews] = state.newsAPI.idNews
    const [checkUpdate, setCheckUpdate] = state.newsAPI.checkUpdate
    const [loading, setLoading] = useState(false)
    const [page, setPage] = state.newsAPI.page
    const [result] = state.newsAPI.resultAdmin
    const [newsPaginating, setNewsPaginating] = useState([])

    const [checkBox, setCheckBox] = useState(false)
    const [valueSelect, setValueSelect] = useState('')
    const [CheckAll, setCheckAll] = useState(false)
    const [newsAll] = state.newsAPI.newsAll
    const [isAdmin] = state.userAPI.isAdmin

    // cập nhật news
    const updateProduct = (id)=> {
        if(!isAdmin){
            alert("Quyền truy cập bị từ chối!")
        }
        else {
            setIdNews(id)
            setCheckUpdate(true)
        }
    }

    // xóa news
    const deleteProduct = async (id, public_id) =>{
        if(!isAdmin){
            alert("Quyền truy cập bị từ chối!")
        }
        else{
            if(window.confirm("Bạn chắc chắn muốn xóa ?"))
            try {
                setLoading(true)
                const ress = await axios.post('/api/destroy', {public_id},{
                    headers: {Authorization: token}
                })
    
                const res = await axios.delete(`/api/news/${id}`,{
                    headers: {Authorization: token}
                })
                alert(res.data.msg)        
                setCallback(!callback)
                setLoading(false)
    
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }
    
    // xử lý phân trang hiển thị sản phẩm tương ứng với số trang
    useEffect(()=>{
        var a = []
        newsData.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*10){
                a.push(el)
                scroll()
            }
        })
        setNewsPaginating(a)
    },[newsData, page])

    // set page phân trang về trang 1 khi mở page
    useEffect(()=>{
        setPage(1)
    },[])

    // cập nhật checked trong db (chức năng xóa tất cả)
    const updateCheckNews = async (e)=>{
        var a
        newsData.forEach(el=>{
            if(el._id===e.target.value){
                if(el.checked===false){
                    a = true
                }
                else {
                    a = false
                }
            }
        })
        
        try {
            const res =  await axios.put(`/api/check_news/${e.target.value}`, {checked: a},{
                headers: {Authorization: token}
            })
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý click vào select chọn xóa tất cả
    useEffect(()=>{
        if(valueSelect==='0'){
            setCheckBox(false)
            setCheckAll(false)
        }
        else if(valueSelect==='1'){
            setCheckBox(true)
            setCheckAll(false)
        }
        else if(valueSelect==='2'){
            setCheckBox(false)
            setCheckAll(true)
        }
    },[valueSelect])

    // cập nhật tất cả checked thành true
    useEffect(()=>{
        if(CheckAll){
            const updateCheckAll = async ()=>{
                try {
                    await axios.put(`/api/check_all_news`,{},{
                        headers: {Authorization: token}
                    })
                    setCallback(!callback)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            updateCheckAll()
        }
        else {
            if(!isAdmin){
                return ''
            }
            else {
                const cancelCheck = async ()=>{
                    try {
                        await axios.put(`/api/cancel_check_news`,{},{
                            headers: {Authorization: token}
                        })
                        setCallback(!callback)
    
                    } catch (err) {
                        alert(err.response.data.msg)
                    }
                }
                cancelCheck()
            }
        }
    },[CheckAll, checkBox])

    // xóa sản phẩm đã check
    const deleteNewsChecked = (e)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa?"))
        newsAll.forEach(async el=>{
            if(el.checked){
                try {
                    setLoading(true)
                    const ress = await axios.post('/api/destroy', {public_id: el.images.public_id},{
                        headers: {Authorization: token}
                    })

                    const res = await axios.delete(`/api/news/${el._id}`,{
                        headers: {Authorization: token}
                    })

                    setLoading(false)
                    setCallback(!callback)
                    setCheckBox(false)
                    setCheckAll(false)
        
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        })
    }

    return (
        <>
            {
                showCreateNews?<CreateNews/>:checkUpdate?<UpdateNews/>:
                <div className="wrap-contain-news-ad">
                    <div className="title-line-create-pro-ad">
                        <div className="item-tt-line-cre-pro-ad">QUẢN LÝ TIN TỨC</div>
                    </div>
                    {
                        loading?<Loading/>:
                        <div className="container-mana-news">
                            <div className="option-select-all">
                                <select value={valueSelect} onChange={(e)=>{setValueSelect(e.target.value)}}>
                                    <option value={'0'}>{CheckAll||checkBox?"Bỏ chọn":"Chọn"}</option>
                                    <option value={'1'}>Chọn nhiều</option>
                                    <option value={'2'}>Chọn tất cả</option>
                                </select>
                                <button onClick={deleteNewsChecked}>Xóa</button>
                            </div>
                            <button className="btn-create-news-ad" onClick={()=>setShowCreateNews(true)}
                                style={!isAdmin?{display:'none'}:{display:'block'}} >Tạo bài viết</button>
                            <div className="container-promana list-table-news">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Hình ảnh bài viết</th>
                                            <th>Mã bài viết</th>
                                            <th>Tiêu đề</th>
                                            <th>Lượt xem</th>
                                            <th>Ngày đăng</th>
                                            <th>Tùy chỉnh</th>
                                        </tr>
                                        {
                                            newsPaginating.map((news, index)=>{
                                                return <tr key={news._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                                    <td>
                                                        <input type="checkbox" name="checkbox" id="check-delete-all" readOnly checked={news.checked} value={news._id} onClick={updateCheckNews} style={checkBox||CheckAll?{display:'inline'}:{display:'none'}} />
                                                        <span className="th-table-respon-news">STT: </span>{index+1}
                                                    </td>
                                                    <td><img className="img-news" src={news.images.url} alt='' /></td>
                                                    <td><span className="th-table-respon-news">Mã bài viết: </span>{news.news_id}</td>
                                                    <td className="td-title-news"><span className="th-table-respon-news">Tiêu đề: </span>{news.title}</td>
                                                    <td><span className="th-table-respon-news">Lượt xem: </span>{news.view}</td>
                                                    <td><span className="th-table-respon-news">Ngày đăng: </span>{news.createdAt.slice(0,10)}</td>
                                                    <td>
                                                        <span><img onClick={()=>updateProduct(news._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                                        <span><img onClick={()=>deleteProduct(news._id, news.images.public_id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <br/>
                            {(newsPaginating.length===0) && <p className="notify-not-found-pro-mana">Không tìm thấy kết quả</p>}
                            <LoadMore/>
                        </div>
                    }
                </div>
            }
        </>
    )
}

