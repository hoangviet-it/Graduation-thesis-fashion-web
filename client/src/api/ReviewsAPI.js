import {useState, useEffect} from 'react'
import axios from 'axios'

export default function ReviewsAPI() {
    const [review, setReview] = useState([])
    const [refresh, setRefresh] = useState(false)

    useEffect(() =>{
        const getReview = async () =>{
            const res = await axios.get('/api/review')
            setReview(res.data.reviews)
        }
        getReview()
    },[refresh])

    return {
        review: [review, setReview],
        refresh: [refresh, setRefresh]
    }
}

