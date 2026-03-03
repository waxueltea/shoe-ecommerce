const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All cart routes require authentication
router.use(auth);

const addToCartValidation = [
  body('variant_id').isInt(),
  body('quantity').optional().isInt({ min: 1 }),
];

const updateCartValidation = [
  body('quantity').isInt({ min: 1 }),
];

router.get('/', cartController.getCart);
router.post('/', addToCartValidation, validate, cartController.addToCart);
router.put('/:id', updateCartValidation, validate, cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;
