import React from 'react'
import styled from 'styled-components'

const ModalContainer = styled.div` 
  background: rgba(255,255,255,0.7);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`
const ModalDiv = styled.div` 
  max-width: 480px;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  margin: 10% auto;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
`
const LostDiv = styled.div`

`

const Modal = ({ won, attempts, solution, score, gameOver }) => {
  return (
    <ModalContainer>
      {won && (
        <ModalDiv>
          <h1>You Win!</h1>
          <h2>{score}</h2>
          <p>{solution}</p>
          <p>You bet the round with {attempts} attempts left</p>
          <div>
            <button>Try Again</button>
            <button>Home</button>
          </div>
        </ModalDiv>
      )}
      {!won && (
        <ModalDiv>
          <h1>Do you listen to music?!</h1>
          <h2>{score}</h2>
          <p>{solution}</p>
          <p>Give it another try!</p>
          <div>
            <button>Try Again</button>
            <button>Home</button>
          </div>
        </ModalDiv>
      )}
      {gameOver && (
        <ModalDiv>
          <h1>Game Over</h1>
          <h2>{score}</h2>
          <p>Great game! You know you wanna play some more!!</p>
          <div>
            <button>Try Again</button>
            <button>Home</button>
          </div>
        </ModalDiv>
      )}

      {/* <h4>Final Score: {score}</h4> */}

    </ModalContainer>

  )
}

export default Modal