import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'

export default function Register() {
    const state = useContext(GlobalState)

    const [user, setUser] = useState({
        name: '', email: '', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const registerSubmit = async e =>{
        e.preventDefault()
        try{
            await axios.post('/user/register', {...user})
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
                <form onSubmit={registerSubmit}>
                    <h2>Tạo tài khoản</h2>
                    <input type="text" name="name" required placeholder="Name" value={user.name} onChange={onChangeInput} />
                    <input type="email" name="email" required placeholder="Email" value={user.email} onChange={onChangeInput} />
                    <input type="password" name="password" required autoComplete="on" 
                    placeholder="Password" value={user.password} onChange={onChangeInput} />

                    <div className="row-btn-login">
                        <button type="submit">Đăng ký</button>
                        <Link to='/login'>Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}