const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/create-user
// @desc    Create user with specific role (Admin/Counselor only)
// @access  Private
router.post('/create-user', auth, authController.createUser);

// @route   GET api/auth/counselors
// @desc    Get all counselors (Admin only)
// @access  Private
router.get('/counselors', auth, authController.getCounselors);

module.exports = router;
