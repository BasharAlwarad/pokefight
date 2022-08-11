import React from 'react'

const Card = props => {
  const { pokemon, i } = props
  const onclick = e => {
    props.func(pokemon)

    if (e.target.classList.contains('clicked')) {
      // remove or add the class checked only from this element
      e.target.classList.remove('clicked')
      return
    } else {
      e.target.classList.add('clicked')
    }
    let arr = []
    if (localStorage.getItem('pokeArr')) {
      if (JSON.parse(localStorage.getItem('pokeArr')).length <= 10) {
        JSON.parse(localStorage.getItem('pokeArr')).forEach(e => {
          arr.push(e)
        })
        arr.push(pokemon)

        localStorage.setItem('pokeArr', JSON.stringify(arr))
      } else {
        alert('Max Pokemons count!')
      }
    } else {
      arr.push(pokemon)
      localStorage.setItem('pokeArr', JSON.stringify(arr))
    }
  }

  return (
    <div
      className='pokemon'
      onClick={e => onclick(e)}
      style={{ background: pokemon.color }}
    >
      <div className='img-container'>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
          alt=''
        />
      </div>
      <div className='info'>
        <span className='number'>{pokemon.id.toString().padStart(3, '0')}</span>
        <h3 className=''>
          {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <small className='type'>
          Type:{' '}
          <span>
            {pokemon.types[0].type.name} /{' '}
            {pokemon.types[1] && pokemon.types[1].type.name}
          </span>
        </small>
        {pokemon && pokemon.base && (
          <div className='cards-lists'>
            <ul className='cards-base-list'>
              <li>HP: {pokemon.base.HP}</li>
              <li>Attack: {pokemon.base.Attack}</li>
              <li>Defense: {pokemon.base.Defense}</li>
            </ul>
            <ul className='cards-base-list'>
              <li>Sp.Attack: {pokemon.base['Sp. Attack']}</li>
              <li>Sp.Defense: {pokemon.base['Sp. Defense']}</li>
              <li>Speed: {pokemon.base.Speed}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
