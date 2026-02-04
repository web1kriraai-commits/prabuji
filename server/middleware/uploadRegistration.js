const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'yatra-registrations',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
    }
});

const uploadRegistration = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = uploadRegistration;
