require('dotenv').config();
const express = require('express');
const uploadRegistration = require('./middleware/uploadRegistration');
const path = require('path');
const fs = require('fs');

const app = express();

// Dummy route to test upload
app.post('/test-upload', uploadRegistration.single('testFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({
        message: 'File uploaded successfully',
        file: req.file
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error in middleware:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = 5050;
const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
});

// Handle graceful shutdown for the purpose of the test script
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
