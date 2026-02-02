const express = require('express');
const router = express.Router();
const User = require('../models/User');

const auth = require('../middleware/auth');

// @route   GET api/users/counselors
// @desc    Get all counselors (for admin dropdown)
// @access  Private
router.get('/counselors', auth, async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor' })
            .select('name email')
            .sort({ name: 1 });
        res.json(counselors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/users
// @desc    Get all users (Role based access)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let users;
        // Verify role
        if (req.user.role === 'admin') {
            users = await User.find().select('-password').populate('counselor', 'name email').sort({ createdAt: -1 });
        } else if (req.user.role === 'counselor') {
            users = await User.find({ counselor: req.user.id }).select('-password').sort({ createdAt: -1 });
        } else {
            return res.status(403).json({ msg: 'Not authorized to view users list' });
        }
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
