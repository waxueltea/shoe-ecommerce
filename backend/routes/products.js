const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public routes
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProduct);
router.get('/:slug/related', productController.getRelatedProducts);

// Protected routes
const reviewValidation = [
  body('product_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').optional().trim(),
  body('comment').optional().trim(),
];

router.post('/reviews', auth, reviewValidation, validate, productController.createReview);

module.exports = router;
