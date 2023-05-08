import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import { useForm } from "../hook/useForm";

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  // Utilizar CustomHook - useForm
  const {valueSearch, onInputChange, onResetForm} = useForm({
    valueSearch: ''
  })


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

    setAllPokemons([...allPokemons, ...results]);
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
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonById
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
