const express = require('express');
const router = express.Router();
const Url = require('./models/Url');
const nanoid = require('nanoid');

router.post('/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;
    const shortCode = nanoid(6); // to enerate a 6-character short code
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    let url = await Url.findOne({ longUrl });
    if (url) {
      res.json({ shortUrl: url.shortUrl });
    } else {
      url = new Url({ userId: req.user?._id, shortCode, longUrl, shortUrl });
      await url.save();
      res.json({ shortUrl });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to shorten URL');
  }
});

router.get('/myurls', async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user?._id });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to fetch URLs');
  }
});

module.exports = router;
