const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tirth-yatra',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }] // Resize huge images but keep banner quality
    }
});

const uploadCloudinary = multer({ storage: storage });

module.exports = uploadCloudinary;
