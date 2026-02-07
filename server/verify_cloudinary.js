require('dotenv').config();
const cloudinary = require('./config/cloudinary');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    console.log('Testing Cloudinary configuration...');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set'}`);
    console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'}`);

    try {
        // Test 1: Upload a simple text string as a raw file (simulating a "file" upload)
        // We can't easily upload a buffer with the basic SDK upload method without stream, 
        // but we can upload a data URI.

        const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

        console.log('\nAttempting to upload a test image...');
        const imageResult = await cloudinary.uploader.upload(base64Image, {
            folder: 'test_uploads',
            resource_type: 'image'
        });
        console.log('✅ Image upload successful!');
        console.log('Image URL:', imageResult.secure_url);

        // Test 2: Upload a "PDF" (using raw resource type for test)
        // For strictly testing PDF handling in the middleware, we'd need to mock express/multer,
        // but here we just want to verify the credentials and account limits allow raw/auto.
        // We'll upload the same base64 but call it a PDF for the sake of checking resource_type: auto behavior if possible,
        // but cloudinary.uploader.upload behavior differs from multer-storage-cloudinary.
        // Let's just verify we can upload "raw" type.

        console.log('\nAttempting to upload a raw file...');
        const rawResult = await cloudinary.uploader.upload(base64Image, { // Using image data but treating as raw
            folder: 'test_uploads',
            resource_type: 'raw',
            public_id: 'test_file.txt'
        });
        console.log('✅ Raw file upload successful!');
        console.log('Raw URL:', rawResult.secure_url);

        // Cleanup
        console.log('\nCleaning up test files...');
        await cloudinary.uploader.destroy(imageResult.public_id);
        await cloudinary.uploader.destroy(rawResult.public_id, { resource_type: 'raw' });
        console.log('✅ Cleanup successful!');

    } catch (error) {
        console.error('❌ Upload failed:', error);
    }
}

testUpload();
