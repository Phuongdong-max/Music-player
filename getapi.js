const client_id = "4108b91d716d414f89c4e8a66b615807";
const client_secret = "199030768f024bd5be98fca3cc0be7f9";

const fetchToken = async () => {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    data: "grant_type=client_credentials",
  };

  try {
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchRandomAlbums = async () => {
  try {
    const token = await fetchToken();

    const options = {
      url: "https://api.spotify.com/v1/browse/new-releases?limit=50",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    const albumsResponse = await axios.get(options.url, {
      headers: options.headers,
    });
    const albums = albumsResponse.data.albums.items; // Lưu trữ mảng album gốc

    const randomAlbums = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * albums.length);
      const album = albums[randomIndex];
      const albumObject = {
        image: album.images[0].url,
        albumName: album.name,
        artistName: album.artists[0].name,
      };
      randomAlbums.push(albumObject);
      albums.splice(randomIndex, 1);
    }

    return randomAlbums;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Random songs

const getRandomSongsArray = [
  "%25a%25",
  "a%25",
  "%25e%25",
  "e%25",
  "%25i%25",
  "i%25",
  "%25o%25",
  "o%25",
];
const getRandomSongs =
  getRandomSongsArray[Math.floor(Math.random() * getRandomSongsArray.length)];
const getRandomOffset = Math.floor(Math.random() * 1000);
const randomSongUrl = `https://api.spotify.com/v1/search?query=${getRandomSongs}&offset=${getRandomOffset}&limit=10&type=track&market=NL`;

const fetchRandomSongs = async () => {
  try {
    const token = await fetchToken();

    const options = {
      url: randomSongUrl,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    const songsResponse = await axios.get(options.url, {
      headers: options.headers,
    });
    const songs = songsResponse.data.tracks.items; // Lưu trữ mảng bài hát gốc

    const randomSongs = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      const song = songs[randomIndex];

      const durationInMs = song.duration_ms;
      const durationInSec = Math.floor(durationInMs / 1000);
      const minutes = Math.floor(durationInSec / 60);
      const seconds = durationInSec % 60;
      const formattedDuration = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (song.preview_url !== null) {
        const songObject = {
          image: song.album.images[0].url,
          songName: song.name,
          artistName: song.artists[0].name,
          duration: formattedDuration,
          preview: song.preview_url,
          id: song.id,
        };
        randomSongs.push(songObject);
      }
      songs.splice(randomIndex, 1);
    }

    return randomSongs;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Create Playlist

const randomAlbums = await fetchRandomAlbums();
const randomSongs = await fetchRandomSongs();

export { randomAlbums, randomSongs };
