import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import fetchFromSpotify, { request } from '../services/api'

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('pop')
  const [songCount, setSongCount] = useState('1')
  const [artistPerChoice, setArtistPerChoice] = useState('2')
  const [authLoading, setAuthLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [token, setToken] = useState('')
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  // const [artImg, setArtImg] = useState('')

  const loadGenres = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'recommendations/available-genre-seeds'
    })
    // console.log(response)
    setGenres(response.genres)
    setConfigLoading(false)
  }

  const searchGenre = async () => {
    console.log("songs ", songCount, " numArt ", setArtistPerChoice, " genre ", selectedGenre)
    let songsToAdd = []
    let artistToGetById = []
    let artistToAdd = []
    console.log("token ", token)
    await fetchFromSpotify({
      token: token,
      endpoint: 'search',
      params: {
        q: 'genre%3A' + selectedGenre,
        type: 'artist%2Ctrack',
        // market: 'US',
        limit: artistPerChoice,
        offset: 0
      }
    }).then(response => {
      // console.log("response is ", response),
      response.tracks.items.forEach(track => {
        artistToGetById.push(track.artists[0].id),
          // console.log("artists ids ", artistToGetById),
          songsToAdd.push(
            {
              trackName: track.name,
              artistName: track.artists[0].name,
              previewURL: track.preview_url
            }
          )


      response.artists.items.forEach(artist => {
        artistToAdd.push(
          {
            artistName: artist.name,
            artistImg: artist.images[2].url
          }
        )
      })

      setSongs(songsToAdd)
      setArtists(artistToAdd)

      localStorage.setItem(
        "gameSettings", JSON.stringify({
          selectedGenre: selectedGenre,
          numSongs: songCount,
          numArtists: artistPerChoice,
          songs: songs,
          artists: artists
        }))

    })


  }

  const randomize = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  useEffect(() => {
    setAuthLoading(true)

    const storedTokenString = localStorage.getItem(TOKEN_KEY)
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expiration > Date.now()) {
        console.log('Token found in localstorage')
        setAuthLoading(false)
        setToken(storedToken.value)
        loadGenres(storedToken.value)
        return
      }
    }
    console.log('Sending request to AWS endpoint')
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken))
      setAuthLoading(false)
      setToken(newToken.value)
      loadGenres(newToken.value)
    })
  }, [])

  if (authLoading || configLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Spotify Guessing Game</h1>
      <p>To play the game either: 1. Click 'State Game' button and play with default options or 2. Change the options for the game first. </p>

      <label htmlFor="genre-choice">Genre:</label>
      {/* <input
        type="text"
        list="genre-choices"
        id="genre-choice"
        name="genre-choice"
        placeholder={selectedGenre}
        onClick={event => event.target.value = ""}
        onChange={event => setSelectedGenre(event.target.value)}
      /> */}
      <select id='genre-choices'
        value={selectedGenre}
        // defaultValue={genres[Math.floor(Math.random() * genres.length)]}
        onChange={event => setSelectedGenre(event.target.value)}
      >
        <option value='' />
        {genres.map(genre => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <button onClick={() => setSelectedGenre(genres[Math.floor(Math.random() * genres.length)])}>Pick Random Genre</button>

      Number of Songs:
      <select
        value={songCount}
        onChange={event => setSongCount(event.target.value)}
      >
        <option value="1">1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
      </select>
      {/* {console.log("soung count " + songCount)} */}

      Number of Artists per Choice:
      <select
        value={artistPerChoice}
        onChange={event => setArtistPerChoice(event.target.value)}
      >
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
      </select>
      {/* {console.log("artist " + artistPerChoice)} */}
      {/* {console.log(selectedGenre)} */}
      <Link to={"/play"}>
        <button
          onClick={() => {
            // { console.log("numSong ", songCount, " numArtist ", artistPerChoice, " genre ", selectedGenre) }
            searchGenre()
          }}
        >
          Start Game!
        </button>
      </Link>
      {/* {console.log("songs to pass ", songs)} */}
      {/* {console.log("artists to pass ", artists)} */}

      <button
        onClick={() => {
          setArtistPerChoice(randomize(2, 4));
          setSongCount(randomize(1, 3));
          setSelectedGenre(genres[Math.floor(Math.random() * genres.length)]);
          { console.log("numSong ", songCount, " numArtist ", artistPerChoice, " genre ", selectedGenre) }
          searchGenre()
        }}

      >
        Randomize Game</button>
    </div >
  )
}

export default Home
