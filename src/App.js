import './App.css';
import React, { useEffect, useState } from 'react';
import { appleButton, spotifyButton } from './styles';
import { getSpotifyTokenFromUrl, getLikedSongs, handleSpotifyAuth } from './spotifyApi';

function App() {
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);

  const [tracks, setTracks] = useState([]);

  // This useEffect hook checks for the Spotify token in the URL when the app first loads.
  // If the token is present, it sets the token state and sets the isSpotifyLoggedIn state to true.
  useEffect(() => {
    const token = getSpotifyTokenFromUrl();
    if (token) {
      setSpotifyToken(token);
      setIsSpotifyLoggedIn(true);
      console.log(token);
    }
  }, []);

  // This function is called when the "Get Liked Songs" button is clicked.
  // It calls the getLikedSongs function with the Spotify token to retrieve the user's liked songs.
  const handleGetLikedSongs = () => {
    getLikedSongs(spotifyToken);
  };

  return (
    <div className='App'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button style={spotifyButton} onClick={handleSpotifyAuth}>
          Click here to Authorize your Spotify account
        </button>
        {isSpotifyLoggedIn && (
          <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
            <button style={spotifyButton} onClick={handleGetLikedSongs}>
              get liked songs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
