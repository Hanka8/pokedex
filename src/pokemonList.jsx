import React from 'react'
import App from './App'

export default function pokemonList({ pokemon }) {
  return (
    <div className='pokedex-box'>
       {pokemon.map(p => (
        <div className='pokedex-card' key={p}>{p}</div>
       ))}
    </div>
  )
}
