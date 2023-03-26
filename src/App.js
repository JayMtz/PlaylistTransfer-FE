import './App.css';
import React, { useEffect, useState } from 'react';
import { appleButton, spotifyButton } from './styles';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
function App() {
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null)

  useEffect( () =>{
    const token = getSpotifyTokenFromUrl();
    if (token){
      setSpotifyToken(token)
      setIsSpotifyLoggedIn(true);
      console.log(token)
    }
  }
  );

  const handleSpotifyAuth = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId ='8f294d8899f94e34b7690db17fe12fc9';
    const scopes = ['user-library-read'];
    const redirectUri = 'http://localhost:3000/callback/';
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    window.location = authUrl;
    setIsSpotifyLoggedIn(true);
    //???kkk
    
    
  }
  
  const getSpotifyTokenFromUrl = () =>{
    const hash = window.location.hash;
    const token = hash.substring(1).split('&')[0].split('=')[1];
    return token
  }

  const getLikedSongs = () => {
    const token = getSpotifyTokenFromUrl();
    spotifyApi.setAccessToken(token);
  
    const getAllTracks = async (offset = 0) => {
      const response = await spotifyApi.getMySavedTracks({ offset });
      const tracks = response.items.map(item => ({
        name: item.track.name,
        artist: item.track.artists[0].name
      }));
  
      if (response.next) {
        // recursively get the next page of tracks
        const nextTracks = await getAllTracks(offset + response.limit);
        return [...tracks, ...nextTracks];
      }
  
      return tracks;
    };
  
    getAllTracks()
      .then(tracks => {
        console.log(tracks);
        // do something with the songs
      })
      .catch(error => console.log(error));
  };
  

  return (
    <div className='App'>
      <div style={
        { display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        justifyContent: 'center', 
        alignItems: 'center' 
        }}>

     <button style ={spotifyButton} onClick = {handleSpotifyAuth}>
      spotifyAuth
     </button>
     {isSpotifyLoggedIn && (
        <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <button style={appleButton} onClick = {getLikedSongs}>get liked songs</button>
        </div>
      )}
      
      

     </div>
    </div>
  )
      };


export default App;
