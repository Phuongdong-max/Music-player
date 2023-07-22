import { randomAlbums, randomSongs } from "./getapi.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Player UI Component
const playerUI = {
  player: $(".player"),
  album: $(".album"),
  randomSong: $(".random-song"),
  playlist: $(".playlist"),
  heading: $("header h2"),
  cdThumb: $(".cd-thumb"),
  audio: $("#audio"),
  cd: $(".cd"),
  playBtn: $(".btn-toggle-play"),
  progress: $("#progress"),
  timePlayed: $(".time-played"),
  timePlayedStart: $("#time-played-start"),
  timePlayedRemaining: $("#time-played-remaining"),
  nextBtn: $(".btn-next"),
  prevBtn: $(".btn-prev"),
  randomBtn: $(".btn-random"),
  repeatBtn: $(".btn-repeat"),
  volumeBar: $("#volume-bar"),

  init: function () {
    this.handleEvents();
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = this.cd.offsetWidth;

    // CD spin
    const cdThumbAnimate = this.cdThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // When Play
    this.playBtn.onclick = function () {
      if (_this.audio.paused) {
        _this.audio.play();
      } else {
        _this.audio.pause();
      }
    };

    // When song is playing
    this.audio.onplay = function () {
      _this.player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // When song is pausing
    this.audio.onpause = function () {
      _this.player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // When audio is changing
    this.audio.ontimeupdate = function () {
      if (_this.audio.duration) {
        const progressPercent = Math.floor(
          (_this.audio.currentTime / _this.audio.duration) * 100
        );
        _this.progress.value = progressPercent;
        _this.updateTimePlayed();
      }
    };

    // Processing Time played
    this.updateTimePlayed = function () {
      const currentTime = _this.audio.currentTime;
      const duration = _this.audio.duration;

      _this.timePlayedStart.textContent = _this.formatTime(currentTime);
      _this.timePlayedRemaining.textContent = _this.formatTime(
        duration - currentTime
      );

      _this.updateProgressBar();
    };

    // Format time as mm:ss
    this.formatTime = function (time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    // Updating progress bar
    this.updateProgressBar = function () {
      const color = `linear-gradient(90deg, rgb(39, 174, 96) ${_this.progress.value}%, rgb(219, 219, 219) ${_this.progress.value}%)`;
      _this.progress.style.background = color;
    };

    // Processing when Seek music
    this.progress.oninput = function (e) {
      const seekTime = (_this.audio.duration / 100) * e.target.value;
      _this.audio.currentTime = seekTime;
    };

    // Volume bar
    this.volumeBar.addEventListener("input", function () {
      const volumeValue = _this.volumeBar.value / 100;
      _this.audio.volume = volumeValue;
      const color = `linear-gradient(90deg, rgb(39, 174, 96) ${_this.volumeBar.value}%, rgb(219, 219, 219) ${_this.volumeBar.value}%)`;
      _this.volumeBar.style.background = color;
    });
  },
};

// Playlist UI Component
const playlistUI = {
  songs: [],
  currentIndex: 0,

  init: function () {
    this.render();
    this.handleEvents();
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${
            index === this.currentIndex ? "active" : ""
          }" data-index='${index}' draggable="true">
            <!-- Song content here -->
          </div>
        `;
    });

    $(".playlist").innerHTML = htmls.join("");
  },

  handleEvents: function () {
    const _this = this;

    // Drag and drop event
    const playlistItems = $$(".playlist .song");
    let draggedItemIndex = null;

    playlistItems.forEach((item, index) => {
      item.addEventListener("dragstart", (e) => {
        draggedItemIndex = index;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", item.innerHTML);
        item.classList.add("dragging");
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      item.addEventListener("dragenter", (e) => {
        e.preventDefault();
        item.classList.add("dragover");
      });

      item.addEventListener("dragleave", () => {
        item.classList.remove("dragover");
      });

      item.addEventListener("drop", (e) => {
        e.preventDefault();
        const dropIndex = index;
        if (draggedItemIndex !== dropIndex) {
          const items = _this.songs;
          const draggedItem = items[draggedItemIndex];
          items.splice(draggedItemIndex, 1);
          items.splice(dropIndex, 0, draggedItem);
          _this.currentIndex = dropIndex;
          _this.render();
        }
        item.classList.remove("dragging");
        item.classList.remove("dragover");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        item.classList.remove("dragover");
      });

      item.onclick = function () {
        _this.currentIndex = index;
        _this.render();
        // Play the selected song or handle other click events
        // ...
      };
    });
  },

  // Other functions for handling click events, setting current song, etc.
};

// Album UI Component
const albumUI = {
  Albums: randomAlbums,

  init: function () {
    this.render();
  },

  render: function () {
    const albumHtml = this.Albums.map((album, index) => {
      return `
          <div class="album-item">
            <div class="album-thumb" style="background-image: url('${album.image}');"></div>
            <h4>${album.albumName}</h4>
            <h5>${album.artistName}</h5>
          </div>
        `;
    });

    $(".album").innerHTML = albumHtml.join("");
  },

  // Other functions for handling click events, displaying album details, etc.
};

// Random Song UI Component
const randomSongUI = {
  randomSongs: randomSongs,

  init: function () {
    this.render();
    this.handleEvents();
  },

  render: function () {
    const randomSongsHtml = this.randomSongs.map((song, index) => {
      return `
          <div class="item" data-index='${song.id}'>
            <div class="item-thumb" style="background-image: url('${song.image}');"></div>
            <div class="item-name">
              <div class="item-name-song">${song.songName}</div>
              <div class="item-name-singer">${song.artistName}</div>
            </div>
            <div class="item-song-time">${song.duration}</div>
          </div>
        `;
    });

    $(".random-song").innerHTML = randomSongsHtml.join("");
  },

  handleEvents: function () {
    const _this = this;

    // Handling click on random song item
    const randomSongItems = $$(".random-song .item");
    randomSongItems.forEach((item) => {
      item.onclick = function () {
        const id = item.dataset.index;
        const songToAdd = _this.randomSongs.find((song) => song.id === id);
        // Add the selected song to the playlist or handle other click events
        // ...
      };
    });
  },

  // Other functions for handling click events, adding random songs to playlist, etc.
};

// Create Playlist UI Component
const createPlaylistUI = {
  createPlaylist: $(".create-playlist"),
  createPlaylistInner: $(".create-playlist-inner"),
  createPlaylistInput: $("#playlist-name"),
  createPlaylistBtn: $("#create-playlist-btn"),

  init: function () {
    this.handleEvents();
  },

  handleEvents: function () {
    const _this = this;

    // Handling click on "Tạo playlist mới" button
    this.createPlaylistBtn.onclick = function () {
      const playlistName = _this.createPlaylistInput.value.trim();
      if (playlistName !== "") {
        // Create a new playlist with the entered name and add it to the playlists array
        const newPlaylist = {
          name: playlistName,
          songs: [],
        };
        app.playlists.push(newPlaylist);
        app.savePlaylistsToLocalStorage();
        app.renderPlaylists();
        _this.hideCreatePlaylistForm();
        _this.createPlaylistInput.value = "";
      }
    };

    // Handling click outside of create playlist form to close it
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".create-playlist-inner")) {
        _this.hideCreatePlaylistForm();
      }
    });

    // Prevent closing the create playlist form when clicking inside the form
    this.createPlaylistInner.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  },

  showCreatePlaylistForm: function () {
    this.createPlaylist.classList.add("show");
  },

  hideCreatePlaylistForm: function () {
    this.createPlaylist.classList.remove("show");
  },

  // Other functions for handling click events, creating new playlists, etc.
};

// LocalStorage Manager Component
const localStorageManager = {
  PLAYER_STORAGE_KEY: "key_player",
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],

  getConfig: function () {
    return JSON.parse(localStorage.getItem(this.PLAYER_STORAGE_KEY)) || {};
  },

  setConfig: function (key, value) {
    const config = this.getConfig();
    config[key] = value;
    localStorage.setItem(this.PLAYER_STORAGE_KEY, JSON.stringify(config));
  },

  getPlaylists: function () {
    return this.playlists;
  },

  savePlaylistsToLocalStorage: function () {
    localStorage.setItem("playlists", JSON.stringify(this.playlists));
  },

  // Other functions for getting and setting player configuration, playlists data, etc.
};

// App Component
const app = {
  config:
    JSON.parse(localStorage.getItem(localStorageManager.PLAYER_STORAGE_KEY)) ||
    {},
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  selectedOption: null,
  songs: [],

  init: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;
    this.songs = localStorageManager.getPlaylists() || [];
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const playerConfig = localStorageManager.getConfig();

    // Setting player configuration
    localStorageManager.setConfig("isRandom", true);

    const playlistsData = localStorageManager.getPlaylists();

    localStorageManager.savePlaylistsToLocalStorage();

    createPlaylistUI.init();

    randomSongUI.init();

    albumUI.init();

    playlistUI.init();

    playerUI.init();
    // Handling events for player controls and interactions
    // ...
    // Handling events for playlist interactions
    // ...
    // Handling events for album interactions
    // ...
    // Handling events for random song interactions
    // ...
    // Handling events for create playlist interactions
    // ...
  },

  loadCurrentSong: function () {
    // Load the current song to the player
    // ...
  },

  render: function () {
    // Render the player UI and other components
    // ...
  },

  // Other functions for player controls, playlist interactions, album interactions, random song interactions, create playlist interactions, etc.
};

// Initializing the App Component
app.init();

// Usage examples:

// Getting player configuration
