const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All order routes require authentication
router.use(auth);

const createOrderValidation = [
  body('shipping_address_id').isInt(),
  body('billing_address_id').optional().isInt(),
  body('coupon_code').optional().trim(),
  body('notes').optional().trim(),
];

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/', createOrderValidation, validate, orderController.createOrder);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
