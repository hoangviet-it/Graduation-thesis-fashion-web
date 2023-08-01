import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Productitem from '../components/mainpages/utils/productitem/Productitem'

export default function UserAPI(token) {
    const [users, setUssers] = useState([])
    const [isLogged, setIsLogged] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [adminOrder, setadminOrder] = useState(false)
    const [adminProduct, setadminProduct] = useState(false)
    const [isShipper, setIsShipper] = useState(false)
    const [cart, setCart] = useState([])
    const [user, setUser] = useState([])
    const [user_id, setUserId] = useState([])
    const [callback, setCallback] = useState(false)
    const [dissable, setDissable] = useState(false)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [resultAll, setResultAll] = useState(0)
    const [userAd, setUserAd] = useState([])
    const [resultAd, setResultAd] = useState(0)
    const [roles, setRoles] = useState([])
    const [callbackCreAd, setCallbackCreAd] = useState(false)
    const [sort, setSort] = useState('')
    const [user_id_char, setUser_id_char] = useState('')

    const [userPayed, setUserPayed] = useState([])
    const [resultUserPayed, setResultUserPayed] = useState(0)
    const [pagePayed, setPagePayed] = useState(1)
    const [searchPayed, setSearchPayed] = useState('')

    const [userNotPay, setUserNotPay] = useState([])
    const [resultUserNotPay, setResultUserNotPay] = useState(0)
    const [pageNotPay, setPageNotPay] = useState(1)
    const [searchNotPay, setSearchNotPay] = useState('')

    // get thông tin user đang đăng nhập
    useEffect(() => {
        if(token){
            const getUser = async () =>{
                try{
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })
                    setIsLogged(true)
                    setIsClient(res.data.role)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    // res.data.role === 0 ? setIsClient(true) : setIsClient(false)
                    res.data.role === 2 ? setadminOrder(true) : setadminOrder(false)
                    res.data.role === 3 ? setadminProduct(true) : setadminProduct(false)
                    res.data.role === 4 ? setIsShipper(true) : setIsShipper(false)

                    setCart(res.data.cart)
                    setUser(res.data.name)
                    setUserId(res.data._id)
                    setDissable(res.data.dissable)
                    setUser_id_char(res.data.user_id)
                    
                } 
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            getUser()
        }      
    },[token])

    // hàm thêm sản phẩm vào giỏ hàng
    const addCart = async (product, colorPro, imageMain, sizeCart) =>{
        if(!isLogged) return alert("Hãy đăng nhập hoặc tạo tài khoản để tiếp tục mua hàng !")

        const check = cart.every(item =>{
            return item._id !== product._id
        })

        if(check){
            setCart([...cart, {...product, quantity: 1, sizeCart, colorPro, imageMain}])
            
            await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1, sizeCart, colorPro, imageMain}]},{
                headers: {Authorization: token}
            })
            alert("Đã thêm vào giỏ hàng.")
        } 
        else{
            alert("Sản phẩm này đã có trong giỏ hàng.")
        }
    }

    // get tất cả user (có phân trang)
    useEffect(() => {
        if(adminOrder||isAdmin){
            const readUser = async () =>{
                try{
                    const res = await axios.get(`/user/readuser?limit=${page*10}&user_id[regex]=${search}`,{
                        headers: {Authorization: token}
                    })
                    setUssers(res.data.users)
                    setResult(res.data.result)               
                } 
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            readUser()
    
            const readUserAll = async () =>{
                try{
                    const res = await axios.get(`/user/readuser`,{
                        headers: {Authorization: token}
                    })
                    setResultAll(res.data.result)               
                } 
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            readUserAll()
        }
    },[isAdmin, adminOrder, callback, search, page, sort])

    // get danh sách admin
    useEffect(()=>{
        if(isAdmin){
            const readAdmin = async () =>{
                try{
                    const res = await axios.get(`/user/read_admin?limit=${page*10}&${sort}&user_id[regex]=${search}`,{
                        headers: {Authorization: token}
                    })
                    setUserAd(res.data.users)
                    setResultAd(res.data.result)               
                } 
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            readAdmin()
        }
    },[isAdmin, callback, search, page, sort])

    // api get user đã mua hàng
    useEffect(()=>{
        if(isAdmin||adminOrder) {
            const readUserPayed = async () =>{
                try{
                    const res = await axios.get(`/user/userpayed?limit=${pagePayed*10}&user_id[regex]=${searchPayed}`,{
                        headers: {Authorization: token}
                    })
                    setUserPayed(res.data.userPayed)
                    setResultUserPayed(res.data.result)               
                }
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            readUserPayed()
        }
    },[isAdmin, adminOrder, searchPayed, pagePayed, callback])

    // api get user chưa mua hàng
    useEffect(()=>{
        if(isAdmin||adminOrder) {
            const readUserNotPay = async () =>{
                try{
                    const res = await axios.get(`/user/usernotpay?limit=${pageNotPay*10}&user_id[regex]=${searchNotPay}`,{
                        headers: {Authorization: token}
                    })
                    setUserNotPay(res.data.userNotPay)
                    setResultUserNotPay(res.data.result)               
                }
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            readUserNotPay()
        }
    },[isAdmin, adminOrder, searchNotPay, pageNotPay, callback])

    // get danh sách role
    useEffect(() =>{
        if(isAdmin){
            const getRoles = async () =>{
                const res = await axios.get('/api/role',{
                    headers: {Authorization: token}
                })
                setRoles(res.data)
            }
            getRoles()
        }
    },[isAdmin, callbackCreAd])

  return {
      users: [users, setUssers],
      page: [page, setPage],
      result: [result, setResult],

      isLogged: [isLogged, setIsLogged],
      isAdmin: [isAdmin, setIsAdmin],
      isClient: [isClient, setIsClient],
      adminOrder: [adminOrder, setadminOrder],
      adminProduct: [adminProduct, setadminProduct],
      isShipper: [isShipper, setIsShipper],

      cart: [cart, setCart],
      user: [user, setUser],
      user_id: [user_id, setUserId],
      addCart: addCart,
      callback: [callback, setCallback],
      dissable: [dissable, setDissable],
      search: [search, setSearch],
      resultAll: [resultAll, setResultAll],

      userPayed: [userPayed, setUserPayed],
      resultUserPayed: [resultUserPayed, setResultUserPayed],
      pagePayed: [pagePayed, setPagePayed],
      searchPayed: [searchPayed, setSearchPayed],

      userNotPay: [userNotPay, setUserNotPay],
      resultUserNotPay: [resultUserNotPay, setResultUserNotPay],
      pageNotPay: [pageNotPay, setPageNotPay],
      searchNotPay: [searchNotPay, setSearchNotPay],

      userAd: [userAd, setUserAd],
      resultAd: [resultAd, setResultAd],
      roles: [roles, setRoles],
      callbackCreAd: [callbackCreAd, setCallbackCreAd],
      sort: [sort, setSort],
      userIdChar: [user_id_char, setUser_id_char]
  }
}