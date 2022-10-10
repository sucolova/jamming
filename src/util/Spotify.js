let token;
const clientID = '636dfc0f06d648c1bebf682b8b2a50a5';
//const redirectURL = 'http://localhost:3000/';
const redirectURL = 'https://joyful-tapioca-10289f.netlify.app/'
let expirationTime = Number(sessionStorage.getItem('expirationTime'));
let href = sessionStorage.getItem('href');

const spotify = {

  // check if token is in href
  // if not return
  // if it is, set session const to expiration date + dateNow
  //
  // for reload : 
  //  - check if href is the same,
  //    - if not: new session const
  //    - if same : setTimeout datenow + exp - datenw
  checkLoginState() {
    // if there is no accesToken, return
    if (!window.location.href.match(/access_token=([^&]*)/) && !window.location.href.match(/expires_in=([^&]*)/)) {
      console.log('no token in href');
      return;
    }  
    if (window.location.href === href) { // if reload and href stayed the same, start setTimeout again
      console.log('site reload, timer restart');
      window.setTimeout(() => {
        token = ''; 
        window.history.pushState('Acces Token', null, '/');
        sessionStorage.removeItem('href');
        sessionStorage.removeItem('expirationTime');
      }, expirationTime - Date.now());
    }
    if (window.location.href !== href) { // if href changed after site reload, set new expirationTime and start timeout
      console.log('new Accestoken, timer Starts');
      expirationTime = window.location.href.match(/expires_in=([^&]*)/);
      expirationTime = Number(expirationTime[1]) * 1000 + Date.now();
      sessionStorage.setItem('expirationTime', expirationTime);
      window.setTimeout(() => {
        token = ''; 
        window.history.pushState('Acces Token', null, '/');
        sessionStorage.removeItem('href');
        sessionStorage.removeItem('expirationTime');
      }, expirationTime - Date.now());
      href = window.location.href;
      sessionStorage.setItem('href', href);
    }
  },

  getAccesToken() {
    if (token) return token;
    if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      token = window.location.href.match(/access_token=([^&]*)/);
      token = token[1];
      return token;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
    }
  },

  search(term) {
    const accesToken = spotify.getAccesToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accesToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    })

  },

  savePlaylist(playlistName, trackURIsArray) {
    if(!playlistName && !trackURIsArray) return; 
    const accesToken = token;
    const options = {
      headers: {
        Authorization: `Bearer ${accesToken}` 
      },
      method: 'POST',
      name: 'test'
    };
    const headers = options.headers;
    let userID; 
    fetch(`https://api.spotify.com/v1/me`, {headers}).then( response => {
      return response.json();
    }).then(jsonResponse => {
      return jsonResponse.id;
    }).then(jsonResponseId => {
      userID = jsonResponseId;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify({name: playlistName}) 
        })
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse.id);
      return jsonResponse.id;
    }).then(playlistID => {
      fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify({uris: trackURIsArray})
        })
    })
  }
};


export default spotify;
