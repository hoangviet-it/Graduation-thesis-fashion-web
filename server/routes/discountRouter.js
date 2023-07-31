const router = require('express').Router()
const discountCtrl = require('../controllers/discountCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')

router.route('/discount')
    .get(discountCtrl.discounts)
    .post(auth, authAdminProduct, discountCtrl.createDiscount)
    
router.route('/discount/:id')
    .put(auth, authAdminProduct, discountCtrl.updateDiscount)
    .delete(auth, authAdminProduct, discountCtrl.deleteDiscount)

module.exports = router