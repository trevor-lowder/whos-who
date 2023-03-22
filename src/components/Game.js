import React, { useState, useEffect } from "react";

const Game = ({ numAttempts = 3 }) => {

  /*   // Get random 'numArtists' artists
  const shuffledArtists = artists.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedArtists = shuffledArtists.slice(0, numArtists); // Get a new array with 'numArtists' items
  // Get random 'numSongs' songs
  const shuffledSongs = songs.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedSongs = shuffledSongs.slice(0, numSongs); // Get a new array with 'numArtists' items */
  // Game state
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [gameSettings, setGameSettings] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(false);
  const [attempts, setAttempts] = useState(numAttempts);
  const [score, setScore] = useState(0);

  // Game logic
  useEffect(() => {
    const spotifyData = localStorage.getItem("apiResults");
    const settings = localStorage.getItem("gameSettings");
    setArtists(JSON.parse(spotifyData).artists);
    setSongs(JSON.parse(spotifyData).songs);
    setGameSettings(JSON.parse(settings));
  }, []);

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    if (selectedArtist !== false) {
      if (song.artistName !== selectedArtist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
      if (song.artistName == selectedArtist.artistName) {
        setAttempts(score + 10);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
    }
  };
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    if (selectedSong !== false) {
      if (selectedSong.artistName !== artist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
      if (selectedSong.artistName == artist.artistName) {
        setScore(score + 10);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
    }
  };
  function AudioButton({ url }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    const playAudio = () => {
      const newAudio = new Audio(url);
      newAudio.play();
      setIsPlaying(true);
      setAudio(newAudio);
    };

    const pauseAudio = () => {
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    return (
      <div>
        {isPlaying ? (
          <button onClick={pauseAudio}>Pause Audio</button>
        ) : (
          <button onClick={playAudio}>Play Audio</button>
        )}
      </div>
    );
  }

  return (
    <div>
      {console.log("gameSettings", gameSettings)}
      {console.log("songs", songs)}
      <h1>{gameSettings.selectedGenre} Music Game</h1>
      <h2>Current Score: {score}</h2>
      <p>Attempts: {attempts}</p>
      <div>
        <h2>Songs</h2>
        <div>
          {[...songs].slice(0, gameSettings.numSongs).map((song) => (
            <div key={song.artistName}>
              <button onClick={() => handleSelectSong(song)}>
                <p>{song.trackName}</p>
              </button>
              <AudioButton url={song.previewURL} />
            </div>
          ))}
        </div>
        <h2>Artists</h2>
        <div>
          {[...artists].slice(0, gameSettings.numArtists).map((artist) => (
            <div key={artist.artistName}>
              <div>
                <img src={artist.artistImg} alt={artist.artistName} />
              </div>
              <button onClick={() => handleSelectArtist(artist)}>
                <p>{artist.artistName}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
