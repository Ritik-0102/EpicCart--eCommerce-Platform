// Authentication routing: user registration, login, and profile access
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints for account creation and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected endpoint to retrieve the current user's profile
router.get('/profile', protect, getProfile);

module.exports = router;
