import React from 'react'

export default function pokemonList({ pokemon }) {
  return (
    <div>
       {pokemon.map(p => (
        <p key={p}>{p}</p>
       ))}
    </div>
  )
}
