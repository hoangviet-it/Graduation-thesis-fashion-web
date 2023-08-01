import React, {useContext, useState} from 'react'
import { GlobalState } from '../../../GlobalState'

export default function LoadMore() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.orderAPI.page
    const [reSult] = state.orderAPI.result

return (
    <div className="load_more loadmore-ord-ad">
        {
            reSult < page * 9 ? "" : <button onClick={()=>setPage(page+1)}>Xem thêm...</button>
        }
    </div>
  )
}
