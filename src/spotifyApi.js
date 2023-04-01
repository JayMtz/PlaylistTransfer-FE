// create an instance of the SpotifyWebApi
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// function to handle Spotify authentication
export const handleSpotifyAuth = () => {
  // set up the authentication endpoint, client ID, scopes, redirect URI, and URL to open for authentication
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = '8f294d8899f94e34b7690db17fe12fc9';
  const scopes = ['user-library-read', 'playlist-modify-public', 'playlist-modify-private'];
  const redirectUri = 'http://localhost:3000/callback/';
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  // open the URL to authenticate the user
  window.location = authUrl;
}
// function to get the Spotify access token from the URL
export const getSpotifyTokenFromUrl = () => {
  const hash = window.location.hash;
  const token = hash.substring(1).split('&')[0].split('=')[1];
  return token;
};

// function to get the user's liked songs from Spotify
export const getLikedSongs = async (token) => {
  // set the access token for the SpotifyWebApi instance
  spotifyApi.setAccessToken(token);

  try {
    // get the user ID
    const userId = await getUserId(token);

    // function to get all of the user's liked tracks
    const getAllTracks = async (offset = 0) => {
      const response = await spotifyApi.getMySavedTracks({ offset });
      // map the response to an array of objects containing the track name, artist name, and user ID
      const tracks = response.items.map((item) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        userId: userId,
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

    // get all of the user's liked tracks
    const tracks = await getAllTracks();

    console.log(tracks); // log the tracks to the console for debugging purposes

    // send the tracks to the backend endpoint using fetch
    const response = await fetch('http://localhost:4000/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tracks),
    });

    console.log('Data sent successfully:', response);

    const data = await response.json();
    console.log('Data received:', data); // <-- Log the response data to the console

    return data;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};




// function to create a new playlist
export const createPlaylist = async (token) => {
  // set the access token for the SpotifyWebApi instance
  spotifyApi.setAccessToken(token);
  try {
    // get the user ID
    const { id } = await spotifyApi.getMe();
    console.log('User ID:', id);
    
    // create the new playlist with the name "testplaylist" and set it to be private
    const response = await spotifyApi.createPlaylist(id, {
      name: 'Apple Music songs',
      public: false
    });
    console.log('Playlist created:', response);
  } catch (error) {
    console.log('Error creating playlist:', error);
  }
};


export const getUserId = async (token) => {
  // set the access token for the SpotifyWebApi instance
  spotifyApi.setAccessToken(token);
  try {
    // get the user ID
    const { id } = await spotifyApi.getMe();
    console.log('User ID:', id);
    return id;
  } catch (error) {
    console.log('Error getting user ID:', error);
  }
};



