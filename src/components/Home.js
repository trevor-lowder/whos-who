import React, { useEffect, useState } from 'react'
import fetchFromSpotify, { request } from '../services/api'

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [songCount, setSongCount] = useState('1')
  const [artistPerChoice, setArtistPerChoice] = useState('2')
  const [authLoading, setAuthLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [token, setToken] = useState('')

  const loadGenres = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'recommendations/available-genre-seeds',
    })
    console.log(response)
    setGenres(response.genres)
    setConfigLoading(false)
  }

  const searchGenre = async t => {
    // setConfigLoading(true)
    // console.log(typeof genre)
    console.log("t is " + JSON.parse(t).value)
    console.log("here ", selectedGenre, artistPerChoice)
    const response = await fetchFromSpotify({
      token: JSON.parse(t).value,
      endpoint: 'search',
      params: {
        q: 'genre%3A' + selectedGenre,
        type: 'artist%2Ctrack',
        market: 'US',
        limit: artistPerChoice,
        offset: 0
      }
    })
    console.log("search is ", response)
    // setConfigLoading(false)
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

      Genre:
      <select
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

      Number of Songs:
      <select
        value={songCount}
        onChange={event => setSongCount(event.target.value)}
      // defaultValue="1"
      >
        <option value="1">1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
      </select>
      {console.log("soung count " + songCount)}

      Number of Artists per Choice:
      <select
        value={artistPerChoice}
        onChange={event => setArtistPerChoice(event.target.value)}
      // defaultValue='2'
      >
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
      </select>
      {console.log("artist " + artistPerChoice)}
      {console.log(selectedGenre)}
      <button
        onClick={() => searchGenre(localStorage.getItem(TOKEN_KEY))}
      >
        Start Game!</button>
    </div >
  )
}

export default Home
