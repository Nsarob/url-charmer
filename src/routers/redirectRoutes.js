const express = require('express');
const { redirectUrl } = require('../controller/redirectController');
const { redirectLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// Redirect route
router.get('/:code', redirectLimiter, redirectUrl);

module.exports = router;