
const router = require('express').Router()
const useCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminOrder = require('../middleware/authAdminOrder')

router.post('/register', useCtrl.register)

router.post('/login', useCtrl.login)

router.get('/logout', useCtrl.logout)

router.get('/refresh_token', useCtrl.refreshToken)

router.get('/infor', auth, useCtrl.getUser)

router.patch('/addcart', auth, useCtrl.addCart)

router.patch('/updatepassword', auth, useCtrl.updatePassword)

router.get('/readuser', auth, authAdminOrder, useCtrl.readUser)

router.get('/read_admin', auth, authAdmin, useCtrl.readAdmin)

router.patch('/dissableuser/:id', auth, authAdmin, useCtrl.updateDissable)

router.delete('/deleteuser/:id', auth, authAdmin, useCtrl.deleteUser)

router.get('/userpayed', auth, authAdminOrder, useCtrl.getUserPayed)

router.get('/usernotpay', auth, authAdminOrder, useCtrl.getUserNotPay)

router.post('/register_admin', auth, authAdmin, useCtrl.registerAdmin)

router.put('/update_role_user/:id', auth, authAdmin, useCtrl.updateRoleForUser)

module.exports = router