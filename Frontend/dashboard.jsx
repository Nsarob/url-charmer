import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/urls', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUrls(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUrls();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {urls.map((url) => (
          <li key={url.shortCode}>{url.shortCode}</li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
