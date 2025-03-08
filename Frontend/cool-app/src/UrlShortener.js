import React, { useState } from 'react';
import axios from 'axios';

function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/urls/shorten', { longUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      alert('Failed to shorten URL');
    }
  };

  return (
    <div>
      <form onSubmit={handleShorten}>
        <input type="text" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="Long URL" />
        <button type="submit">Shorten</button>
        {shortUrl && <p>Short URL: {shortUrl}</p>}
      </form>
    </div>
  );
}

export default UrlShortener;
