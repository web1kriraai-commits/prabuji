const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const uploadRegistration = require('../middleware/uploadRegistration');
const {
    createRegistration,
    getAllRegistrations,
    getRegistrationsByYatra,
    getRegistrationById,
    updateRegistration,
    deleteRegistration
} = require('../controllers/yatraRegistrationController');

// Public route - anyone can register (with file uploads)
router.post('/', uploadRegistration.fields([
    { name: 'paymentScreenshot', maxCount: 1 },
    { name: 'aadhaarCards', maxCount: 20 }
]), createRegistration);

// Admin routes - order matters! More specific routes first
router.get('/', authMiddleware, isAdmin, getAllRegistrations);
router.get('/yatra/:yatraId', authMiddleware, isAdmin, getRegistrationsByYatra);
router.get('/:id', authMiddleware, isAdmin, getRegistrationById);
router.put('/:id', authMiddleware, isAdmin, updateRegistration);
router.delete('/:id', authMiddleware, isAdmin, deleteRegistration);

module.exports = router;
