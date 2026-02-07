const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Auto-detect resource type (image, video, raw/pdf)
        const isPdf = file.mimetype === 'application/pdf';

        return {
            folder: 'yatra-registrations',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
            // Apply transformation only for images
            transformation: isPdf ? undefined : [{ width: 1200, height: 1200, crop: 'limit' }]
        };
    }
});

const uploadRegistration = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = uploadRegistration;
