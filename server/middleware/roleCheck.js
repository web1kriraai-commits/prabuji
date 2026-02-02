// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied. Admin role required.' });
    }
};

// Middleware to check if user is a counselor
const isCounselor = (req, res, next) => {
    if (req.user && req.user.role === 'counselor') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied. Counselor role required.' });
    }
};

// Middleware to check if user is either a counselor or admin
const isCounselorOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'counselor' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied. Counselor or Admin role required.' });
    }
};

module.exports = {
    isAdmin,
    isCounselor,
    isCounselorOrAdmin
};
