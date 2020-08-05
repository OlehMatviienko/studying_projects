import React from 'react';
import './App.css';
import { SearchBar} from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName : 'My Playlist',
      playListTracks : []
    }
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlayListName=this.updatePlayListName.bind(this);
    this.savePlayList=this.savePlayList.bind(this);
    this.search=this.search.bind(this);
  }
  addTrack(track){
    let tracks = this.state.playListTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playListTracks: tracks});
  }
  removeTrack(track){
    let tracks=this.state.playListTracks;
    tracks.splice(tracks.indexOf(track.id+1),track.id-1);
    this.setState({playListTracks:tracks});
  }
  updatePlayListName(newName){
    this.setState({playListName:newName});
  }
  savePlayList(){
    let tracksURIs = this.state.playListTracks.map(track=>track.uri);
    Spotify.savePlayList(this.state.playListName, tracksURIs).then(()=>{
      this.setState({
        playListName: 'New Playlist',
        playListTracks: []
      })
    })
  }
  search(term){
    Spotify.search(term).then(searchResults=>{
      this.setState({searchResults: searchResults});
    })

  }
  componentDidMount(){
    Spotify.getAccessToken();
  }
  render(){
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResult={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playListName={this.state.playListName} playListTracks={this.state.playListTracks} onRemove={this.removeTrack} onNameChange={this.updatePlayListName} onSave={this.savePlayList} />
          </div>
        </div>
    </div>
  )
  }
}

export default App;
