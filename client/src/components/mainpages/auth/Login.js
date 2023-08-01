import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

export default function Login() {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin


    const [user, setUser] = useState({
        email: '', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const loginSubmit = async e =>{
        e.preventDefault()
        try{
            await axios.post('/user/login', {...user})
            localStorage.setItem('Login', true)
            window.location.href = "/";

        }catch (err){
            alert(err.response.data.msg)
        }
    }

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    useEffect(()=>{
        scroll()
    },[])

    return (
        <div className="container-login">
            <div className="login-page">
                <form onSubmit={loginSubmit}>
                    <h2>Đăng nhập</h2>
                    <input type="email" name="email" required placeholder="Email" value={user.email} onChange={onChangeInput} />
                    <input type="password" name="password" required autoComplete="on" 
                    placeholder="Password" value={user.password} onChange={onChangeInput} />

                    <div className="row-btn-login">
                        <button type="submit">Đăng nhập</button>
                        <Link to='/register'>Tài khoản mới</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}