const router = require('express').Router()
const roleCtrl = require('../controllers/roleCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/role')
    .get(auth, authAdmin, roleCtrl.getRole)
    .post(auth, authAdmin, roleCtrl.createRole)

router.route('/role/:id')
    .put(auth, authAdmin, roleCtrl.updateRole)
    .delete(auth, authAdmin, roleCtrl.deleteRole)

module.exports = router