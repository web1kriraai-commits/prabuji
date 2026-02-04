const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://prabuji-5-u3jo.onrender.com', 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accountability', require('./routes/accountabilityRoutes'));
app.use('/api/tirthyatra', require('./routes/tirthYatraRoutes'));
app.use('/api/yatra-registration', require('./routes/yatraRegistrationRoutes'));
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
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;
