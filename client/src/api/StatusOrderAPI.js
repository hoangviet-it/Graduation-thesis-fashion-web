import {useState, useEffect} from 'react'
import axios from 'axios'

export default function StatusOrderAPI() {
    const [statusOrder, setStatusOrder] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getStatusOrder = async () =>{
            const res = await axios.get('/api/statusorder')
            setStatusOrder(res.data)
        }
        getStatusOrder()
    },[callback])

    return {
        statusOrder: [statusOrder, setStatusOrder],
        callback: [callback, setCallback]
    }
}
