const router = require('express').Router()
const objectCategoryCtrl = require('../controllers/objectCategoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminProduct = require('../middleware/authAdminProduct')


router.route('/object_category')
    .get(objectCategoryCtrl.objsctCategorys)
    .post(auth, authAdminProduct, objectCategoryCtrl.createObjsctCategory)

router.route('/object_category/:id')
    .delete(auth, authAdminProduct, objectCategoryCtrl.deleteObjsctCategory)
    .put(auth, authAdminProduct, objectCategoryCtrl.updateObjsctCategory)


module.exports = router