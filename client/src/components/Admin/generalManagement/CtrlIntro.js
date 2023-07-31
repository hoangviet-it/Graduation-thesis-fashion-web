import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function CtrlIntro() {
    const { quill, quillRef } = useQuill();
    const [value, setValue] = useState('')
    const state = useContext(GlobalState)
    const [token] = state.token
    const [notify] = state.notifyAPI.notify
    const [callback, setCallback] = state.notifyAPI.callback

     // lấy dữ liệu từ summernote
     useEffect(()=>{
        var a=''
        notify.forEach(el=>{
            if(el._id==='635cd52464f5b7334c594007'){
                return a = el.intro
            }
        })

        if(quill){
            quill.on('text-change', ()=>{
                setValue(quillRef.current.firstChild.innerHTML)
            })
            quill.clipboard.dangerouslyPasteHTML(a)
        }
    },[quill])

    const submitUpdate = async ()=>{
        if(window.confirm("Bạn muốn cập nhật dữ liệu ?"))
        try {
            const res = await axios.put(`/api/update_intro/635cd52464f5b7334c594007`, {intro: value}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

  return (
    <div>
        <div className="form-summer-intro-ad" style={{height: '60vh'}}>
            <div ref={quillRef} />
        </div>
        <button className="btn-update-intro" onClick={submitUpdate}>Cập nhật</button>
    </div>
  )
}
