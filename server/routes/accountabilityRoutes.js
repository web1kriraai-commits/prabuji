const express = require('express');
const router = express.Router();
const accountabilityController = require('../controllers/accountabilityController');
const auth = require('../middleware/auth');
const { isAdmin, isCounselor, isCounselorOrAdmin } = require('../middleware/roleCheck');

// @route   POST api/accountability
// @desc    Submit accountability form
// @access  Private (authenticated users only)
router.post('/', auth, accountabilityController.submitAccountability);

// @route   GET api/accountability/my
// @desc    Get current user's accountability submissions
// @access  Private
router.get('/my', auth, accountabilityController.getMyAccountability);

// @route   GET api/accountability/user/:userId
// @desc    Get accountability submissions for a specific user
// @access  Private (user can view own, counselor can view assigned users, admin can view all)
router.get('/user/:userId', auth, accountabilityController.getUserAccountability);

// @route   GET api/accountability/my-users
// @desc    Get accountability submissions from all users assigned to the counselor
// @access  Private (counselor only)
router.get('/my-users', auth, isCounselor, accountabilityController.getCounselorUsersAccountability);

// @route   GET api/accountability/all
// @desc    Get all accountability submissions (with pagination)
// @access  Private (admin only)
router.get('/all', auth, isAdmin, accountabilityController.getAllAccountability);

module.exports = router;
