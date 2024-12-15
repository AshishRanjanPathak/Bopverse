import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './App.css';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlistRatings, setPlaylistRatings] = useState({});
  const [songRatings, setSongRatings] = useState({});
  const [profilePic, setProfilePic] = useState('');

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, [location]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const userProfilePic = response.data.images[0]?.url || '';
          const defaultProfilePic =
            'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
          setProfilePic(userProfilePic || defaultProfilePic);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setPlaylists(response.data.items);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    }
  }, [accessToken]);

  const fetchPlaylistTracks = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    axios
      .get(
        `http://localhost:5000/playlist-tracks?access_token=${accessToken}&playlist_id=${playlistId}`
      )
      .then((response) => {
        setTracks(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching playlist tracks:', error);
      });
  };

  const ratePlaylist = (playlistId, rating) => {
    if (!rating) {
      alert('Please provide a rating for the playlist');
      return;
    }

    setPlaylistRatings({
      ...playlistRatings,
      [playlistId]: rating,
    });

    axios
      .post('http://localhost:5000/rate-playlist', {
        playlist_id: playlistId,
        rating,
      })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error('Error rating playlist:', error);
      });
  };

  const rateSong = (songId, rating) => {
    if (!rating) {
      alert('Please provide a rating for the song');
      return;
    }

    setSongRatings({
      ...songRatings,
      [songId]: rating,
    });

    axios
      .post('http://localhost:5000/rate-song', { song_id: songId, rating })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error('Error rating song:', error);
      });
  };

  const login = () => {
    window.location.href = 'http://localhost:5000/login';
  };

  return (
    <div className="App">
      <h1 className="website-title">BopVerse</h1>
      {!accessToken ? (
        <button onClick={login} className="login-btn">
          Login with Spotify
        </button>
      ) : (
        <div>
          <div className="profile-container">
            <img src={profilePic} alt="User Profile" className="profile-img" />
            <h2>Welcome to BopVerse!</h2>
          </div>
          <h1>Your Playlists</h1>
          <div className="playlists-container">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <h3>{playlist.name}</h3>
                  <button
                    onClick={() => fetchPlaylistTracks(playlist.id)}
                    className="view-btn"
                  >
                    View Tracks
                  </button>
                  <div className="playlist-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          playlistRatings[playlist.id] >= star ? 'selected' : ''
                        }`}
                        onClick={() => ratePlaylist(playlist.id, star)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  {selectedPlaylistId === playlist.id && (
                    <div className="tracks-container">
                      {tracks.length > 0 ? (
                        tracks.map((track) => (
                          <div key={track.track.id} className="track-card">
                            <p>
                              {track.track.name} -{' '}
                              {track.track.artists
                                .map((artist) => artist.name)
                                .join(', ')}
                            </p>
                            <div className="track-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`star ${
                                    songRatings[track.track.id] >= star
                                      ? 'selected'
                                      : ''
                                  }`}
                                  onClick={() => rateSong(track.track.id, star)}
                                >
                                  &#9733;
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No tracks to show</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Loading playlists...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
