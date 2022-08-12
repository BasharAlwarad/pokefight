import React, { useEffect, useState } from 'react'
import { useChannelStateContext, useChatContext } from 'stream-chat-react'
import Square from './Square'
import { Patterns } from '../WinningPatterns'
import Card from './Card'
import BackCard from './BackCard'
import Cookies from 'universal-cookie'

function Board({ you, other, result, setResult }) {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
  const [pokemonArr, setPokemonArr] = useState(
    JSON.parse(localStorage.getItem('pokeArr'))
  )
  const [player, setPlayer] = useState('X')
  const [turn, setTurn] = useState('X')
  const [owner, setOwner] = useState(you && you)
  const [rival, setRival] = useState(other && other)
  const { channel } = useChannelStateContext()
  const { client } = useChatContext()
  const [chosenCard, setChosenCard] = useState({})
  const [chosenPokemonTurn, setChosenPokemonTurn] = useState('')
  const cookies = new Cookies()

  const [realYou, setRealYou] = useState(
    cookies.get('username') && cookies.get('username')
  )

  useEffect(() => {
    checkIfTie()
    checkWin()
  }, [board])

  const chooseSquare = async square => {
    if (turn === player && board[square] === '') {
      setTurn(player === 'X' ? 'O' : 'X')

      await channel.sendEvent({
        type: 'game-move',
        data: { square, player },
      })
      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === '') {
            return player
          }
          return val
        })
      )
    }
  }

  const checkWin = () => {
    Patterns.forEach(currPattern => {
      const firstPlayer = board[currPattern[0]]
      if (firstPlayer == '') return
      let foundWinningPattern = true
      currPattern.forEach(idx => {
        if (board[idx] != firstPlayer) {
          foundWinningPattern = false
        }
      })

      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: 'won' })
      }
    })
  }

  const checkIfTie = () => {
    let filled = true
    board.forEach(square => {
      if (square == '') {
        filled = false
      }
    })

    if (filled) {
      setResult({ winner: 'none', state: 'tie' })
    }
  }

  channel.on(event => {
    if (event.type == 'game-move' && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === 'X' ? 'O' : 'X'
      setPlayer(currentPlayer)
      setTurn(currentPlayer)
      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === '') {
            return event.data.player
          }
          return val
        })
      )
    }
  })

  const get_pokemon = v => {
    setChosenCard(v)
  }

  return (
    <div className='board'>
      {owner === realYou ? (
        <>
          <div className='row'>
            {pokemonArr &&
              pokemonArr.map(e => (
                <Card fromBoard choose={chooseSquare} func={get_pokemon} pokemon={e} />
              ))}
          </div>
          <div className='row'>
            <div
              className='chosen-pokemon-yours'
              style={{
                backgroundImage: ` url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${chosenCard.id}.svg")`,
              }}
            ></div>
            <Square
              owner={owner}
              realYou={realYou}
              val={board[4]}
              chooseSquare={() => {
                chooseSquare(4)
              }}
            />
            <BackCard />
          </div>
          <div className='row'>
            {pokemonArr && pokemonArr.map(e => <BackCard />)}
          </div>
        </>
      ) : (
        <>
          <div className='row'>
            {pokemonArr && pokemonArr.map(e => <BackCard />)}
          </div>
          <div className='row'>
            <BackCard />
            <Square
              owner={owner}
              realYou={realYou}
              val={board[4]}
              chooseSquare={() => {
                chooseSquare(4)
              }}
            />

            <div
              className='chosen-pokemon-yours'
              style={{
                backgroundImage: ` url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${chosenCard.id}.svg")`,
              }}
            ></div>
          </div>
          <div className='row'>
            {pokemonArr &&
              pokemonArr.map(e => (
                <Card fromBoard choose={chooseSquare} func={get_pokemon} pokemon={e} />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Board
