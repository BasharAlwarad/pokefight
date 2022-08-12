import React, { useEffect, useState } from 'react'
import { useChannelStateContext, useChatContext } from 'stream-chat-react'
import Square from './Square'
import { Patterns } from '../WinningPatterns'
import Card from './Card'
import BackCard from './BackCard'
import Cookies from 'universal-cookie'

function Board({ you, other, result, setResult }) {
  // const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
  const [pokemonArr, setPokemonArr] = useState(
    JSON.parse(localStorage.getItem('pokeArr'))
  )
  const [owner, setOwner] = useState(you && you)
  const [rival, setRival] = useState(other && other)
  const [player, setPlayer] = useState(owner && owner)
  const [turn, setTurn] = useState(owner && owner)
  const { channel } = useChannelStateContext()
  const { client } = useChatContext()
  const [chosenCard, setChosenCard] = useState({})
  const [chosenPokemonTurn, setChosenPokemonTurn] = useState('')
  const cookies = new Cookies()

  const [realYou, setRealYou] = useState(
    cookies.get('username') && cookies.get('username')
  )
  const [rivalCard, setRivalCard] = useState({})

  // useEffect(() => {
  //   checkIfTie()
  //   checkWin()
  // }, [board])

  const get_pokemon = v => {
    setChosenCard(v)
  }
  console.log(chosenCard)

  const chooseSquare = async square => {
    if (turn === player) {
      setTurn(player === owner ? rival : owner)
    }
    let sendData = chosenCard

    await channel.sendEvent({
      type: 'game-move',
      data: { player, sendData },
    })

    // setBoard(
    //   board.map((val, idx) => {
    //     if (idx === square && val === '') {
    //       return player
    //     }
    //     return val
    //   })
    // )
  }

  // const checkWin = () => {
  //   Patterns.forEach(currPattern => {
  //     const firstPlayer = board[currPattern[0]]
  //     if (firstPlayer == '') return
  //     let foundWinningPattern = true
  //     currPattern.forEach(idx => {
  //       if (board[idx] != firstPlayer) {
  //         foundWinningPattern = false
  //       }
  //     })

  //     if (foundWinningPattern) {
  //       setResult({ winner: board[currPattern[0]], state: 'won' })
  //     }
  //   })
  // }

  // const checkIfTie = () => {
  //   let filled = true
  //   board.forEach(square => {
  //     if (square == '') {
  //       filled = false
  //     }
  //   })

  //   if (filled) {
  //     setResult({ winner: 'none', state: 'tie' })
  //   }
  // }

  channel.on(event => {
    // Note next line needed in next if
    // && event.user.id !== client.userID
    if (event.type == 'game-move') {
      const currentPlayer = event.data.player === owner ? rival : owner
      setPlayer(currentPlayer)
      setTurn(currentPlayer)
      setRivalCard(event && event.data && event.data.chosenCard)
      console.log(rivalCard && event.data)
      // setBoard(
      //   board.map((val, idx) => {
      //     if (idx === event.data.square && val === '') {
      //       return event.data.player
      //     }
      //     return val
      //   })
      // )
    }
  })

  return (
    <div className='board'>
      {owner === realYou ? (
        <>
          <div className='row'>
            {pokemonArr &&
              pokemonArr.map(e => (
                <Card
                  fromBoard
                  choose={chooseSquare}
                  func={get_pokemon}
                  pokemon={e}
                />
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
              // val={board[4]}
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
              // val={board[4]}
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
                <Card
                  fromBoard
                  choose={chooseSquare}
                  func={get_pokemon}
                  pokemon={e}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Board
