const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route - anyone can submit a message
router.post('/', contactController.submitMessage);

// Admin routes - require authentication (to be added later if needed)
router.get('/', contactController.getAllMessages);
router.put('/:id', contactController.updateMessageStatus);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;
