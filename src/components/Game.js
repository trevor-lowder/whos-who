import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router";
import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

import Modal from "./Modal";

const Game = ({ numAttempts = 3 }) => {
  // Game state
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [gameSettings, setGameSettings] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(false);
  const [attempts, setAttempts] = useState(numAttempts);
  const [score, setScore] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(false);
  const [matches, setMatches] = useState(0); 
  const [gameOver, setGameOver] = useState(false); 
  const [solution, setSolution] = useState(""); 
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  // Game logic
  useEffect(() => {
    setTimeout(() => {
      const settings = JSON.parse(localStorage.getItem("gameSettings"));

      setAttempts(settings.numAttempts);
      setGameSettings(settings);
      setShowModal(false);

      populateSongsArtists(settings.numArtists, settings.numSongs);
      forceUpdate();
    }, 1000);
  }, []);

  const populateSongsArtists = (numArtists, numSongs) => {
    const allArtists = JSON.parse(localStorage.getItem("apiResults")).artists;
    const allSongs = JSON.parse(localStorage.getItem("apiResults")).songs;

    if (artists.length > 0) setArtists([]);
    if (songs.length > 0) setSongs([]);

    if (allSongs.length <= numSongs) {
      setGameOver(true);
      setShowModal(true);
      return;
    }

    while (songs.length < numSongs) {
      songs.push(allSongs.pop());
    }

    for (let item of songs) {
      artists.push(allArtists.find((e) => e.artistName === item.artistName));
    }

    while (artists.length < numArtists) {
      let tempArtist =
        allArtists[Math.floor(Math.random() * allArtists.length)];
      console.log("temp is ", tempArtist);
      if (artists.artistName !== tempArtist.artistName)
        artists.push(tempArtist);
    }

    localStorage.setItem(
      "apiResults",
      JSON.stringify({
        songs: allSongs,
        artists: allArtists,
      })
    );

    setSongs(_.shuffle(songs));
    setArtists(_.shuffle(artists));
  };

  const handleSelectSong = (song) => {
    console.log("Song is ", song, " matching is ", matches);
    setSelectedSong(song);
    if (selectedArtist !== false) {
      if (song.artistName !== selectedArtist.artistName) {
        console.log("FAILLED", " matches is ", matches);
        setAttempts(attempts - 1);
        setSelectedSong(false);
        setSelectedArtist(false);

        if (attempts - 1 === 0) {
          setShowModal(true);
          setIsPlaying(false);
          setShowModal(true)
        }
      }
      if (song.artistName == selectedArtist.artistName) {
        setScore(score + 100);
        setSelectedSong(false);
        setSelectedArtist(false);
        setMatches(matches + 1);

        if ((matches + 1) == gameSettings.numSongs) {
          setIsPlaying(false);
          setWon(true)
          setShowModal(true)

        }
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

        if (attempts - 1 === 0) {
          setShowModal(true);
          setIsPlaying(false);
          setShowModal(true)
        }
      }
      if (selectedSong.artistName == artist.artistName) {
        setScore(score + 100);
        setSelectedSong(false);
        setSelectedArtist(false);

        setMatches(matches + 1);


        setMatches(matches + 1)

        if ((matches + 1) == gameSettings.numSongs) {
          setIsPlaying(false);
          setWon(true)
          setShowModal(true)

        }
      }
    }
  };

  const handlePlayPause = (song) => {
    if (currentAudio !== null) {
      if (!currentAudio.paused && currentAudio.src === song.previewURL) {
        currentAudio.pause();
        setIsPlaying(false);
        return;
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
    }
    const audio = new Audio(song.previewURL);
    setCurrentAudio(audio);
    audio.play();
    setIsPlaying(true);
  };

  function HeartRow({ attempts }) {
    const maxHearts = 5;
    const numHearts = Math.min(attempts, maxHearts);
    const hearts = [];

    for (let i = 0; i < numHearts; i++) {
      hearts.push(<FavoriteIcon key={i} color="secondary" />);
    }

    return <div>{hearts}</div>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ height: "100%", padding: 0, overflow: "hidden" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          marginTop: "5rem",
          overflow: "hidden",
        }}
      >
        <Typography variant="h2" gutterBottom>
          {gameSettings.selectedGenre} Music Game
        </Typography>
        <Typography variant="h4" gutterBottom>
          Current Score: {score}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Attempts: <HeartRow attempts={attempts} />
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Songs
            </Typography>
            <div>
              {songs &&
                [...songs].map((song) => (
                  <div key={song.trackName}>
                    <Button
                      disabled={song == selectedSong}
                      style={{ fontSize: "20px" }}
                      onClick={() => handleSelectSong(song)}
                    >
                      <p>{song.trackName}</p>
                    </Button>
                    {isPlaying && currentAudio.src === song.previewURL ? (
                      <Button
                        onClick={() => {
                          handlePlayPause(song);
                        }}
                      >
                        <PauseIcon />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handlePlayPause(song);
                        }}
                      >
                        <PlayArrowIcon />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Artists
            </Typography>
            <div>
              {artists &&
                _.chunk([...artists], 2).map((chunk, index) => (
                  <Grid key={index} container spacing={2}>
                    {chunk.map((artist) => (
                      <Grid key={artist.artistName} item xs={12} sm={6}>
                        <Button
                          disabled={artist == selectedArtist}
                          style={{ fontSize: "18px" }}
                          onClick={() => handleSelectArtist(artist)}
                        >
                          <div>
                            <img
                              style={{ width: "150px", height: "150px" }}
                              onClick={() => handleSelectArtist(artist)}
                              src={artist.artistImg}
                              alt={artist.artistName}
                            />
                            <p>{artist.artistName}</p>
                          </div>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                ))}
            </div>
          </Grid>
        </Grid>
        {showModal && (
          currentAudio.pause(),
          < Modal
            won={won}
            attempts={attempts}
            solution={solution}
            score={score}
            gameOver={gameOver}
            onClose={() => {
              setShowModal(false);
              window.location.reload(false);
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default Game;
