const router = require('express').Router()
const reviewCtrl = require('../controllers/reviewCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/review')
    .get(reviewCtrl.reviews)
    .post(auth, reviewCtrl.createReview)
    
router.route('/review/:id')
    .delete(auth, reviewCtrl.deleteReview)

router.route('/check_review/:id')
    .put(auth, authAdmin, reviewCtrl.updateCheckReview)

router.route('/check_all_review')
    .put(auth, authAdmin, reviewCtrl.updateCheckAll)

router.route('/cancel_check_review')
    .put(auth, authAdmin, reviewCtrl.updateCancelCheck)

module.exports = router