const express = require('express');
const router = express.Router();
const {
    getTirthYatras,
    getTirthYatraById,
    createTirthYatra,
    updateTirthYatra,
    deleteTirthYatra
} = require('../controllers/tirthYatraController');

// So the import should be `../middleware/auth` probably.

// Correction based on directory listing:
// middleware/auth.js likely contains the auth middleware.
// middleware/roleCheck.js likely contains role checking.

const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const uploadCloudinary = require('../middleware/uploadCloudinary');

router.get('/', getTirthYatras);
router.get('/:id', getTirthYatraById);
router.post('/', authMiddleware, isAdmin, uploadCloudinary.single('image'), createTirthYatra);
router.post('/upload', authMiddleware, isAdmin, uploadCloudinary.single('image'), (req, res) => {
    console.log('Upload route hit');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('User:', req.user);
    console.log('File:', req.file);

    if (!req.file) {
        console.error('No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File uploaded to:', req.file.path);
    res.json({ imageUrl: req.file.path });
});
router.put('/:id', authMiddleware, isAdmin, uploadCloudinary.single('image'), updateTirthYatra);
router.delete('/:id', authMiddleware, isAdmin, deleteTirthYatra);

module.exports = router;
