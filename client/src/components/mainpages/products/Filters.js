import React, {useContext} from 'react'
import { GlobalState } from '../../../GlobalState'

export default function Filters() {
    const state = useContext(GlobalState)
    const [categories, setCategories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search

    // const handleCategory = e =>{
    //     setCategory(e.target.value)
    //     setSearch('')
    // }


  return (
    <div className="filter_menu" style={{padding: "10px 20px"}}>
        <div className="row-filter">
            <span>Sắp xếp theo: </span>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{cursor: 'pointer'}}>
                <option value=''>Mới nhất</option>
                <option value='sort=oldest'>Cũ nhất</option>
                {/* <option value='sort=-sold'>Bán chạy nhất</option> */}
                <option value='sort=-price'>Giá giảm dần</option>
                <option value='sort=price'>Giá tăng dần</option>  
            </select>
        </div>
    </div>
  )
}