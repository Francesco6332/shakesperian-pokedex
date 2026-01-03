import type { PokemonSpeciesResponse } from '../types/pokemon';

export const searchPokemon = async (search: string): Promise<PokemonSpeciesResponse | undefined> => {
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${search.toLowerCase()}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data as PokemonSpeciesResponse;
    }
    catch(error){
        console.error('Error searching for Pokemon:', error);
        return undefined;
    }
}

export const getPokemonList = async (query: string): Promise<string[]> => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1000');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const pokemonNames = data.results.map((pokemon: { name: string }) => pokemon.name);
        
        const filtered = pokemonNames.filter((name: string) => 
            name.toLowerCase().startsWith(query.toLowerCase())
        );
        
        return filtered.slice(0, 10);
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        return [];
    }
}