const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://prabuji-5-u3jo.onrender.com', 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accountability', require('./routes/accountabilityRoutes'));
app.use('/api/tirthyatra', require('./routes/tirthYatraRoutes'));
app.use('/api/yatra-registration', require('./routes/yatraRegistrationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
console.log('Routes loaded');

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// 404 handler (optional - mostly for API if placed before catch-all, but here catch-all takes precedence for GET)
// For non-GET requests or if static file fails? 
// Actually, `app.get('*')` only catches GET. POST to unknown will fall through.
// 404 handler
app.use((req, res, next) => {
    // Only return 404 for API routes or if static file not found and not an API route (which should be handled by catch-all above if GET)
    // But catch-all above handles GET *, so this only runs for non-GET * or if next() called.
    // However, the catch-all is app.get(/.*/), so it only catches GET.
    // For POST/PUT/DELETE to unknown routes:
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
