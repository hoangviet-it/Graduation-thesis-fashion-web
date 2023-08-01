import {useState, useEffect} from 'react'
import axios from 'axios'

export default function DiscountAPI() {
    const [discount, setDiscount] = useState([])
    const [checkCodeDiscount, setCheckCodeDiscount] = useState(false)
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getDiscount = async () =>{
            const res = await axios.get('/api/discount')
            setDiscount(res.data)
        }
        getDiscount()
    },[callback])

    return {
        discount: [discount, setDiscount],
        checkCodeDiscount: [checkCodeDiscount, setCheckCodeDiscount],
        callback: [callback, setCallback]
    }
}
