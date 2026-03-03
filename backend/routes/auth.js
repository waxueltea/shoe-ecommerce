const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone').optional().isMobilePhone('tr-TR'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const updateProfileValidation = [
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone').optional().isMobilePhone('tr-TR'),
];

const changePasswordValidation = [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }),
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, updateProfileValidation, validate, authController.updateProfile);
router.put('/change-password', auth, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
