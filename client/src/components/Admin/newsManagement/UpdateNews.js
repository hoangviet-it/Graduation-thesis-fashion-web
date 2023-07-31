import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadingMini from '../../mainpages/utils/loading/LoadingMini'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const initialState = {
    title: '',
    description: '',
    _id: ''
}

export default function UpdateNews() {
    const { quill, quillRef } = useQuill();
    const [value, setValue] = useState('')

    const state = useContext(GlobalState)
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin
    const [callback, setCallback] = state.newsAPI.callback
    const [newsData] = state.newsAPI.newsAll
    const [idNews] = state.newsAPI.idNews
    const [checkUpdate, setCheckUpdate] = state.newsAPI.checkUpdate
    const [news, setNews] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState(false)
    const [news_id, setNews_id] = useState('')

    // lất data hiển thị
    useEffect(() =>{
        if(idNews){
            newsData.forEach(news =>{
                if(news._id === idNews){
                    setNews(news)
                    setNews_id(news.news_id)
                    setImages(news.images)
                }
            })
        }
        else{
            setNews(initialState)
            setNews_id('')
            setImages(false)
        }
    }, [idNews])

    // thay đổi giá trị input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setNews({...news, [name]:value})
    }

    // thêm hình
    const handleUpload = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
    
            setLoading(false)
            setImages(res.data)   

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // định dạng style hiển thị ảnh
    const styleUpload = {
        display: images ? "block" : "none"
    }

    // xóa hình
    const handleDestroy = async () =>{
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setImages(false)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // submit dữ liệu về database
    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            if(!images) return alert('Bạn chưa thêm hình bài viết.')

            const res = await axios.put(`/api/news/${idNews}`, {news_id, ...news, content: value, images}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // lấy dữ liệu từ summernote và đọc dữ liệu từ db vào summernote
    useEffect(()=>{
        var a=''
        newsData.forEach(el=>{
            if(el._id===idNews){
                return a = el.content
            }
        })

        if(quill){
            quill.on('text-change', ()=>{
                setValue(quillRef.current.firstChild.innerHTML)
            })
            quill.clipboard.dangerouslyPasteHTML(a)
        }
    },[quill])

  return (
    <div className="container-create-news-ad">
        <div className="title-line-create-pro-ad">
                <div className="item-tt-line-cre-pro-ad">QUẢN LÝ TIN TỨC</div>
            </div>
            <h3 className="title-form-add-news">Chỉnh sửa bài viết</h3>
            <div className="wrap-form-add-news">
                <div className="container-form-add-news-ad">
                    <div className="form-img-add-news upload">
                        <input type="file" name="file" id="file_up_img_news" onChange={handleUpload} onClick={e => (e.target.value = null)} />
                        {
                            loading ? <div id="file_img"><LoadingMini/></div>
                            :<div id="file_img" style={styleUpload}>
                                <img src={images ? images.url: ''} alt="" />
                                <span onClick={handleDestroy}>X</span>
                            </div>
                        }
                    </div>
                    <div className="form-left-add-news">
                        <div className="row-input-form-news">
                            <label className="label-create label-origin" htmlFor="news_id">Mã bài viết:</label>
                            <input type="text" name="news_id" id="news_id" required
                            onChange={handleChangeInput} disabled={true} value={news_id} />
                        </div>
                        <div className="row-input-form-news">
                            <label className="label-create label-origin" htmlFor="title">Tiêu đề:</label>
                            <input type="text" name="title" id="title" required
                            onChange={handleChangeInput} value={news.title} />
                        </div>
                        <div className="row-input-form-news">
                            <label className="label-create label-origin" htmlFor="description">Mô tả:</label>
                            <input type="text" name="description" id="description" required
                            onChange={handleChangeInput} value={news.description} />
                        </div>
                    </div>
                    <button className="btn-out-form-news" onClick={()=>setCheckUpdate(false)}>Trở về</button>
                    <button className="btn-submit-form-news" onClick={handleSubmit}>Cập nhật</button>
                </div>
                <div className="container-form-content-news">
                    <div className="summernote-form-add-news" style={{height: 430}}>
                        <div ref={quillRef} />
                    </div>
                </div>
            </div>
    </div>
  )
}
