// create an instance of the SpotifyWebApi
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// function to handle Spotify authentication
export const handleSpotifyAuth = () => {
  // set up the authentication endpoint, client ID, scopes, redirect URI, and URL to open for authentication
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = '8f294d8899f94e34b7690db17fe12fc9';
  const scopes = ['user-library-read'];
  const redirectUri = 'http://localhost:3000/callback/';
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  // open the URL to authenticate the user
  window.location = authUrl;
};

// function to get the Spotify access token from the URL
export const getSpotifyTokenFromUrl = () => {
  const hash = window.location.hash;
  const token = hash.substring(1).split('&')[0].split('=')[1];
  return token;
};

// function to get the user's liked songs from Spotify
export const getLikedSongs = (token) => {
  // set the access token for the SpotifyWebApi instance
  spotifyApi.setAccessToken(token);
  
  // function to get all of the user's liked tracks
  const getAllTracks = async (offset = 0) => {
    const response = await spotifyApi.getMySavedTracks({ offset });
    // map the response to an array of objects containing the track name and artist name
    const tracks = response.items.map((item) => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
    }));
    
    // check if there are more tracks to get
    if (response.next) {
      // recursively get the next page of tracks
      const nextTracks = await getAllTracks(offset + response.limit);
      // concatenate the current page of tracks with the next page of tracks
      return [...tracks, ...nextTracks];
    }
  
    return tracks;
  };
  
  // call the getAllTracks function and log the tracks to the console
  getAllTracks()
    .then((tracks) => {
      console.log(tracks); // log the tracks to the console for debugging purposes
      // send the tracks to the backend endpoint using fetch
      fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tracks),
      })
        .then((response) => {
          console.log('Data sent successfully:', response);
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        });
    })
    .catch((error) => console.log(error));
};