// const Url = require('../model/urlModel');

// // @desc    Redirect to original URL
// // @route   GET /:code
// // @access  Public
// exports.redirectUrl = async (req, res) => {
//   try {
//     const { code } = req.params;

//     // Find URL in database
//     const url = await Url.findOne({ short_code: code });

//     if (!url) {
//       return res.status(404).render('notFound', {
//         message: 'The URL you are looking for does not exist'
//       });
//     }

//     // Increment click count
//     url.clicks += 1;

//     // Add analytics data
//     url.analytics.push({
//       timestamp: Date.now(),
//       ip: req.ip,
//       userAgent: req.headers['user-agent'],
//       referrer: req.headers.referer || req.headers.referrer
//     });

//     // Save changes
//     await url.save();

//     // Redirect to original URL
//     return res.redirect(url.long_url);
//   } catch (error) {
//     console.error('Redirect error:', error);
//     return res.status(500).render('error', {
//       message: 'Server error occurred during redirection'
//     });
//   }
// };


const Url = require("../model/urlModel");

// @desc    Redirect to original URL
// @route   GET /:code
// @access  Public
exports.redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    // Find URL in database
    const url = await Url.findOne({ short_code: code });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "The URL you are looking for does not exist",
      });
    }

    // Increment click count
    url.clicks += 1;

    // Add analytics data
    url.analytics.push({
      timestamp: Date.now(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer || req.headers.referrer,
    });

    // Save changes
    await url.save();

    // Redirect to original URL
    return res.redirect(url.long_url);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during redirection",
    });
  }
};