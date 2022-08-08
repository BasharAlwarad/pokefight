import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import dataPlus from '../data/poke_data.json'

function Pokelist() {
  const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
  }
  const [pokemon_count, setPokemon_count] = useState(30)
  const [pokemon_Arr, setPokemon_Arr] = useState([])

  // creating pokemon list array & adding background func
  const getPokeList = async () => {
    try {
      let arr = []
      for (let i = 1; i <= pokemon_count; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`
        const res = await fetch(url)
        const data = await res.json()
        pokemonCardsColors(data)
        pokemonCardsData(data)
        arr.push(data)
        console.log(arr)
      }
      setPokemon_Arr(arr)
    } catch (error) {
      console.error(error.message)
    }
  }

  // adding background colors to each card according to the type of pokemon
  const pokemonCardsColors = pokemon => {
    const main_types = Object.keys(colors)
    const poke_types = pokemon.types[0].type.name
    const type = main_types.find(e => poke_types.indexOf(e) > -1)
    console.log(type)
    const color = colors[type]
    pokemon.color = color
  }

  // adding Extra details to each card according to the id of pokemon
  // note same pokemon in both APIs have same ids
  const pokemonCardsData = pokemon => {
    const x = dataPlus.find(e => e.id === pokemon.id)
    const base =  x.base
    pokemon.base = base
  }

  useEffect(() => {
    getPokeList()
  }, [])

  return (
    <Container className='poke-list'>
      <div className='all-tiers'>
        <div className='tiers'>FIRST TIER</div>
        <div className='tiers'>SECOND TIER</div>
        <div className='tiers'>THIRD TIER</div>
      </div>
      <div className='poke-container' id='poke-container'>
        {pokemon_Arr &&
          pokemon_Arr.map((pokemon, i) => (
            <div
              key={i}
              className='pokemon'
              style={{ background: pokemon.color }}
            >
              <div className='img-container'>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                  alt=''
                />
              </div>
              <div className='info'>
                <span className='number'>
                  {pokemon.id.toString().padStart(3, '0')}
                </span>
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
                      <li>Sp. Attack: {pokemon.base['Sp. Attack']}</li>
                      <li>Sp. Defense: {pokemon.base['Sp. Defense']}</li>
                      <li>Speed: {pokemon.base.Speed}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </Container>
  )
}

export default Pokelist
