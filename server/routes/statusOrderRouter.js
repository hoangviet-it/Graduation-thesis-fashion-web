const router = require('express').Router()
const statusOrderCtrl = require('../controllers/statusOrderCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminOrder = require('../middleware/authAdminOrder')

router.route('/statusorder')
    .get(statusOrderCtrl.statusOrder)
    .post(auth, authAdminOrder, statusOrderCtrl.createStatusOrder)

router.route('/statusorder/:id')
    .put(auth, authAdminOrder, statusOrderCtrl.updateStatusOrder)
    .delete(auth, authAdminOrder, statusOrderCtrl.deleteStatusOrder)

module.exports = router