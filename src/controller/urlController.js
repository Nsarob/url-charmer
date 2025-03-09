const Url = require('../model/urlModel');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const validUrl = require('valid-url');

// @desc    Shorten a URL
// @route   POST /api/urls/shorten
// @access  Private
exports.shortenUrl = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { longUrl, customCode } = req.body;

    // Check if URL is valid
    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Generate or use custom short code
    let shortCode = customCode || shortid.generate();

    // Check if custom code already exists
    if (customCode) {
      const existingUrl = await Url.findOne({ short_code: customCode });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: 'Custom code already in use'
        });
      }
    }

    // Check if URL already exists for this user
    const existingUrl = await Url.findOne({
      user_id: req.user._id,
      long_url: longUrl
    });

    if (existingUrl) {
      return res.status(200).json({
        success: true,
        message: 'URL already shortened',
        data: {
          id: existingUrl._id,
          shortCode: existingUrl.short_code,
          longUrl: existingUrl.long_url,
          shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.short_code}`,
          clicks: existingUrl.clicks,
          createdAt: existingUrl.created_at
        }
      });
    }

    // Create new URL
    const url = await Url.create({
      user_id: req.user._id,
      short_code: shortCode,
      long_url: longUrl
    });

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        id: url._id,
        shortCode: url.short_code,
        longUrl: url.long_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
        clicks: url.clicks,
        createdAt: url.created_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while shortening URL',
      error: error.message
    });
  }
};

// @desc    Get all URLs for a user
// @route   GET /api/urls
// @access  Private
exports.getUrls = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get URLs for user
    const urls = await Url.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Url.countDocuments({ user_id: req.user._id });

    // Format response
    const formattedUrls = urls.map(url => ({
      id: url._id,
      shortCode: url.short_code,
      longUrl: url.long_url,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
      clicks: url.clicks,
      createdAt: url.created_at
    }));

    res.status(200).json({
      success: true,
      count: urls.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: formattedUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching URLs',
      error: error.message
    });
  }
};

// @desc    Get URL details
// @route   GET /api/urls/:id
// @access  Private
exports.getUrl = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: url._id,
        shortCode: url.short_code,
        longUrl: url.long_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
        clicks: url.clicks,
        createdAt: url.created_at,
        analytics: url.analytics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching URL details',
      error: error.message
    });
  }
};

// @desc    Update URL
// @route   PUT /api/urls/:id
// @access  Private
exports.updateUrl = async (req, res) => {
  try {
    const { customCode, longUrl } = req.body;

    // Validate URL if provided
    if (longUrl && !validUrl.isUri(longUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Check if URL exists
    let url = await Url.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // If custom code is being changed, check if it's already in use
    if (customCode && customCode !== url.short_code) {
      const existingUrl = await Url.findOne({ short_code: customCode });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: 'Custom code already in use'
        });
      }
    }

    // Update URL
    if (customCode) url.short_code = customCode;
    if (longUrl) url.long_url = longUrl;

    await url.save();

    res.status(200).json({
      success: true,
      message: 'URL updated successfully',
      data: {
        id: url._id,
        shortCode: url.short_code,
        longUrl: url.long_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
        clicks: url.clicks,
        createdAt: url.created_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating URL',
      error: error.message
    });
  }
};

// @desc    Delete URL
// @route   DELETE /api/urls/:id
// @access  Private
exports.deleteUrl = async (req, res) => {
  try {
    // Check if URL exists
    const url = await Url.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Delete URL
    await url.remove();

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting URL',
      error: error.message
    });
  }
};

// @desc    Get URL analytics
// @route   GET /api/urls/:id/analytics
// @access  Private
exports.getUrlAnalytics = async (req, res) => {
    try {
      const url = await Url.findOne({
        _id: req.params.id,
        user_id: req.user._id
      });
  
      if (!url) {
        return res.status(404).json({
          success: false,
          message: 'URL not found'
        });
      }
  
      // Process analytics data
      const lastSevenDays = new Date();
      lastSevenDays.setDate(lastSevenDays.getDate() - 7);
  
      // Filter analytics for last 7 days
      const recentClicks = url.analytics.filter(
        entry => new Date(entry.timestamp) >= lastSevenDays
      );
  
      // Group clicks by day
      const clicksByDay = {};
      recentClicks.forEach(click => {
        const day = new Date(click.timestamp).toISOString().split('T')[0];
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
      });
  
      // Convert to array format for frontend charts
      const dailyClicks = Object.keys(clicksByDay).map(day => ({
        date: day,
        clicks: clicksByDay[day]
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Count unique IPs (unique visitors)
      const uniqueVisitors = new Set(recentClicks.map(click => click.ip)).size;
  
      // Count referrers
      const referrers = {};
      recentClicks.forEach(click => {
        if (click.referrer) {
          const domain = new URL(click.referrer).hostname;
          referrers[domain] = (referrers[domain] || 0) + 1;
        }
      });
  
      // Convert referrers to array
      const topReferrers = Object.keys(referrers).map(domain => ({
        domain,
        count: referrers[domain]
      })).sort((a, b) => b.count - a.count).slice(0, 5);
  
      // Count browser/devices
      const browsers = {};
      recentClicks.forEach(click => {
        if (click.userAgent) {
          const browser = getBrowserInfo(click.userAgent);
          browsers[browser] = (browsers[browser] || 0) + 1;
        }
      });
  
      // Convert browsers to array
      const browserStats = Object.keys(browsers).map(browser => ({
        browser,
        count: browsers[browser]
      })).sort((a, b) => b.count - a.count);
  
      res.status(200).json({
        success: true,
        data: {
          totalClicks: url.clicks,
          recentClicks: recentClicks.length,
          uniqueVisitors,
          dailyClicks,
          topReferrers,
          browserStats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error while fetching analytics',
        error: error.message
      });
    }
  };
  
  // Helper function to extract browser info from user agent
  const getBrowserInfo = (userAgent) => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
    return 'Other';
  };