const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');

const app = express();
const PORT = 5000;

// Environment Variables
const CLIENT_ID = 'fef31600bc9a48c59304a7baca38e58e';  // Your Spotify Client ID
const CLIENT_SECRET = '07c89386cc4441af96da9f1b37499cb1';  // Your Spotify Client Secret
const REDIRECT_URI = 'http://localhost:5000/callback';  // Callback URL for Spotify

app.use(cors());
app.use(express.json());

// Spotify Login URL (Step 1: User logs in with Spotify)
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email playlist-read-private';
  const auth_query_parameters = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${auth_query_parameters}`);
});

// Spotify Callback (Step 2: Spotify redirects back after login)
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    // Exchange authorization code for access token and refresh token
    const response = await axios.post(tokenUrl, data, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = response.data;
    res.redirect(`http://localhost:5173?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during authentication');
  }
});

// Get Playlist Tracks (Step 3: Get playlist tracks using access token)
app.get('/playlist-tracks', async (req, res) => {
  const access_token = req.query.access_token;
  const playlist_id = req.query.playlist_id;

  if (!access_token || !playlist_id) {
    return res.status(400).send('Missing access_token or playlist_id');
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching playlist tracks');
  }
});

// Placeholder for storing ratings (in-memory for now)
let playlistRatings = {};
let songRatings = {};

// Save Playlist Rating
app.post('/rate-playlist', (req, res) => {
  const { playlist_id, rating } = req.body;
  if (!playlist_id || rating == null) {
    return res.status(400).send('Missing playlist_id or rating');
  }
  playlistRatings[playlist_id] = rating;
  res.json({ message: 'Playlist rating saved!', playlistRatings });
});

// Save Song Rating
app.post('/rate-song', (req, res) => {
  const { song_id, rating } = req.body;
  if (!song_id || rating == null) {
    return res.status(400).send('Missing song_id or rating');
  }
  songRatings[song_id] = rating;
  res.json({ message: 'Song rating saved!', songRatings });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
