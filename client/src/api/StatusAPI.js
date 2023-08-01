import {useState, useEffect} from 'react'
import axios from 'axios'

export default function StatusAPI() {
    const [status, setStatus] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getStatus = async () =>{
            const res = await axios.get('/api/status')
            setStatus(res.data)
        }
        getStatus()
    },[callback])

    return {
        status: [status, setStatus],
        callback: [callback, setCallback]
    }
}
