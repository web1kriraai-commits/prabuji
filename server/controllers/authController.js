const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret', // Fallback to 'secret' if env not set, though env is preferred
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create User (for testing - creates users with specific roles)
// Create User (Admin or Counselor creating users)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, counselorId } = req.body;

        // Helper to check permissions - assuming middleware adds req.user
        // If this is called from an authenticated route, req.user will exist
        // If specialized testing route usage, might not have req.user, be careful.
        // For this implementation, we assume this stays a protected controller function.

        const creatorRole = req.user ? req.user.role : 'admin'; // Fallback for dev/test without auth middleware if used loosely
        const creatorId = req.user ? req.user.id : null;

        // Validation based on Creator Role
        let newRole = 'user';
        let assignedCounselor = null;

        if (creatorRole === 'admin') {
            // Admin can create any role
            if (role) {
                if (!['user', 'counselor', 'admin'].includes(role)) {
                    return res.status(400).json({ msg: 'Invalid role' });
                }
                newRole = role;
            }
            // If Admin creates a USER, they can assign a counselor OR become the counselor themselves
            if (newRole === 'user') {
                if (counselorId) {
                    assignedCounselor = counselorId;
                } else {
                    // If no counselorId provided, admin becomes the counselor
                    assignedCounselor = creatorId;
                }
            }
        } else if (creatorRole === 'counselor') {
            // Counselor can ONLY create users
            if (role && role !== 'user') {
                return res.status(403).json({ msg: 'Counselors can only create users' });
            }
            newRole = 'user';
            // "when counsiler create user so user creatre under that"
            assignedCounselor = creatorId;
        } else {
            return res.status(403).json({ msg: 'Not authorized to create users' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: newRole,
            counselor: assignedCounselor
        });

        await user.save();

        res.json({
            msg: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                counselor: user.counselor
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Counselors (For Admin Dropdown)
exports.getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor' }).select('-password');
        res.json(counselors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

