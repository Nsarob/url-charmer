const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const mongoose = require('mongoose');

let Token;

try {
  Token = mongoose.model('Token');
} catch (error) {
  console.log(error);
  if (error.name === 'MissingSchemaError') {
    const tokenSchema = new mongoose.Schema({
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      token: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['refresh', 'blacklisted'],
        required: true
      },
      expires: {
        type: Date,
        required: true
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    });

    // Create index for faster lookups and expiry
    tokenSchema.index({ token: 1 });
    tokenSchema.index({ user_id: 1 });
    tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

    Token = mongoose.model('Token', tokenSchema);
  } else {
    throw error;
  }
}

const protect = async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  let refreshToken;

  if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    req.user = await User.findById(decoded.id);
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }
}

// Export the Token model as well
module.exports = {
  Token,
  protect,
  verifyRefreshToken
};