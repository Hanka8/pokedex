import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function App() { 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
  setLoading(true);

  axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${(currentPage - 1) * 20}&limit=20`)
    .then(res => {
      setLoading(false);
      setTotalPages(Math.ceil(res.data.count / 20));

      // Use Promise.all to wait for all Pokemon details requests
      const pokemonDetailsPromises = res.data.results.map(p =>
        axios.get(p.url)
          .then(res => ({
            name: res.data.name,
            img: res.data.sprites.front_default,
          }))
          .catch(error => {
            console.error('Error:', error.message);
            return null;
          })
      );

      Promise.all(pokemonDetailsPromises)
        .then(pokemonDetails => {
          // Filter out any failed requests
          const validPokemonDetails = pokemonDetails.filter(details => details !== null);
          setPokemonData(validPokemonDetails);
        })
        .catch(error => {
          console.error('Error fetching Pokemon details:', error.message);
        });
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}, [currentPage]);


  function handlePageChange(event, newPage) {
    setCurrentPage(newPage);
  }

  if (loading) return "Loading...";

  return (
    <>
      <PokemonList 
        pokemonData={pokemonData} 
      />

      <Stack spacing={2} mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </>
  );
}

export default App;