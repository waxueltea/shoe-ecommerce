const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All user routes require authentication
router.use(auth);

// Address routes
const addressValidation = [
  body('title').trim().notEmpty(),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone').isMobilePhone('tr-TR'),
  body('address_line1').trim().notEmpty(),
  body('address_line2').optional().trim(),
  body('city').trim().notEmpty(),
  body('state').optional().trim(),
  body('postal_code').trim().notEmpty(),
  body('country').optional().trim(),
  body('is_default').optional().isBoolean(),
];

router.get('/addresses', userController.getAddresses);
router.post('/addresses', addressValidation, validate, userController.createAddress);
router.put('/addresses/:id', addressValidation, validate, userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// Favorites routes
router.get('/favorites', userController.getFavorites);
router.post('/favorites', body('product_id').isInt(), validate, userController.addToFavorites);
router.delete('/favorites/:product_id', userController.removeFromFavorites);

module.exports = router;
