const express = require('express');
const { check } = require('express-validator');
const { 
  shortenUrl, 
  getUrls, 
  getUrl, 
  updateUrl, 
  deleteUrl, 
  getUrlAnalytics 
} = require('../controller/urlController');
const { protect } = require('../middlewares/authMiddleware');
const { createUrlLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Shorten URL
router.post(
  '/shorten',
  createUrlLimiter,
  [
    check('longUrl', 'Long URL is required').notEmpty(),
    check('longUrl', 'Valid URL is required').isURL()
  ],
  shortenUrl
);

// Get all URLs
router.get('/', getUrls);

// Get URL by ID
router.get('/:id', getUrl);

// Update URL
router.put('/:id', updateUrl);

// Delete URL
router.delete('/:id', deleteUrl);

// Get URL analytics
router.get('/:id/analytics', getUrlAnalytics);

module.exports = router;