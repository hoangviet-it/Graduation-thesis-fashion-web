import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import iconDelete from '../../header/icon/icon-delete.svg'
import LoadMoreUser from '../utilAdmin/LoadMoreUser'
import axios from 'axios'

export default function AdminList() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [users] = state.userAPI.userAd
    const [clients] = state.inforClientAPI.inforClient
    const [roles] = state.userAPI.roles
    const [showFormCre, setShowFormCre] = useState(false)
    const [account, setAccount] = useState({
        'name': '', 'email': '', 'password': '', 'role': ''
    })
    const [callback, setCallback] = state.userAPI.callback
    const [sort, setSort] = state.userAPI.sort
    const [search, setSearch] = state.userAPI.search
    const [showFormCreRole, setShowFormCreRole] = useState(false)
    const [role, setRole] = useState('')
    const [role_id, setRole_id] = useState(0)
    const [callbackCreAd, setCallbackCreAd] = state.userAPI.callbackCreAd

    const [result] = state.userAPI.resultAd
    const [page, setPage] = state.userAPI.page
    const [productPaginating, setProductPaginating] = useState([])
    const [showFormUpdataUser, setShowFormUpdataUser] = useState(false)
    const [valueUpdateRoleUser, setValueUpdateRoleUser] = useState('')
    const [idUser, setIdUser] = useState('')
    const [idStringUser, setIdStringUser] = useState('')
    const [roleUser, setRoleUser] = useState(0)
    const [nameRoleUpdate, setNameRoleUpdate] = useState('')
    const [roleUpdate, setRoleupdate] = useState('')

    // change input
    const onChangeInput = (e)=>{
        const {name, value} = e.target
        setAccount({...account, [name]:value})
    }

    // xử lý phân trang hiển thị user tương ứng với số trang
    useEffect(()=>{
        var a = []
        users.forEach((el, index) => {
            if(index+1>result||index+1<=result&&index+1>(page-1)*10){
                a.push(el)
                scroll()
            }
        })
        setProductPaginating(a)
    },[users, page])

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // xử lý tạo tài khoản admin mới
    const submitCreateAcc = async ()=>{
        try {
            const res = await axios.post(`/user/register_admin`,{...account},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setShowFormCre(false)
            setAccount({'name': '', 'email': '', 'password': '', 'role': ''})
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // cập nhật dissable vào db
    const dissableUser = async (id)=>{
        if(window.confirm("Bạn muốn khóa tài khoản này?"))
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: true}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // cập nhật dissable = false mở khóa cho user
    const enableUser = async (id)=>{
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: false}, {
                headers: {Authorization: token}
            })
            alert("Đã mở khóa!")
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa user bị khóa
    const deleteUserDisa = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            const res = await axios.delete(`user/deleteuser/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            //deteleInforClient(id)
            setCallback(!callback)

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xử lý lấy mã role tự động
    useEffect(()=>{
        var a=[], b=0
        roles.forEach(el=>{
            a.push(el.role_id)
        })

        if(a.length!==0){
            b = a[a.length-1]+1
        }
        else {
            b = 1
        }
        
        setRole_id(b)
    },[roles])

    // submit thêm role mới
    const createRole = async ()=>{
        try {
            const res = await axios.post('/api/role',{role_id: role_id, name: role},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setRole('')
            setCallbackCreAd(!callbackCreAd)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // show form cập nhật phân quyền trong tài khoản
    const ShowFormUpdateRoleUser = (id, role, userId)=>{
        setShowFormUpdataUser(true)
        setIdUser(id)
        setRoleUser(role)
        setIdStringUser(userId)
    }

    // cập nhật phân quyền trong tài khoản
    const UpdateRoleUser = async ()=>{
        try {
            const res = await axios.put(`/user/update_role_user/${idUser}`,{role: valueUpdateRoleUser},{
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setShowFormUpdataUser(false)
            setValueUpdateRoleUser('')
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // đóng form cập nhật user
    const hidenFormUpdateUser = ()=>{
        setShowFormUpdataUser(false)
        setValueUpdateRoleUser('')
    }

    // hàm onchange input ở form cập nhật chỉnh sửa tên phân quyền
    const setRoleUpdate = (e)=>{
        setNameRoleUpdate(e.target.value)
        if(e.target.value==='') {
            setRoleupdate('')
        }
        else {
            roles.forEach(el=>{
                if(el._id===e.target.value){
                    setRoleupdate(el.name)
                }
            })
        }
    }
    // cập nhật tên phân quyền (ở form quản lý phân quyền)
    const updateRole = async ()=>{
        if(nameRoleUpdate===''){
            alert("Chưa chọn phân quyền để chỉnh sửa.")
        }
        else {
            try {
                const res = await axios.put(`/api/role/${nameRoleUpdate}`, {name: roleUpdate}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setNameRoleUpdate('')
                setRoleupdate('')
                setCallbackCreAd(!callbackCreAd)
    
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    // xóa phân quyền
    const deleteRole = async ()=>{
        if(nameRoleUpdate===''){
            alert("Chưa chọn phân quyền để xóa.")
        }
        else {
            try {
                const res = await axios.delete(`/api/role/${nameRoleUpdate}`,{
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setNameRoleUpdate('')
                setRoleupdate('')
                setCallbackCreAd(!callbackCreAd)
    
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

  return (
    <div className={showFormCre||showFormCreRole||showFormUpdataUser?"bg-blach-opacity container-list-manager":"container-list-manager"}>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad">QUẢN TRỊ VIÊN</div>
        </div>

        <div className="wrap-filter-role">
            <label>Lọc theo phân quyền: </label>
            <select className="select-filter-role-ad" value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value={''}>{sort===''?"Chọn phân quyền":"Bỏ chọn"}</option>
                {
                    roles.map(role=>{
                        if(role.role_id!==0){
                            return <option key={role._id} value={`role=${role.role_id}`}>{role.name}</option>
                        }
                    })
                }
            </select>
            <input type="text" name="search" value={search} onChange={(e)=>setSearch(e.target.value.trim())} placeholder="Nhập mã tài khoản..." />
            <button className="btn-show-form-role" onClick={()=>setShowFormCreRole(true)}>Quản lý phân quyền</button>
            <button className="btn-add-account-admin" onClick={()=>setShowFormCre(true)}>Tạo tài khoản</button>
        </div>

        <div className="container-user-mana-ad table-list-admin-mana">
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Phân quyền</th>
                        <th>Ngày tạo</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        productPaginating.map((user, index)=>{
                            if(user.role!==0) {
                                return <tr key={user._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td><span className="th-table-respon-manaAd">STT: </span>{index+1}</td>
                                    <td><span className="th-table-respon-manaAd">Mã tài khoản: </span>{user.user_id}</td>
                                    <td><span className="th-table-respon-manaAd">Tên tài khoản: </span>{user.name}</td>
                                    <td><span className="th-table-respon-manaAd">Email: </span>{user.email}</td>
                                    {
                                        roles.map(role=>{
                                            if(user.role===role.role_id){
                                                return <td key={role._id}><span className="th-table-respon-manaAd">Phân quyền: </span>{role.name}</td>
                                            }
                                        })
                                    }
                                    <td><span className="th-table-respon-manaAd">Ngày tạo: </span>{user.createdAt.slice(0,10)}</td>
                                    <td>
                                        <span className="btn-see-detail btn-update-user-ad-manager"
                                            onClick={()=>ShowFormUpdateRoleUser(user._id, user.role, user.user_id)}>Sửa</span>
                                        <span className="btn-see-detail btn-delete-user-disa"
                                            onClick={()=>deleteUserDisa(user._id)}>Xóa</span>
                                        {
                                            user.dissable===true ?
                                            <span className="btn-see-detail btn-dissable" 
                                            onClick={()=>enableUser(user._id)}>Mở khóa</span>
                                            :
                                            <span className="btn-see-detail btn-dissable" 
                                            onClick={()=>dissableUser(user._id)}>Khóa</span>
                                        }
                                    </td>
                                </tr>
                            }
                        })
                    }
                </tbody>
            </table>
            {productPaginating.length === 0 && <p className="notify-not-found-myOrd">Không tìm thấy kết quả</p>}
            <LoadMoreUser/>
        </div>

        <div className="form-create-role form-update-role-user" style={showFormUpdataUser?{}:{top:'-1000px'}}>
            <div className="wrap-form-create-role">
                <h5>Cập nhật phân quyền người dùng</h5>
                <h6 style={{textAlign: 'center'}}>Mã tài khoản: {idStringUser}</h6>
                <select className="select-update-role-user" value={valueUpdateRoleUser} onChange={(e)=>setValueUpdateRoleUser(e.target.value)}>
                    {
                        roles.map(role=>{
                            if(roleUser===role.role_id){
                                return <option key={role._id} value={role.role_id}>{role.name}</option>
                            }
                        })
                    }
                    {
                        roles.map(role=>{
                            if(roleUser!==role.role_id){
                                return <option key={role._id} value={role.role_id}>{role.name}</option>
                            }
                        })
                    }
                </select>
                <div className="row-btn-form-role">
                    {
                        valueUpdateRoleUser===''?'':
                        <button className="btn-create-role" onClick={()=>UpdateRoleUser()}>Cập nhật</button>
                    }
                    <button className="btn-close-role" onClick={hidenFormUpdateUser}>Đóng</button>
                </div>
            </div>
        </div>

        <div className="form-create-role" style={showFormCreRole?{}:{top:'-1000px'}}>
            <div className="title-mana-role">
                <h5>Quản lý Phân quyền</h5>
                <span className="btn-close-form-update-role" onClick={()=>setShowFormCreRole(false)}>X</span>
            </div>
            <div className="form-update-role">
                <div className="wrap-form-create-role">
                    <h5>Tạo phân quyền</h5>
                    <div className="row-form-create-role">
                        <label htmlFor="role_id">Mã phân quyền:</label>
                        <input type="text" name="role_id" value={role_id} readOnly required disabled={true} />
                    </div>
                    <div className="row-form-create-role">
                        <label htmlFor="role">Tên phân quyền:</label>
                        <input type="text" name="role" value={role} onChange={(e)=>setRole(e.target.value)} required />
                    </div>
                    <div className="row-btn-form-role">
                        <button className="btn-create-role" onClick={createRole}>Thêm</button>
                    </div>
                </div>
                <br/>
                <div className="wrap-form-create-role">
                    <h5>Chỉnh sửa phân quyền</h5>
                    <select className="select-role-update" value={nameRoleUpdate} onChange={setRoleUpdate}>
                        <option value={''}>{nameRoleUpdate===''?"Chọn phân quyền":"Bỏ chọn"}</option>
                        {
                            roles.map(role=>{
                                return <option key={role._id} value={role._id}>{role.name}</option>
                            })
                        }
                    </select>
                    <div className="row-form-create-role">
                        <input type="text" id="input-update-role" name="roleUpdate" value={roleUpdate} onChange={(e)=>setRoleupdate(e.target.value)} required placeholder="Tên phân quyền" />
                    </div>
                    <div className="btn-update-delete-role">
                        <button className="btn-create-role" onClick={updateRole}>Cập nhật</button>
                        <button className="btn-create-role btn-delete-role" onClick={deleteRole}>Xóa</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="form-create-acc-Admin" style={showFormCre?{}:{top: "-1000px"}}>
            <div className="wrap-form-create-acc-admin">
                <h4>Tài khoản mới</h4>
                <input type="text" name="name" required placeholder="Tên tài khoản" value={account.name} onChange={onChangeInput} />
                <input type="email" name="email" required placeholder="Email" value={account.email} onChange={onChangeInput} />
                <input type="password" name="password" required autoComplete="on" 
                placeholder="Mật khẩu" value={account.password} onChange={onChangeInput} />
                <select value={account.role} name="role" onChange={onChangeInput}>
                    <option value={''}>Chọn phân quyền</option>
                    {
                        roles.map(role=>{
                            return <option key={role._id} value={role.role_id}>{role.name}</option>
                        })
                    }
                </select>
                <button className="btn-Create-admin" onClick={submitCreateAcc}>Thêm</button>
                <button className="btn-Close-admin" onClick={()=>setShowFormCre(false)}>Đóng</button>
            </div>
        </div>
    </div>
  )
}
