import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'

const initialState = {
    email: '',
    address: '',
    phone: '',
    name_client: ''
}

const passwordDefault = {
    password: ''
}

export default function UpdateInforClient() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [infor, setInfor] = useState(initialState)
    const [inforClient] = state.inforClientAPI.inforClient
    const [userId] = state.userAPI.user_id
    const [callback, setCallback] = state.inforClientAPI.callback
    const [showIpEmpty, setShowIpEmpty] = useState(false)
    const [showIpEmpty1, setShowIpEmpty1] = useState(false)
    const [showIpEmpty2, setShowIpEmpty2] = useState(false)
    const [showIpEmpty3, setShowIpEmpty3] = useState(false)
    const [showChangePass, setShowChangePass] = useState(false)
    const [pass, setPass] = useState(passwordDefault)
    const [btn_update, setBtn_update] = useState(false)


    // thay đổi dữ liệu input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setInfor({...infor, [name]:value})
    }

    // inut passWord
    const ChangeInputPassWord = e =>{
        const {name, value} = e.target
        setPass({...pass, [name]:value})
    }

    // xử lý cập nhật dữ liệu vào db
    const handleSubmit = async e =>{
        e.preventDefault()
        try {  
            const res = await axios.put('/api/inforclient', {...infor}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý hiển thị input trống
    const updateInfor = () =>{
        setShowIpEmpty(true)
        setShowIpEmpty1(true)
        setShowIpEmpty2(true)
        setShowIpEmpty3(true)
        setBtn_update(true)
    }

    // xử lý hiển thị element input thay đổi password
    const changePassWord = () =>{
        setShowChangePass(!showChangePass)
    }

    // xử lý  đổi mật khẩu
    const submitChangePass = async() =>{
        try {
            const res = await axios.patch('/user/updatepassword', {...pass}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setPass(passwordDefault)

        } catch (err) {
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
        <div className="wrap-updateInforClient">
            <div className="crumb cru-updateInf">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Thiết lập tài khoản</span>
            </div>
            <div className="container-updateInforClient">
                <form onSubmit={handleSubmit}>
                    <h4>Chỉnh sửa thông tin cá nhân:</h4>
                    <p>(Bấm vào "Thay đổi thông tin" để thay đổi nội dung)</p>
                    <span className="btn-update-inf-user" onClick={updateInfor}>Thay đổi thông tin</span>

                    <div className="row-infor-order">
                        <label htmlFor="name_client">Họ Tên<span> *</span></label><br></br>
                            {
                                showIpEmpty ? <input type="text" name="name_client" id="name_client" required 
                                value={infor.name_client} onChange={handleChangeInput}/>
                                :
                                inforClient.map((client)=>{
                                    if(userId===client.user_id){
                                        return <input key={client._id} type="text" name="name_client" id="name_client" required 
                                        value={infor.name_client=client.name_client} onChange={handleChangeInput} disabled={true}/>
                                    }
                                })
                            }
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="address">Địa chỉ<span> *</span></label><br></br>
                            {
                                showIpEmpty1 ? <input type="text" name="address" id="address" required 
                                value={infor.address} onChange={handleChangeInput}/>
                                :
                                inforClient.map((client)=>{
                                    if(userId===client.user_id){
                                        return <input key={client._id} type="text" name="address" id="address" required 
                                        value={infor.address=client.address} onChange={handleChangeInput} disabled={true}/>
                                    }
                                })
                            }
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="phone">Điện thoại<span> *</span></label><br></br>
                            {
                                showIpEmpty2 ? <input type="text" name="phone" id="phone" required 
                                value={infor.phone} onChange={handleChangeInput}/>
                                :
                                inforClient.map((client)=>{
                                    if(userId===client.user_id){
                                        return <input key={client._id} type="text" name="phone" id="phone" required 
                                        value={infor.phone=client.phone} onChange={handleChangeInput} disabled={true}/>
                                    }
                                })
                            }
                    </div>

                    <div className="row-infor-order">
                        <label htmlFor="email">Email<span> *</span></label> <br></br>
                            {
                                showIpEmpty3 ? <input type="email" name="email" id="email" required 
                                value={infor.email} onChange={handleChangeInput}/>
                                :
                                inforClient.map((client)=>{
                                    if(userId===client.user_id){
                                        return <input key={client._id} type="email" name="email" id="email" required 
                                        value={infor.email=client.email} onChange={handleChangeInput} disabled={true}/>
                                    }
                                })
                            }
                    </div>

                    <div className="wrap-btn-form-inf">
                        <p className="btn-change-pass" onClick={changePassWord}>Đổi mật khẩu</p>
                        {
                            !btn_update ? ''
                            :
                            <button className="btn-update-form-inf" type="submit">Cập nhật</button>
                        }
                    </div>
                </form>

                <div className="element-change-pass" style={showChangePass?{display:'block'}:{display:'none'}}>
                    <input type="text" name="password" id="password" required 
                        value={pass.password} onChange={ChangeInputPassWord} placeholder="Nhập mật khẩu mới..."/>
                    <span onClick={submitChangePass} className="btn-change-pass">Cập nhật mật khẩu</span>
                </div>
            </div>
        </div>
    )
}
