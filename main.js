const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "key_player";

const player = $(".player");
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

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Harley Bird - Home",
      singer: "Jordan Schor",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-1.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-1.mp3",
    },
    {
      name: "Ikson Anywhere – Ikson",
      singer: "Audio Library",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-2.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-2.mp3",
    },
    {
      name: "Beauz & Jvna - Crazy",
      singer: "Beauz & Jvna",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-3.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-3.mp3",
    },
    {
      name: "Hardwind - Want Me",
      singer: "Mike Archangelo",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-4.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-4.mp3",
    },
    {
      name: "Jim - Sun Goes Down",
      singer: "Jim Yosef x Roy",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-5.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-5.mp3",
    },
    {
      name: "Lost Sky - Vision NCS",
      singer: "NCS Release",
      image: "https://cdn.jsdelivr.net/gh/ngylduy/storage/image/music-6.jpg",
      path: "https://ia801400.us.archive.org/27/items/music_20210917/music-6.mp3",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index='${index}'>
            <div
                class="thumb"
                style="
                background-image: url('${song.image}');
                "
                >
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
    });
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
    _this = this;
    const cdWidth = cd.offsetWidth;

    // CD spin
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Scroll CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Click Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
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
        timePlayedStart.textContent = `${Math.floor(
          audio.duration / 60
        )}:${Math.floor(audio.duration % 60)
          .toString()
          .padStart(2, "0")}`;

        timePlayedRemaining.textContent = `-${Math.floor(
          (audio.duration - audio.currentTime) / 60
        )}:${Math.floor((audio.duration - audio.currentTime) % 60)
          .toString()
          .padStart(2, "0")}`;
      }
      audio.addEventListener("timeupdate", updateTimePlayed);

      function updateProgressBar() {
        const color = `linear-gradient(
          90deg,
          rgb(235, 30, 85) ${progress.value}%,
          rgb(219, 219, 219) ${progress.value}%
        )`;
        progress.style.background = color;
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
      // Listener click on playlist
      playlist.onclick = function (e) {
        const songNode = e.target.closest(".song:not(.active)");
        if (songNode || e.target.closest("option")) {
          //Processing when click on song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
          //Processing when click on song option
        }
      };
    };
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
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
