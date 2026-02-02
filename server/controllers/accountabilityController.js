const Accountability = require('../models/Accountability');
const User = require('../models/User');

// Submit accountability form
exports.submitAccountability = async (req, res) => {
    try {
        const {
            date,
            wakeupTime,
            chantingRounds,
            bookReading,
            deityPrayer,
            lectureBy,
            hearingMinutes,
            bedTime,
            individualVows
        } = req.body;

        // Validate required fields
        if (!date || !wakeupTime || !bedTime) {
            return res.status(400).json({ msg: 'Date, wakeup time, and bed time are required' });
        }

        // Create new accountability entry
        const accountability = new Accountability({
            userId: req.user.id,
            date,
            wakeupTime,
            chantingRounds: chantingRounds || 0,
            bookReading: bookReading || 0,
            deityPrayer: deityPrayer || '',
            lectureBy: lectureBy || [],
            hearingMinutes: hearingMinutes || 0,
            bedTime,
            individualVows: individualVows || ''
        });

        await accountability.save();

        res.json({
            msg: 'Accountability submitted successfully',
            accountability: {
                id: accountability._id,
                date: accountability.date,
                submittedAt: accountability.submittedAt
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get accountability submissions for a specific user
exports.getUserAccountability = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check permissions: users can only view their own, counselors can view their assigned users, admins can view all
        if (req.user.role === 'user' && req.user.id !== userId) {
            return res.status(403).json({ msg: 'Not authorized to view this user\'s accountability' });
        }

        if (req.user.role === 'counselor') {
            // Check if the user is assigned to this counselor
            const user = await User.findById(userId);
            if (!user || user.counselor?.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Not authorized to view this user\'s accountability' });
            }
        }

        const submissions = await Accountability.find({ userId })
            .sort({ date: -1 })
            .populate('userId', 'name email');

        res.json(submissions);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
};

// Get accountability submissions from all users assigned to the counselor
exports.getCounselorUsersAccountability = async (req, res) => {
    try {
        // Get all users assigned to this counselor
        const users = await User.find({ counselor: req.user.id }).select('_id');
        const userIds = users.map(u => u._id);

        // Get all accountability submissions from these users
        const submissions = await Accountability.find({ userId: { $in: userIds } })
            .sort({ date: -1, createdAt: -1 })
            .populate('userId', 'name email')
            .limit(100); // Limit to last 100 submissions

        res.json(submissions);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all accountability submissions (Admin only)
exports.getAllAccountability = async (req, res) => {
    try {
        const { limit = 100, skip = 0 } = req.query;

        const submissions = await Accountability.find()
            .sort({ date: -1, createdAt: -1 })
            .populate('userId', 'name email role counselor')
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Accountability.countDocuments();

        res.json({
            submissions,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user's own accountability submissions
exports.getMyAccountability = async (req, res) => {
    try {
        const submissions = await Accountability.find({ userId: req.user.id })
            .sort({ date: -1 });

        res.json(submissions);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
