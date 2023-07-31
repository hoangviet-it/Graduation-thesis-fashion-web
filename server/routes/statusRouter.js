const router = require('express').Router()
const statusCtrl = require('../controllers/statusCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')

router.route('/status')
    .get(statusCtrl.status)
    .post(auth, authAdminProduct, statusCtrl.createStatus)
    
router.route('/status/:id')
    .put(auth, authAdminProduct, statusCtrl.updateStatus)
    .delete(auth, authAdminProduct, statusCtrl.deleteStatus)

module.exports = router