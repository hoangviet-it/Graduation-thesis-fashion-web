import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function NewsAPI() {
    const [news, setNews] = useState([])
    const [newsAdmin, setNewsAdmin] = useState([])
    const [newsAll, setNewsAll] = useState([])
    const [newsViewMany, setNewsViewMany] = useState([])
    const [result, setResult] = useState(0)
    const [resultAdmin, setResultAdmin] = useState(0)
    const [resultAll, setResultAll] = useState(0)
    const [page, setPage] = useState(1)
    const [callback, setCallback] = useState(false)
    const [showCreateNews, setShowCreateNews] = useState(false)
    const [idNews, setIdNews] = useState('')
    const [checkUpdate, setCheckUpdate] = useState(false)

    useEffect(() =>{
        const getNews = async () =>{
            const res = await axios.get(`/api/news?limit=${page*3}`)
            setNews(res.data.news)
            setResult(res.data.result)
        }
        getNews()

        const getNewsAdmin = async () =>{
            const res = await axios.get(`/api/news?limit=${page*10}`)
            setNewsAdmin(res.data.news)
            setResultAdmin(res.data.result)
        }
        getNewsAdmin()

        const getNewsAll = async () =>{
            const res = await axios.get(`/api/news`)
            setNewsAll(res.data.news)
            setResultAll(res.data.result)
        }
        getNewsAll()

        const getViewMany = async () =>{
            const res = await axios.get(`/api/news?sort=-view`)
            setNewsViewMany(res.data.news)
        }
        getViewMany()
    },[callback, page])


  return {
    news: [news, setNews],
    newsAll: [newsAll, setNewsAll],
    newsViewMany: [newsViewMany, setNewsViewMany],
    result: [result, setResult],
    resultAll: [resultAll, setResultAll],
    page: [page, setPage],
    callback: [callback, setCallback],
    showCreateNews: [showCreateNews, setShowCreateNews],
    idNews: [idNews, setIdNews],
    checkUpdate: [checkUpdate, setCheckUpdate],

    resultAdmin: [resultAdmin, setResultAdmin],
    newsAdmin: [newsAdmin, setNewsAdmin]
  }
}
