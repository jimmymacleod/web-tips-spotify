import React, { Component } from "react";
import "./App.css";
import queryString from "query-string";

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
        <input
          type="text"
          onKeyUp={event => this.props.onTextChange(event.target.value)}
        />
        Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{ width: "30%", display: "inline-block" }}>
        <img src={playlist.imageUrl} style={{ width: "160px" }} />
        <h3>{this.props.playlist.name}</h3>
        <ul>{this.props.playlist.songs.map(song => <li>{song.name}</li>)}</ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ""
    };
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({ user: { name: data.id } }));

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.items;
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { Authorization: "Bearer " + accessToken }
          });
          let trackDataPromise = responsePromise.then(response =>
            response.json()
          );
          return trackDataPromise;
        });

        let allTracksDataPromises = Promise.all(trackDataPromises);

        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }));
          });
          return playlists;
        });
        return playlistsPromise;
      })
      .then(playlists =>
        this.setState({
          playlists: playlists.map(item => {
            console.log(item.trackDatas);
            return {
              name: item.name,
              imageUrl: item.images[0].url,
              songs: item.trackDatas.slice(0, 2)
            };
          })
        })
      );
  }

  render() {
    console.log("this:", this);
    console.log(this.state.serverData);

    let playlistToRender =
      this.state.user && this.state.playlists
        ? this.state.playlists.filter(playlist =>
            playlist.name
              .toLowerCase()
              .includes(this.state.filterString.toLowerCase())
          )
        : [];

    return (
      <div className="App">
        {this.state.user && this.state.user.name ? (
          <div>
            <h3>
              {this.state.user.name} Playlists
              <br />
              <PlaylistsCounter playlists={playlistToRender} />
              <HoursCounter playlists={playlistToRender} />
              <Filter
                onTextChange={text => this.setState({ filterString: text })}
              />
              {playlistToRender.map(playlist => (
                <Playlist playlist={playlist} />
              ))}
            </h3>
          </div>
        ) : (
          <button
            onClick={() => {
              window.location = window.location.href.includes("localhost")
                ? "http://localhost:8888/login"
                : "https://web-tips-spotify-backend.herokuapp.com/login";
            }}
            style={{
              padding: "20px",
              fontSize: "50px",
              marginTop: "20px",
              backgroundColor: "lightgray"
            }}
          >
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}

export default App;
