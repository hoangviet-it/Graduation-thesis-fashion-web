import React, {useState} from 'react'
import notFound from '../../../header/icon/404.png'
import Loading from '../loading/Loading'

export default function NotFound() {
    const [loading, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 30*1000);

    return (
        loading ? <div style={{marginBottom:'150px'}}><Loading/></div>
        :
        <div className="container-not-found">
            <img src={notFound} alt=''></img>
        </div>
    )
}