// setstate playlistName updated nicht den bildschirmn
// aribnb und refractoring
// bonus challange

import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';
import spotify from '../../util/Spotify.js';

class App extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    searchResults: [],
    playlistName: 'new Playlist',
    playlistTracks: []
  };
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
}

addTrack(track) {
  if (!this.state.playlistTracks.some((object) => object.id === track.id)) {
    const newPlaylist = this.state.playlistTracks;
    newPlaylist.push(track);
    this.setState({ playlistTracks: newPlaylist });
  } else {
    return
  }
}

removeTrack(track) {
  let newPlaylist = this.state.playlistTracks;
  newPlaylist = newPlaylist.filter(song => song.id !== track.id);
  this.setState({playlistTracks: newPlaylist});
}

updatePlaylistName(name) {
  this.setState({playlistName: name})
}

savePlaylist() {
  const trackURIs = this.state.playlistTracks.map(track => track.uri);
  spotify.savePlaylist(this.state.playlistName, trackURIs);
  this.setState(
    {
      playlistName: 'new Playlist',
      playlistTracks: []
    }
  );
}

search(term) {
  spotify.search(term).then( searchResults => {
    this.setState({searchResults: searchResults});
  });

}

render() {
  spotify.checkLoginState();
  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
        </div>
      </div>
    </div>
  );
}
}

export default App;
