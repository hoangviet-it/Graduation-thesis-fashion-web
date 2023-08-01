import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function NotifyAPI() {
    const [notify, setNotify] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getnotify = async () =>{
            const res = await axios.get('/api/notify')
            setNotify(res.data)
        }
        getnotify()
    },[callback])


    return {
        notify: [notify, setNotify],
        callback: [callback, setCallback]
    }
}
