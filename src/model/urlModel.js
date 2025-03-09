const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  short_code: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate
  },
  long_url: {
    type: String,
    required: [true, 'Long URL is required'],
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  clicks: {
    type: Number,
    default: 0
  },
  analytics: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    referrer: String
  }]
});

// Create index for faster lookups
urlSchema.index({ short_code: 1 });

module.exports = mongoose.model('Url', urlSchema);