import React, { useState } from 'react'
import Board from './Board'
import { Window, MessageList, MessageInput } from 'stream-chat-react'
import './Chat.css'

function Game({ channel, setChannel }) {
  console.log(channel && Object.values(channel.state.members)[0].user.name)
  console.log(channel && Object.values(channel.state.members)[1].user.name)
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  )
  const [result, setResult] = useState({ winner: 'none', state: 'none' })

  const [current, setCurrent] = useState(
    channel && Object.values(channel.state.members)[0].user.name
  )
  const [rival, setRival] = useState(
    channel && Object.values(channel.state.members)[0].user.name
  )

  channel.on('user.watching.start', event => {
    setPlayersJoined(event.watcher_count === 2)
  })

  if (!playersJoined) {
    return <div> Waiting for other player to join...</div>
  }
  return (
    <div className='gameContainer'>
      <Board
        you={current}
        other={rival}
        result={result}
        setResult={setResult}
      />
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={['react']}
        />
        <MessageInput noFiles />
      </Window>
      <button
        className='leave-game'
        onClick={async () => {
          await channel.stopWatching()
          setChannel(null)
        }}
      >
        X
      </button>
      {result.state === 'won' && <div> {result.winner} Won The Game</div>}
      {result.state === 'tie' && <div> Game Tied</div>}
    </div>
  )
}

export default Game
