import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function CategoriesAPI(token) {
    const [categories, setCategories] = useState([])
    const [callback, setCallback] = useState(false)
    const [objectCategory, setObjectCategory] = useState([])
    const [checkObjPage, setCheckObjPage] = useState(false)

    useEffect(() =>{
        const getCategories = async () =>{
            const res = await axios.get('/api/category')
            setCategories(res.data)
        }
        getCategories()
    },[callback])

    useEffect(() =>{
      const getObject = async () =>{
          const res = await axios.get('/api/object_category')
          setObjectCategory(res.data)
      }
      getObject()
  },[callback])


  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
    objectCategory: [objectCategory, setObjectCategory],
    checkObjPage: [checkObjPage, setCheckObjPage]
  }
}