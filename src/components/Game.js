import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import _ from "lodash";
import FavoriteIcon from "@material-ui/icons/Favorite";
const Game = () => {
  // Game state
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [gameSettings, setGameSettings] = useState([]);
  const [selectedSong, setSelectedSong] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(false);
  const [matches, setMatches] = useState(0); //should be set to NumOfSongs and decremented for every correct match and won set to true at 0
  const [gameOver, setGameOver] = useState(false); //not sure if needs to be state, but gameOver is set to true if the remaining songs from localStorage is less than songs to play game
  const [solution, setSolution] = useState(""); //again this probably doesn't need to be state should probalby just pass in the songs list for the round

  // Game logic
  useEffect(() => {
    // const spotifyData = JSON.parse(localStorage.getItem("apiResults"));
    const settings = JSON.parse(localStorage.getItem("gameSettings"));

    // setArtists(spotifyData.artists);
    // setSongs(spotifyData.songs);
    setAttempts(settings.numAttempts);
    setGameSettings(settings);
    setMatches(settings.numSongs);
    console.log(
      "Page Loading",
      settings,
      settings.numArtists,
      settings.numSongs
    );

    populateSongsArtists(settings.numArtists, settings.numSongs);

    // populateSongsArtists(settings.numArtists, settings.numSongs);
  }, []);

  const populateSongsArtists = (numArtists, numSongs) => {
    const allArtists = JSON.parse(localStorage.getItem("apiResults")).artists;
    const allSongs = JSON.parse(localStorage.getItem("apiResults")).songs;

    if (artists.length > 0) setArtists([]);
    if (songs.length > 0) setSongs([]);

    console.log(allSongs.length, numSongs);
    if (allSongs.length <= numSongs) {
      setGameOver(true);
      setShowModal(true);
      return;
    }

    while (songs.length < numSongs) {
      songs.push(allSongs.pop());
    }
    console.log("Starting songs ", songs);

    for (let item of songs) {
      artists.push(allArtists.find((e) => e.artistName === item.artistName));
    }
    console.log("starting Artists ", artists);
    while (artists.length < numArtists) {
      let tempArtist =
        allArtists[Math.floor(Math.random() * allArtists.length)];
      console.log("temp is ", tempArtist);
      if (artists.artistName !== tempArtist.artistName)
        artists.push(tempArtist);
    }

    console.log("Finsihed artist ", artists);
    localStorage.setItem(
      "apiResults",
      JSON.stringify({
        songs: allSongs,
        artists: allArtists,
      })
    );
  };
  const handleSelectSong = (song) => {
    console.log("Song is ", song);
    setSelectedSong(song);
    // console.log("selectedSong is ", selectedSong)
    if (selectedArtist !== false) {
      if (song.artistName !== selectedArtist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(false);
        setSelectedArtist(false);

        if (attempts - 1 === 0) {
          setTimeout(() => setShowModal(true), 500);
        }
      }
      if (song.artistName == selectedArtist.artistName) {
        console.log("I'm Here and score is ", score);
        setScore(score + 100);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
    }
  };
  const handleSelectArtist = (artist) => {
    console.log("Artist is ", artist);
    setSelectedArtist(artist);

    if (selectedSong !== false) {
      if (selectedSong.artistName !== artist.artistName) {
        setAttempts(attempts - 1);
        setSelectedSong(false);
        setSelectedArtist(false);

        if (attempts === 0) {
          setTimeout(() => setShowModal(true), 500);
        }
      }
      if (selectedSong.artistName == artist.artistName) {
        setScore(score + 100);
        setSelectedSong(false);
        setSelectedArtist(false);
      }
    }
  };

  const handlePlayPause = (song) => {
    if (currentAudio !== null) {
      if (!currentAudio.paused && currentAudio.src === song.previewURL) {
        currentAudio.pause();
        setIsPlaying(false); // pause current song if it's playing and the same song is clicked again
        return;
      } else {
        currentAudio.pause();
        setIsPlaying(false); // pause current song if a different song is clicked
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
              {[...songs].map((song) => (
                <div key={song.trackName}>
                  <Button onClick={() => handleSelectSong(song)}>
                    <p>{song.trackName}</p>
                  </Button>
                  {isPlaying && currentAudio.src === song.previewURL ? (
                    <Button
                      onClick={() => {
                        handlePlayPause(song);
                      }}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handlePlayPause(song);
                      }}
                    >
                      Play
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
              {_.chunk([...artists], 2).map((chunk, index) => (
                <Grid key={index} container spacing={2}>
                  {chunk.map((artist) => (
                    <Grid key={artist.artistName} item xs={12} sm={6}>
                      <div>
                        <img src={artist.artistImg} alt={artist.artistName} />
                      </div>
                      <Button onClick={() => handleSelectArtist(artist)}>
                        <p>{artist.artistName}</p>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </div>
          </Grid>
        </Grid>
        {showModal && (
          <Modal
            won={won}
            attempts={attempts}
            solution={solution}
            score={score}
            gameOver={gameOver}
          />
        )}
      </Box>
    </Container>
  );
};

export default Game;
