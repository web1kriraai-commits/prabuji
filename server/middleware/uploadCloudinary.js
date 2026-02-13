const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tirth-yatra',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
        // transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: Resize on upload
    }
});

const uploadCloudinary = multer({ storage: storage });

module.exports = uploadCloudinary;
