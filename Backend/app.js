const { RateLimiterMemory } = require('rate-limiter-flexible');
const cors = require('cors');
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const urlRoutes = require('./models/User');
const urlRoutes = require('./routes/Urls');

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per minute
});
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json('Too many requests');
  }
};
const corsOptions = {
  origin: '*', // Allow all origins
  optionsSuccessStatus: 200,
};


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/urls', urlRoutes);


app.listen(3001, () => {
  console.log('Server listening on port 3001');
});


app.use(rateLimiterMiddleware);
app.use(cors(corsOptions));

