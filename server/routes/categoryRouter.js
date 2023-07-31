
const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')


router.route('/category')
    .get(categoryCtrl.categories)
    .post(auth, authAdminProduct, categoryCtrl.createCategory)

router.route('/category/:id')
    .delete(auth, authAdminProduct, categoryCtrl.deleteCategory)
    .put(auth, authAdminProduct, categoryCtrl.updateCategory)


module.exports = router