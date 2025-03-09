const express = require('express');
const { check } = require('express-validator');
const { 
  register, 
  login, 
  logout, 
  refreshToken, 
  getProfile 
} = require('../controller/authController');
const { protect, verifyRefreshToken } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
);

// Login route
router.post(
  '/login',
  authLimiter,
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// Logout route
router.post('/logout', protect, logout);

// Refresh token route
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Get user profile
router.get('/profile', protect, getProfile);

module.exports = router;