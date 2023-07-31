
const router = require('express').Router()
const orderCtrl = require('../controllers/orderCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authAdminOrder = require('../middleware/authAdminOrder')
const authShipper = require('../middleware/authShipper')


router.route('/order')
    .get(orderCtrl.getOrder)
    .post(auth, orderCtrl.createOrder)
    .patch(auth, orderCtrl.addDataProductOrder)

router.route('/order/:id')
    .delete(auth, authAdminOrder, orderCtrl.deleteProduct)
    .patch(auth, orderCtrl.updateOrder)

router.route('/myorder')
    .get(auth, orderCtrl.getMyOrder)

router.route('/check_order/:id')
    .put(auth, authAdminOrder, orderCtrl.updateCheckOrder)

router.route('/check_all_order')
    .put(auth, authAdminOrder, orderCtrl.updateCheckAll)

router.route('/cancel_check_order')
    .put(auth, authAdminOrder, orderCtrl.updateCancelCheck)

router.route('/update_order_date/:id')
    .put(auth, authAdminOrder, orderCtrl.updateOrder_Date)

// shipper cập nhật đơn hàng đã giao
router.route('/update_delivered/:id')
    .put(auth, authShipper, orderCtrl.updateDelivered)

router.route('/update_await_to_delivering')
    .put(auth, authAdminOrder, orderCtrl.updateAwaitToDelivering)

router.route('/update_order_browsing/:id')
    .put(auth, authAdminOrder, orderCtrl.updateOrderBrowsing)

router.route('/update_user_and_date_delivered/:id')
    .put(auth, authShipper, orderCtrl.updateUserAndDateDelivered)

router.route('/update_quantity_pro_order/:id')
    .put(auth, orderCtrl.updateQuantityProductOrder)

router.route('/update_quantity_create_order_cart')
    .put(auth, orderCtrl.updateQuantityOrderCart)

router.route('/update_quantity_reorder')
    .put(auth, orderCtrl.updateReorder)


module.exports = router