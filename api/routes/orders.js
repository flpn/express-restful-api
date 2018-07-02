const express = require('express')

const router = express.Router()

const OrderController = require('../controllers/order')

router.get('/', OrderController.get_all_orders)
router.get('/:orderId', OrderController.get_order)
router.post('/', OrderController.create_order)
router.put('/:orderId', OrderController.update_order)
router.delete('/:orderId', OrderController.delete_order)


module.exports = router
