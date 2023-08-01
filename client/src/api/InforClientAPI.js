import {useState, useEffect} from 'react'
import axios from 'axios'

export default function DiscountAPI(token) {
    const [inforClient, setInforClient] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        if(token) {
            const getinforClient = async () =>{
                const res = await axios.get(`/api/inforclient`, {
                    headers: {Authorization: token}
                })
                setInforClient(res.data)
            }
            getinforClient()
        }
    },[token, callback])

    return {
        inforClient: [inforClient, setInforClient],
        callback: [callback, setCallback]
    }
}
