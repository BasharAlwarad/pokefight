import React from 'react'

function Square({ owner, realYou, chooseSquare, val }) {
  console.log(owner)
  console.log(realYou)
  return (
    <div className='square' onClick={chooseSquare}>
      {owner === realYou ? (
        <>
          <div>
            Your Score: <b>1</b>
          </div>
          
          <div>
            Rival Score: <b>2</b>
          </div>
          {val}
        </>
      ) : (
        <>
          <div>
            Your Score: <b>2</b>
          </div>
          <div>
            Rival Score: <b>1</b>
          </div>
          {val}
        </>
      )}
    </div>
  )
}

export default Square
