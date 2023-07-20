import { randomAlbums, randomSongs } from "./getapi.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "key_player";

const player = $(".player");
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
const createPlaylistInner = $(".create-playlist-innert");
const createPlaylistInput = $("#playlist-name");
const createPlaylistBtn = $("#create-playlist-btn");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  selectedOption: null,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [],

  Albums: randomAlbums,
  randomSongs: randomSongs,

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],

  savePlaylistsToLocalStorage: function () {
    localStorage.setItem("playlists", JSON.stringify(this.playlists));
  },

  renderPlaylists: function () {
    const playlistHtmls = this.playlists.map((playlist, index) => {
      return `
        <div class="playlist-item">
          <div class="playlist-name">${playlist.name}</div>
          <button class="btn-remove-playlist" data-index="${index}">Xóa</button>
        </div>
      `;
    });

    $(".playlist-container").innerHTML = playlistHtmls.join("");

    const removePlaylistButtons = $$(".btn-remove-playlist");
    removePlaylistButtons.forEach((btn) => {
      btn.onclick = () => {
        const indexToRemove = parseInt(btn.dataset.index);
        this.playlists.splice(indexToRemove, 1);
        this.savePlaylistsToLocalStorage();
        this.renderPlaylists();
      };
    });
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
          <div class="delete-button")">
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
    <div class="album-item">
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

    $(".random-song").innerHTML = randomSongs.join("");

    $(".album").innerHTML = albumHtml.join("");

    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // CD spin
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Scroll CD
    // document.onscroll = function () {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const newCdWidth = cdWidth - scrollTop;

    //   cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    //   cd.style.opacity = newCdWidth / cdWidth;
    // };

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

    // Scroll Time Played

    document.addEventListener("scroll", function () {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const cdHeight = cdThumb.offsetHeight;
      if (scrollPosition < cdHeight) {
        timePlayed.classList.remove("hidden");
      } else {
        timePlayed.classList.add("hidden");
      }
    });

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

    // Processing click playlist
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
        const songIndexToRemove = Number(deleteBtn.id.split("_")[1]);
        _this.removeFromPlaylist(songIndexToRemove);
        audio.play();
      }
    };

    // Processing event click "Tạo playlist mới"
    createPlaylistBtn.onclick = function () {
      const playlistName = createPlaylistInput.value.trim();
      if (playlistName !== "") {
        const newPlaylist = {
          name: playlistName,
          songs: [],
        };

        _this.playlists.push(newPlaylist);

        _this.savePlaylistsToLocalStorage();

        _this.renderPlaylists();

        createPlaylist.classList.remove("show");

        createPlaylistInput.value = "";
      }
    };

    //Processing event click over create-playlist
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".create-playlist-inner")) {
        console.log("none");
        createPlaylist.classList.remove("show");
      }
      if (event.target === addBtn) {
        createPlaylist.classList.add("show");
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
          app.savePlaylistToLocalStorage();
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
      _this.currentIndex = _this.songs.length - 1;
      _this.loadCurrentSong();
      _this.savePlaylistToLocalStorage();
      _this.render();
      audio.play();
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
      heading.textContent = this.currentSong.songName;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.preview;
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;

    const playlistData = localStorage.getItem("playlist");
    if (playlistData) {
      this.songs = JSON.parse(playlistData);
    }
  },
  addToPlaylist: function (songToAdd) {
    const existingSongIndex = this.songs.findIndex(
      (song) => song.id === songToAdd.id
    );

    if (existingSongIndex === -1) {
      this.songs.push(songToAdd);
      this.savePlaylistToLocalStorage();
      this.render();
    } else {
      // Nếu bài hát đã tồn tại, hiển thị thông báo hoặc thực hiện các tác vụ khác
      // (ví dụ: thông báo "Bài hát đã tồn tại trong danh sách")
      // ...
    }
  },
  removeFromPlaylist: function (indexToRemove) {
    this.songs.splice(indexToRemove, 1);
    this.savePlaylistToLocalStorage();
    this.nextSong();
    this.render();
  },
  savePlaylistToLocalStorage: function () {
    localStorage.setItem("playlist", JSON.stringify(this.songs));
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.savePlaylistToLocalStorage();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    this.savePlaylistToLocalStorage();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.savePlaylistToLocalStorage();
  },

  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

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

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
app.renderPlaylists();
