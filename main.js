import {
  randomAlbums,
  randomSongs,
  fetchSearch,
  fetchAlbum,
  fetchSongDetails,
} from "./getapi.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "key_player";

const player = $(".player");
const searchHint = $(".search-hint");
const searchTerm = $(".searchTerm");
const album = $(".album");
const randomSong = $(".random-song");
const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const timePlayed = $(".time-played");
const timePlayedStart = $("#time-played-start");
const timePlayedRemaining = $("#time-played-remaining");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeBar = $("#volume-bar");
const deleteBtn = $(".delete-button");
const addBtn = $(".add-btn");
const createPlaylist = $(".create-playlist");
const createPlaylistInner = $(".create-playlist-inner");
const createPlaylistInput = $("#playlist-name");
const createPlaylistBtn = $("#create-playlist-btn");
const trackList = $("#track-list");
const playlistList = $(".playlist-list");
const playlistListContainer = $(".playlist-list-container");
const btnList = $(".btn-list");
const playlistHeading = $(".playlist-heading");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  selectedOption: null,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [],
  activePlaylistId: null,

  Albums: randomAlbums,
  randomSongs: randomSongs,

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],

  savePlaylistsToLocalStorage: function () {
    localStorage.setItem("playlists", JSON.stringify(this.playlists));
    this.playlists = JSON.parse(localStorage.getItem("playlists")) || [];
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index='${index}' draggable="true">
          <div class="option">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3.33325 5.33333H12.6666C12.8434 5.33333 13.013 5.2631 13.138 5.13807C13.263 5.01305 13.3333 4.84348 13.3333 4.66667C13.3333 4.48986 13.263 4.32029 13.138 4.19526C13.013 4.07024 12.8434 4 12.6666 4H3.33325C3.15644 4 2.98687 4.07024 2.86185 4.19526C2.73682 4.32029 2.66659 4.48986 2.66659 4.66667C2.66659 4.84348 2.73682 5.01305 2.86185 5.13807C2.98687 5.2631 3.15644 5.33333 3.33325 5.33333ZM13.9999 7.33333H1.99992C1.82311 7.33333 1.65354 7.40357 1.52851 7.5286C1.40349 7.65362 1.33325 7.82319 1.33325 8C1.33325 8.17681 1.40349 8.34638 1.52851 8.4714C1.65354 8.59643 1.82311 8.66667 1.99992 8.66667H13.9999C14.1767 8.66667 14.3463 8.59643 14.4713 8.4714C14.5963 8.34638 14.6666 8.17681 14.6666 8C14.6666 7.82319 14.5963 7.65362 14.4713 7.5286C14.3463 7.40357 14.1767 7.33333 13.9999 7.33333ZM12.6666 10.6667H3.33325C3.15644 10.6667 2.98687 10.7369 2.86185 10.8619C2.73682 10.987 2.66659 11.1565 2.66659 11.3333C2.66659 11.5101 2.73682 11.6797 2.86185 11.8047C2.98687 11.9298 3.15644 12 3.33325 12H12.6666C12.8434 12 13.013 11.9298 13.138 11.8047C13.263 11.6797 13.3333 11.5101 13.3333 11.3333C13.3333 11.1565 13.263 10.987 13.138 10.8619C13.013 10.7369 12.8434 10.6667 12.6666 10.6667Z" fill="#BDBDBD"/>
          </svg>
          </div>
          <div class="popup-container ${
            this.selectedOption
              ? this.selectedOption.closest(".song").dataset.index == index
                ? "active"
                : ""
              : ""
          }">
        <div class="popup">
          <div class="delete-button" data-index="${index}">
            Xóa bài hát
          </div>
        </div>
      </div>
          <div
              class="thumb"
              style="
              background-image: url('${song.image}');
              "
              >
          </div>
          <div class="body">
              <h3 class="title">${song.songName}</h3>
              <p class="author">${song.artistName}</p>
          </div>
          
      </div>
  `;
    });
    const albumHtml = this.Albums.map((album, index) => {
      return `
    <div class="album-item" data-index='${album.id}'>
      <div class="album-thumb" style="background-image: url('${album.image}');"></div>
      <h4>${album.albumName}</h4>
      <h5>${album.artistName}</h5>
    </div>
    `;
    });

    const randomSongs = this.randomSongs.map((song, index) => {
      return `
      <div class="item" data-index='${song.id}'>
                <div
                  class="item-thumb"
                  style="
                    background-image: url('${song.image}');
                  "
                ></div>
                <div class="item-name">
                  <div class="item-name-song">${song.songName}</div>
                  <div class="item-name-singer">${song.artistName}</div>
                </div>
                <div class="item-song-time">${song.duration}</div>
              </div>
      `;
    });

    const playlistItems = this.playlists.map((playlist) => {
      return `
        <div class="playlist-item" data-playlist-id="${playlist.id}">
          <div class="playlist-name">${playlist.name}</div>
          <div class="playlist-actions">
            <button class="delete-playlist-btn" data-playlist-id="${playlist.id}">Xóa</button>
            <button class="edit-playlist-btn" data-playlist-id="${playlist.id}">Sửa</button>
          </div>
        </div>
      `;
    });

    const currentPlaylist = this.playlists.find(
      (playlist) => playlist.id === this.activePlaylistId
    );
    const playlistHeading = $(".playlist-heading");
    if (currentPlaylist) {
      playlistHeading.textContent = currentPlaylist.name;
    } else {
      playlistHeading.textContent = "Playlist Name";
    }

    playlistListContainer.innerHTML = playlistItems.join("");

    randomSong.innerHTML = randomSongs.join("");

    album.innerHTML = albumHtml.join("");

    playlist.innerHTML = htmls.join("");
  },
  renderSearch: function (searchItem) {
    const searchHtml = searchItem.map((song) => {
      return `
      <div class="search-item" data-index='${song.id}'>
      <div
        class="search-thump"
        style="
          background-image: url('${song.image}');
        "
      ></div>
      <div class="search-title">
        <h5>${song.songName}</h5>
        <h6>${song.artistName}</h6>
      </div>
    </div>
      `;
    });

    searchHint.innerHTML = searchHtml.join("");
  },
  defineProperties: function () {
    const _this = this;

    Object.defineProperty(this, "currentSong", {
      get: function () {
        return _this.songs[_this.currentIndex];
      },
      set: function (value) {
        _this.currentIndex = _this.songs.findIndex((song) => song === value);
      },
    });
  },
  handleEvents: function () {
    const _this = this;

    // CD spin
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //When Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // When song is playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // When song is pausing
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // When audio is changing
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Processing Time played
    function updateTimePlayed() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;

      timePlayedStart.textContent = formatTime(currentTime);
      timePlayedRemaining.textContent = formatTime(duration - currentTime);

      updateProgressBar();
    }

    // Format time as mm:ss
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    }

    audio.addEventListener("timeupdate", updateTimePlayed);

    function updateProgressBar() {
      const color = `linear-gradient(
          90deg,
          rgb(39, 174, 96) ${progress.value}%,
          rgb(219, 219, 219) ${progress.value}%
        )`;
      progress.style.background = color;

      const seekTime = (audio.duration / 100) * progress.value;
    }
    progress.addEventListener("input", updateProgressBar);

    // Processing when Seek music
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // Processing random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Processing Repeat song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //Processing audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Processing click "Add"
    addBtn.onclick = function () {
      console.log("show");
      createPlaylist.classList.add("show");
    };

    // Processing click on playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const optionNode = e.target.closest(".option");

      if (optionNode) {
        _this.selectedOption = optionNode;
      } else {
        if (_this.selectedOption) {
          _this.selectedOption
            .closest(".song")
            .querySelector(".popup-container")
            .classList.remove("active");
        }
        _this.selectedOption = null;
      }

      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }

      if (_this.selectedOption) {
        _this.selectedOption
          .closest(".song")
          .querySelector(".popup-container")
          .classList.toggle("active");
      }

      // Processing event click delete
      const deleteBtn = e.target.closest(".delete-button");
      if (deleteBtn) {
        e.preventDefault();
        const songIndexToRemove = Number(deleteBtn.dataset.index);
        console.log(deleteBtn.dataset);
        console.log(deleteBtn.dataset.index);

        _this.removeFromPlaylist(songIndexToRemove);
        audio.play();
      }
    };

    // Processing event click "Add new playlist"
    createPlaylistBtn.onclick = function () {
      const playlistName = createPlaylistInput.value.trim();
      if (playlistName !== "") {
        const newPlaylist = {
          id:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
          name: playlistName,
          songs: [],
        };

        _this.playlists.push(newPlaylist);

        _this.savePlaylistsToLocalStorage();

        createPlaylist.classList.remove("show");

        createPlaylistInput.value = "";

        _this.activePlaylistId = newPlaylist.id;
        _this.songs = newPlaylist.songs;
        _this.setConfig("activePlaylistId", newPlaylist.id);

        _this.render();
      }
    };

    //Processing event click over create-playlist
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".create-playlist-inner")) {
        createPlaylist.classList.remove("show");
      }
      if (event.target === addBtn) {
        createPlaylist.classList.add("show");
      }
    });

    // Processing click list playlist

    playlistListContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete-playlist-btn")) {
        const playlistId = e.target.dataset.playlistId;
        const playlistIndex = _this.playlists.findIndex(
          (playlist) => playlist.id === playlistId
        );
        const currentPlaylist = _this.playlists[playlistIndex].name;
        const shouldDelete = confirm(
          `Are you sure you want to delete the playlist  "${currentPlaylist}"?`
        );

        if (shouldDelete && playlistIndex !== -1) {
          _this.playlists.splice(playlistIndex, 1);
          _this.savePlaylistsToLocalStorage();

          _this.render();
        }
        setTimeout(() => {
          playlistList.classList.add("show");
        }, 100);
      }

      if (e.target.classList.contains("edit-playlist-btn")) {
        const playlistId = e.target.dataset.playlistId;
        const playlistIndex = _this.playlists.findIndex(
          (playlist) => playlist.id === playlistId
        );

        if (playlistIndex !== -1) {
          const newPlaylistName = prompt("Enter a new name for the playlist:");
          if (newPlaylistName) {
            _this.playlists[playlistIndex].name = newPlaylistName;
            _this.savePlaylistsToLocalStorage();
            _this.render();
          }
        }
      }

      const playlistItems = e.target.closest(".playlist-item");
      if (playlistItems) {
        const playlistId = playlistItems.dataset.playlistId;
        _this.activePlaylistId = playlistId;
        const selectedPlaylist = _this.playlists.find(
          (playlist) => playlist.id === playlistId
        );
        if (selectedPlaylist) {
          _this.songs = selectedPlaylist.songs;
          _this.setConfig("activePlaylistId", playlistId);
          _this.loadCurrentPlaylist();
          _this.render();
          playlistList.classList.remove("show");
        }
      }
    });

    //Processing event click over playlistList
    const btnListBf = $(".fa-list");
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".playlist-list-container")) {
        playlistList.classList.remove("show");
      }
      if (event.target === btnListBf) {
        playlistList.classList.add("show");
      }
    });

    // Search bar

    searchTerm.addEventListener("input", async () => {
      const searchBarText = searchTerm.value;
      const searchItem = await fetchSearch(searchBarText);
      _this.renderSearch(searchItem);
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".search-hint")) {
        searchHint.innerHTML = "";
        _this.render;
      }
    });

    // Drag drop Event
    const playlistItems = $$(".playlist .song");
    let draggedItemIndex = null;

    playlistItems.forEach((item, index) => {
      item.setAttribute("draggable", "true");
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
          const items = app.songs;
          const draggedItem = items[draggedItemIndex];
          items.splice(draggedItemIndex, 1);
          items.splice(dropIndex, 0, draggedItem);
          app.currentIndex = dropIndex;
          app.savePlaylistsToLocalStorage();
          app.render();
        }
        item.classList.remove("dragging");
        item.classList.remove("dragover");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        item.classList.remove("dragover");
      });
    });

    // Listener click on random song
    randomSong.onclick = function (e) {
      const randomSongNode = e.target.closest(".item");
      const id = randomSongNode.dataset.index;
      const songToAdd = randomSongs.find((song) => song.id === id);
      _this.songs.push(songToAdd);
      _this.addToPlaylist(songToAdd);
      _this.currentIndex = _this.songs.length - 1;
      _this.loadCurrentSong();
      _this.savePlaylistsToLocalStorage();
      _this.render();
      audio.play();
    };

    // Listener click on search song
    searchHint.onclick = async (e) => {
      const searchSongNode = e.target.closest(".search-item");
      const searchItem = await fetchSearch(searchTerm.value);
      const id = searchSongNode.dataset.index;
      const songToAdd = searchItem.find((song) => song.id === id);
      _this.songs.push(songToAdd);
      _this.addToPlaylist(songToAdd);
      _this.currentIndex = _this.songs.length - 1;
      _this.loadCurrentSong();
      _this.savePlaylistsToLocalStorage();
      _this.render();
      searchHint.innerHTML = "";
      searchTerm.value = "";
      audio.play();
    };

    // Listener click on album
    album.onclick = async (e) => {
      const albumNode = e.target.closest(".album-item");
      const id = albumNode.dataset.index;
      const listId = await fetchAlbum(id);

      const songDetails = await Promise.all(
        listId.map(async (songId) => {
          try {
            const songInfo = await fetchSongDetails(songId);
            return {
              image: songInfo.album.images[0].url,
              songName: songInfo.name,
              artistName: songInfo.artists[0].name,
              preview: songInfo.preview_url,
              id: songInfo.id,
            };
          } catch (error) {
            console.error("Error fetching song details:", error);
            return {
              image: "",
              songName: "Unknown",
              artistName: "Unknown",
              preview: "",
              id: songId,
            };
          }
        })
      );

      const songFilter = songDetails.filter(
        (song) => song.preview != undefined
      );

      if (songFilter.length > 0) {
        const findAlbum = _this.Albums.find((album) => album.id === id);
        const newPlaylist = {
          id: id,
          name: findAlbum.albumName,
          songs: songFilter,
        };
        _this.playlists.push(newPlaylist);
        _this.savePlaylistsToLocalStorage();

        const currentSong = _this.currentSong;
        _this.activePlaylistId = id;
        _this.setConfig("activePlaylistId", newPlaylist.id);
        _this.songs = newPlaylist.songs;

        if (currentSong) {
          _this.currentIndex = newPlaylist.songs.findIndex(
            (song) => song.id === currentSong.id
          );
        } else {
          _this.currentIndex = 0;
        }

        _this.loadCurrentPlaylist();
        _this.render();
        this.nextSong();
        audio.play();
      } else {
        alert("This song does not have a preview available.");
        console.log("This Album have song preview not available.");
      }
    };

    // Volume bar
    volumeBar.addEventListener("input", function () {
      const VolumeValue = volumeBar.value / 100;
      audio.volume = VolumeValue;
      const color = `linear-gradient(
          90deg,
          rgb(39, 174, 96) ${volumeBar.value}%,
          rgb(219, 219, 219) ${volumeBar.value}%
        )`;
      volumeBar.style.background = color;
    });
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    if (this.currentSong) {
      heading.textContent = `${this.currentSong.songName}  -  ${this.currentSong.artistName}`;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.preview;
    }
  },
  loadCurrentPlaylist: function () {
    const playlist = this.playlists.find(
      (playlist) => playlist.id === this.activePlaylistId
    );

    if (playlist) {
      this.songs = playlist.songs;
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.activePlaylistId = this.config.activePlaylistId;

    const playlistData = localStorage.getItem("playlist");
    if (playlistData) {
      this.songs = JSON.parse(playlistData);
    }
  },
  addToPlaylist: function (songToAdd) {
    const playlist = this.playlists.find(
      (playlist) => playlist.id === this.activePlaylistId
    );

    if (playlist) {
      const existingSongIndex = playlist.songs.findIndex(
        (song) => song.id === songToAdd.id
      );

      if (existingSongIndex === -1) {
        playlist.songs.push(songToAdd);
        this.nextSong();
        this.savePlaylistsToLocalStorage();
        this.render();
      }
    }
  },
  removeFromPlaylist: function (indexToRemove) {
    const playlist = this.playlists.find(
      (playlist) => playlist.id === this.activePlaylistId
    );

    if (playlist && Array.isArray(playlist.songs)) {
      const tempCurrentIndex = this.currentIndex;
      playlist.songs.splice(indexToRemove, 1);
      this.currentIndex =
        tempCurrentIndex < indexToRemove
          ? tempCurrentIndex
          : tempCurrentIndex - 1;
      this.songs.splice(indexToRemove, 1);
      this.savePlaylistsToLocalStorage();
      this.render();
    }
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.savePlaylistsToLocalStorage();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    this.savePlaylistsToLocalStorage();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.savePlaylistsToLocalStorage();
  },

  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();

    if (this.playlists.length === 0) {
      const newPlaylist = {
        id: "newplaylist",
        name: "New Playlist",
        songs: [],
      };
      this.playlists.push(newPlaylist);
      this.activePlaylistId = "newplaylist";
      this.savePlaylistsToLocalStorage();
    }

    if (this.playlists.length > 0 && this.activePlaylistId) {
      const activePlaylist = this.playlists.find(
        (playlist) => playlist.id === this.activePlaylistId
      );

      if (activePlaylist) {
        this.activePlaylistId = this.activePlaylistId;
      } else {
        this.activePlaylistId = this.playlists[0].id;
      }
    } else {
      this.activePlaylistId = this.playlists[0].id;
    }

    this.songs =
      this.playlists.find((playlist) => playlist.id === this.activePlaylistId)
        ?.songs || [];
    this.render();

    if (this.songs.length === 0) {
      heading.textContent = "";
      playBtn.disabled = true;
      nextBtn.disabled = true;
      prevBtn.disabled = true;
      repeatBtn.disabled = true;
      randomBtn.disabled = true;
      volumeBar.disabled = true;
    } else {
      this.currentIndex = 0;
      this.loadCurrentSong();
      this.render();
      randomBtn.classList.toggle("active", this.isRandom);
      repeatBtn.classList.toggle("active", this.isRepeat);
      audio.volume = this.config.volume || 0.5;
      volumeBar.value = audio.volume * 100;
    }
  },
};

app.start();
