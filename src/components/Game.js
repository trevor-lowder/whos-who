import React, { useState } from "react";

const Game = ({
  genre = "pop",
  numArtists = 2,
  numSongs = 1,
  songs,
  artists,
  numAttempts = 3,
}) => {
  artists = [
    {
      artistName: "Artist 1",
      artistImg: "https://via.placeholder.com/150",
    },
    {
      artistName: "Artist 2",
      artistImg: "https://via.placeholder.com/150",
    },
    {
      artistName: "Artist 3",
      artistImg: "https://via.placeholder.com/150",
    },
    {
      artistName: "Artist 4",
      artistImg: "https://via.placeholder.com/150",
    },
  ];

  songs = [
    {
      songName: "Song 1",
      artistName: "Artist 1",
      previewURL: 1,
    },
    {
      songName: "Song 2",
      artistName: "Artist 2",
      previewURL: 2,
    },
    {
      songName: "Song 3",
      artistName: "Artist 3",
      previewURL: 3,
    },
    {
      songName: "Song 4",
      artistName: "Artist 4",
      previewURL: 4,
    },
  ];

  /*   // Get random 'numArtists' artists
  const shuffledArtists = artists.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedArtists = shuffledArtists.slice(0, numArtists); // Get a new array with 'numArtists' items
  // Get random 'numSongs' songs
  const shuffledSongs = songs.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedSongs = shuffledSongs.slice(0, numSongs); // Get a new array with 'numArtists' items */
  // Game state
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [attempts, setAttempts] = useState(numAttempts);
  const [score, setScore] = useState(0);
  // Game logic
  const handleSelectSong = (song) => {
    setSelectedSong(song);
    if (selectedArtist !== null) {
      if (song.artistName !== selectedArtist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(null);
        setSelectedArtist(null);
      }
      if (song.artistName == selectedArtist.artistName) {
        setAttempts(score + 10);
        setSelectedSong(null);
        setSelectedArtist(null);
      }
    }
  };
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    if (selectedSong !== null) {
      if (selectedSong.artistName !== artist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(null);
        setSelectedArtist(null);
      }
      if (selectedSong.artistName == artist.artistName) {
        setScore(score + 10);
        setSelectedSong(null);
        setSelectedArtist(null);
      }
    }
  };

  return (
    <div>
      <h1>{genre.toLocaleUpperCase()} Music Game</h1>
      <h2>Current Score: {score}</h2>
      <p>Attempts: {attempts}</p>
      <div>
        <h2>Songs</h2>
        <div>
          {[...songs].slice(0, numSongs).map((song) => (
            <div key={song.artistName}>
              <button onClick={() => handleSelectSong(song)}>
                <p>{song.songName}</p>
              </button>
            </div>
          ))}
        </div>
        <h2>Artists</h2>
        <div>
          {[...artists].slice(0, numArtists).map((artist) => (
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
