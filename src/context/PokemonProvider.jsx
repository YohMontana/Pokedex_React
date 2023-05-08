import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";

export const PokemonProvider = ({ children }) => {
  const [allPokemon, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  // Estados para la aplicacion simples
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(false)

  // Llamar 50 pokemones a la API
  const getAllPokemons = async (limit = 50) => {
    const baseUrl = "https://pokeapi.co/api/v2/";

    const res = await fetch(
      `${baseUrl}pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setAllPokemons(results);
    setLoading(false)

  };

  // Llamar todos los pokemones
  const getGlobalPokemons = async () => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setGlobalPokemons(results);
    setLoading(false)
  };

  //Llamar a un pokemon por ID
  const getPokemonById = async (id) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseUrl}pokemon/${id}`);
    const data = await res.json()
    return data

  };

  useEffect(() => {
    getAllPokemons();
  }, []);

  useEffect(() => {
    getGlobalPokemons;
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        numero: 0,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};