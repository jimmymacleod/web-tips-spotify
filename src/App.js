import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

let defaultStyle = {
  color: "#fff"
};
let fakeServerData = {
  user: {
    name: "James",
    playlists: [
      {
        name: "Favourites",
        songs: [
          { name: "Nikes", duration: 1234 },
          { name: "Wish you were here", duration: 2342 },
          { name: "The less I know the better", duration: 4722 },
          { name: "Reckoner", duration: 3922 }
        ]
      },
      {
        name: "New Music",
        songs: [
          { name: "Kerala", duration: 1334 },
          { name: "Gosh", duration: 2652 },
          { name: "Juicebox", duration: 4232 },
          { name: "Roitvan", duration: 3122 }
        ]
      },
      {
        name: "Alternative",
        songs: [
          { name: "You only live once", duration: 2334 },
          { name: "Californication", duration: 3245 },
          { name: "Cirrus", duration: 4722 },
          { name: "Break Apart", duration: 3922 }
        ]
      }
    ]
  }
};

class PlaylistsCounter extends Component {
  render() {
    return (
      <div style={{ width: "40%", display: "inline-block" }}>
        <h2 style={{ color: "#000" }}>
          {this.props.playlists.length} Playlists
        </h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs);
    }, []);
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    }, 0);
    return (
      <div style={{ width: "40%", display: "inline-block" }}>
        <h2 style={{ color: "#000" }}>
          {Math.round(totalDuration / 60)} Hours
        </h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input typle="text" />
        Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{ width: "30%", display: "inline-block" }}>
        <img />
        <h3>Playlist Names</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
          <li>Song 4</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {} };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
    }, 5000);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ? (
          <div>
            <h1>
              {this.state.serverData.user.name}
              Playlists
            </h1>
            <PlaylistsCounter
              playlists={this.state.serverData.user.playlists}
            />
            <HoursCounter playlists={this.state.serverData.user.playlists} />
            <Filter />
            <Playlist />
            <Playlist />
            <Playlist />
          </div>
        ) : (
          <h1>Loading....</h1>
        )}
      </div>
    );
  }
}

export default App;
