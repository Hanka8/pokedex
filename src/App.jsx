import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';

import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

function App() { 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(20);

  useEffect(() => {
  setLoading(true);

  axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${(currentPage - 1) * resultsPerPage}&limit=${resultsPerPage}`)
    .then(res => {
      setLoading(false);
      setTotalPages(Math.ceil(res.data.count / resultsPerPage));

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
}, [currentPage, resultsPerPage]);


  function handlePageChange(event, newPage) {
    setCurrentPage(newPage);
  }

  function handleResultsPerPageChange(event) {
    setResultsPerPage(event.target.value);
  }

  return (
    <>
    <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Results per page
      </InputLabel>
      <NativeSelect
        defaultValue={20}
        inputProps={{
          name: 'age',
          id: 'uncontrolled-native',
        }}
        onChange={handleResultsPerPageChange}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </NativeSelect>
    </FormControl>

      <PokemonList 
        pokemonData={pokemonData} 
      />

      <Pagination
        className='pagination'
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />

    </>
  );
}

export default App;