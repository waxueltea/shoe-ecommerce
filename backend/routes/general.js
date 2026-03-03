const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const generalController = require('../controllers/generalController');
const validate = require('../middleware/validate');

router.get('/categories', generalController.getCategories);
router.get('/banners', generalController.getBanners);
router.get('/settings', generalController.getSettings);

const couponValidation = [
  body('code').trim().notEmpty(),
  body('subtotal').isFloat({ min: 0 }),
];

router.post('/validate-coupon', couponValidation, validate, generalController.validateCoupon);

module.exports = router;
