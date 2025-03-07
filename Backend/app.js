const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const urlRoutes = require('./models/User');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/urls', urlRoutes);

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

