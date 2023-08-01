import {useState, useEffect} from 'react'
import axios from 'axios'

export default function ProductsAPI() {
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [callback1, setCallback1] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [search1, setSearch1] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [productAll, setProductAll] = useState([])
    const [resultAll, setResultAll] = useState(0)
    const [cateDiscout, setCatediscount] = useState('')
    const [createProduct, setCreateProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)
    const [product_id, setProduct_id] = useState('')
    const [checkCreatePro, setCheckCreatePro] = useState(false)
    const [discountProduct, setDiscountProduct] = useState([])
    const [resultDiscountPro, setResultDiscountPro] = useState(0)
    const [pageDis, setPageDis] = useState(1)
    const [callbackDisPro, setCallbackDisPro] = useState(false)
    const [productBuyMany, setProdictBuyMany] = useState([])
    const [searchProAd, setSearchProAd] = useState('')
    const [productsAdmin, setProductsAdmin] = useState([])
    const [resultAd, setResultAd] = useState(0)
    const [searchQuantity, setSearchQuantity] = useState('')

    // lấy sản phẩm theo phân trang
    useEffect(() =>{
        const getProducts = async () =>{
            const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()
    },[callback, category, sort, search, page])


    // lấy sản phẩm theo phân trang (dùng ở admin)
    useEffect(() =>{
        const getProductsAd = async () =>{
            const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&product_id[regex]=${searchProAd}`)
            setProductsAdmin(res.data.products)
            setResultAd(res.data.result)
        }
        getProductsAd()
    },[callback, category, sort, searchProAd, page])


    // search sản phẩm theo số lượng (dùng ở admin)
    useEffect(() =>{
        const getProductsAd = async () =>{
            if(searchQuantity!==''){
                const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}${searchQuantity}`)
                setProductsAdmin(res.data.products)
                setResultAd(res.data.result)
            }
            else {
                const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}`)
                setProductsAdmin(res.data.products)
                setResultAd(res.data.result)
            }
        }
        getProductsAd()
    },[callback, category, sort, searchQuantity, page])


    // lấy các sản phẩm sắp về
    useEffect(()=>{
        const getProductsBuyMany = async () =>{
            const res = await axios.get(`/api/products?limit=${page*4}&status=632879b1a2e7052bc439f97b`)
            setProdictBuyMany(res.data.products)
        }
        getProductsBuyMany()
    },[callback, page])


    // lấy tất cả sản phẩm trong database
    useEffect(() =>{
        const getProductsAll = async () =>{
            const res = await axios.get(`/api/products?${cateDiscout}&title[regex]=${search1}`)
            setProductAll(res.data.products)
            setResultAll(res.data.result)
        }
        getProductsAll()
    },[cateDiscout, callback1, search1])


    // lấy các sản phẩm đang khuyến mãi trong database
    useEffect(() =>{
        const getDiscountProduct = async () =>{
            const res = await axios.get(`/api/discountProduct?limit=${pageDis*8}&${category}&product_id[regex]=${searchProAd}`)
            setDiscountProduct(res.data.proDiscount)
            setResultDiscountPro(res.data.result)
        }
        getDiscountProduct()
    },[pageDis, callbackDisPro, category, searchProAd])


    return {
        products: [products, setProducts],     // trả product theo phân trang (6sp/1page)
        callback: [callback, setCallback],
        callback1: [callback1, setCallback1],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        search1: [search1, setSearch1],
        page:  [page, setPage],
        result: [result, setResult],

        productAll: [productAll, setProductAll],     //tất cả product
        resultAll: [resultAll, setResultAll],

        cateDiscout: [cateDiscout, setCatediscount],
        createProduct: [createProduct, setCreateProduct],
        updateProduct: [updateProduct, setUpdateProduct],
        product_id: [product_id, setProduct_id],
        checkCreatePro: [checkCreatePro, setCheckCreatePro],

        discountProducts: [discountProduct, setDiscountProduct],
        resultDiscountPro: [resultDiscountPro, setResultDiscountPro],
        pageDis: [pageDis, setPageDis],
        callbackDisPro: [callbackDisPro, setCallbackDisPro],

        productBuyMany: [productBuyMany, setProdictBuyMany],

        searchProAd: [searchProAd, setSearchProAd],
        productsAdmin: [productsAdmin, setProductsAdmin],
        resultAd: [resultAd, setResultAd],

        searchQuantity: [searchQuantity, setSearchQuantity]     // tìm sản phẩm theo số lượng
    }
}