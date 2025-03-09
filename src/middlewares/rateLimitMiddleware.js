const rateLimit = require('express-rate-limit');

// Create URL rate limiter for abuse
exports.createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 URL creations per hour
  message: 'Too many URLs created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiter - prevent brute force attacks
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per 15 minutes
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Redirect rate limiter - prevent abuse of redirects
exports.redirectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 redirects per minute
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
});