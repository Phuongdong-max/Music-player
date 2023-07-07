async function fetchData() {
  const url = "https://deezerdevs-deezer.p.rapidapi.com/search?q=theweekn";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c656654ad0msha7e2dab03ec7dbfp111772jsn9050eee73c38",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

    // Truy cập vào các thuộc tính cần thiết
    const tracks = data.data;
    const trackInfo = tracks.map((track) => {
      const album = track.album;
      const coverImage = album.cover;
      const songTitle = track.title;
      const artistName = track.artist.name;
      const songLink = track.preview;

      return {
        album: album,
        coverImage: coverImage,
        songTitle: songTitle,
        artistName: artistName,
        songLink: songLink,
      };
    });

    return trackInfo;
  } catch (error) {
    console.error(error);
  }
}

const trackInfo = await fetchData();
export { trackInfo };
