const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accountability', require('./routes/accountabilityRoutes'));
app.use('/api/tirthyatra', require('./routes/tirthYatraRoutes'));
console.log('Routes loaded');

app.get('/', (req, res) => {
    res.send('API is running...');
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;
