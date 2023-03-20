import React, { useState } from "react";

const Game = ({
  genre = "pop",
  numSongs = 1,
  numArtists = 2,
  numAttempts = 3,
}) => {
  const artists = [
    {
      id: 1,
      name: "Artist 1",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Artist 2",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Artist 3",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Artist 4",
      image: "https://via.placeholder.com/150",
    },
  ];

  const songs = [
    {
      id: 1,
      title: "Song 1",
      artistId: 1,
    },
    {
      id: 2,
      title: "Song 2",
      artistId: 2,
    },
    {
      id: 3,
      title: "Song 3",
      artistId: 3,
    },
    {
      id: 4,
      title: "Song 4",
      artistId: 4,
    },
  ];

  // Get random 'numArtists' artists
  const shuffledArtists = artists.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedArtists = shuffledArtists.slice(0, numArtists); // Get a new array with 'numArtists' items
  // Get random 'numSongs' songs
  const shuffledSongs = songs.sort(() => 0.5 - Math.random()); // Shuffle the array
  const selectedSongs = shuffledSongs.slice(0, numSongs); // Get a new array with 'numArtists' items
  // Game state
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [attempts, setAttempts] = useState(numAttempts);
  // Game logic
  const handleSelectSong = (song) => {
    setSelectedSong(song);
    if (selectedArtist !== null) {
      if (song.artistId !== selectedArtist.id) {
        setAttempts(attempts - 1);
      }
      setSelectedSong(null);
      setSelectedArtist(null);
    }
  };
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    if (selectedSong !== null) {
      if (selectedSong.artistId !== artist.id) {
        setAttempts(attempts - 1);
      }
      setSelectedSong(null);
      setSelectedArtist(null);
    }
  };

  return (
    <div>
      <h1>{genre.toLocaleUpperCase()} Music Game</h1>
      <p>Attempts: {attempts}</p>
      <div>
        <h2>Songs</h2>
        <div>
          {selectedSongs.map((song) => (
            <div key={song.id}>
              <button onClick={() => handleSelectSong(song)}>
                <p>{song.title}</p>
              </button>
            </div>
          ))}
        </div>
        <h2>Artists</h2>
        <div>
          {selectedArtists.map((artist) => (
            <div key={artist.id}>
              <div>
                <img src={artist.image} alt={artist.name} />
              </div>
              <button onClick={() => handleSelectArtist(artist)}>
                <p>{artist.name}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
