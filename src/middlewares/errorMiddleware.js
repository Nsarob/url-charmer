// Handle validation errors
exports.validationErrorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    next(err);
  };
  
  // Handle duplicate key errors
  exports.duplicateKeyErrorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    
    next(err);
  };
  
  // Global error handler
  exports.globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };