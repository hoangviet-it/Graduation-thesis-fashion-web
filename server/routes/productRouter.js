
const router = require('express').Router()
const productCtrl = require('../controllers/producCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(auth, authAdminProduct, productCtrl.createProduct)

router.route('/products/:id')
    .delete(auth, authAdminProduct, productCtrl.deleteProduct)
    .put(auth, authAdminProduct, productCtrl.updateProduct)

router.route('/priceLT100000')
    .get(productCtrl.getPriceLT100000)

router.route('/price_IN100_IN199')
    .get(productCtrl.getPrice_IN100_IN199)

router.route('/priceL_IN200_IN500')
    .get(productCtrl.getPrice_IN200_IN500)

router.route('/priceGT500')
    .get(productCtrl.getPriceGT500)

router.route('/discountProduct')
    .get(productCtrl.getDiscountPro)

router.route('/check_products/:id')
    .put(auth, authAdminProduct, productCtrl.updateCheckDeleteAll)

router.route('/check_all')
    .put(auth, authAdminProduct, productCtrl.updateCheckAll)

router.route('/cancel_check')
    .put(auth, authAdminProduct, productCtrl.updateCancelCheck)

module.exports = router