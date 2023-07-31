const router = require('express').Router()
const inforClientCtrl = require('../controllers/inforClientCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/inforclient')
    .get(auth, inforClientCtrl.inforClient)
    .post(auth, inforClientCtrl.createInforClient)
    .put(auth, inforClientCtrl.updateInforClient)
    .patch(auth, inforClientCtrl.updatePays)
    
router.route('/inforclient/:id')
    .delete(auth, inforClientCtrl.deleteInforClient)

module.exports = router