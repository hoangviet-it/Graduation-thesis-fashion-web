const router = require('express').Router()
const notifyCtrl = require('../controllers/notifyCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/notify')
    .get(notifyCtrl.getNotify)
    .post(notifyCtrl.createNotify)

router.route('/update_neworder/:id')
    .put(auth, notifyCtrl.updateNewOrder)

router.route('/update_newreview/:id')
    .put(auth, notifyCtrl.updateNewReview)

router.route('/update_slide/:id')
    .put(auth,authAdmin, notifyCtrl.updateSlide)

router.route('/update_discount/:id')
    .put(auth,authAdmin, notifyCtrl.updateDiscount)

router.route('/update_cancelorder/:id')
    .put(auth, notifyCtrl.updateCancelOrder)

router.route('/update_idCategory/:id')
    .put(auth,authAdmin, notifyCtrl.updateIdCategory)

router.route('/update_intro/:id')
    .put(auth,authAdmin, notifyCtrl.updateIntro)

router.route('/update_policy/:id')
    .put(auth,authAdmin, notifyCtrl.updatePolicy)

router.route('/update_rules/:id')
    .put(auth,authAdmin, notifyCtrl.updateRules)

router.route('/update_intruct/:id')
    .put(auth,authAdmin, notifyCtrl.updateInstruct)

router.route('/updateImageSlide/:id')
    .put(auth,authAdmin, notifyCtrl.updateCtrlSlide)

module.exports = router