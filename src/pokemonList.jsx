import React from 'react'

export default function pokemonList({ pokemonData}) {
  return (
    <div className='pokedex-box'>
       {pokemonData.map(pokemon => (
          <div className='pokemon-box' key={pokemon.id}>
            <img src={pokemon.img} alt={pokemon.name}/>
            <p>{pokemon.name}</p>
          </div>
       ))
       }
    </div>
  )
}