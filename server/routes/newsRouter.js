
const router = require('express').Router()
const newsCtrl = require('../controllers/newsCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/news')
    .get(newsCtrl.getNews)
    .post(auth, authAdmin, newsCtrl.createNews)

router.route('/news/:id')
    .delete(auth, authAdmin, newsCtrl.deleteNews)
    .put(auth, authAdmin, newsCtrl.updateNews)

router.route('/view/:id')
    .put(newsCtrl.UpdateView)

router.route('/check_news/:id')
    .put(auth, authAdmin, newsCtrl.updateCheckNews)

router.route('/check_all_news')
    .put(auth, authAdmin, newsCtrl.updateCheckAll)

router.route('/cancel_check_news')
    .put(auth, authAdmin, newsCtrl.updateCancelCheck)

module.exports = router