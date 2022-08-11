import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import dataPlus from '../data/poke_data.json'

import Card from './Card'

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
  const [pokemon_count, setPokemon_count] = useState(3)
  const [pokemon_Arr, setPokemon_Arr] = useState([])
  const [chosenPokemon, setChosenPokemon] = useState(
    localStorage.getItem('pokeArr') &&
      JSON.parse(localStorage.getItem('pokeArr'))
  )
  const [changeInCard, setChangeInCard] = useState({})

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
    const color = colors[type]
    pokemon.color = color
  }

  // adding Extra details to each card according to the id of pokemon
  // note same pokemon in both APIs have same ids
  const pokemonCardsData = pokemon => {
    const x = dataPlus.find(e => e.id === pokemon.id)
    const base = x.base
    pokemon.base = base
  }

  // pull pokemon list value from pokemon card component
  const get_pokemon = v => {
    setChangeInCard(v)
  }

  useEffect(() => {
    getPokeList()
  }, [])

  useEffect(() => {
    setChosenPokemon(JSON.parse(localStorage.getItem("pokeArr")))
  }, [changeInCard])

  return (
    <Container className='poke-list'>
      <div className='chosen-pokemon-list'>
        <h1>Your Set</h1>
        {chosenPokemon &&
          chosenPokemon.map((pokemon, i) => (
            <Card func={get_pokemon} pokemon={pokemon} i={i} key={i} />
          ))}
      </div>
      <div className='all-tiers'>
        <div className='tiers'>FIRST TIER</div>
        <div className='tiers'>SECOND TIER</div>
        <div className='tiers'>THIRD TIER</div>
      </div>
      <div className='poke-container' id='poke-container'>
        {pokemon_Arr &&
          pokemon_Arr.map((pokemon, i) => (
            <Card func={get_pokemon} pokemon={pokemon} i={i} key={i} />
          ))}
      </div>
    </Container>
  )
}

export default Pokelist
