const express = require('express');
const router = express.Router();
const { signup, signin, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router;
