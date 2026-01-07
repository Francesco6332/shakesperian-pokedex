import type { PokemonSpeciesResponse } from '../types/pokemon';

export const searchPokemon = async (search: string): Promise<PokemonSpeciesResponse | undefined> => {
    try {
        const pokemonName = search.toLowerCase().trim();
        
        if (!pokemonName) {
            console.error('Nome Pokemon vuoto');
            return undefined;
        }
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Pokemon "${pokemonName}" non trovato`);
            } else {
                console.error(`Errore API PokeAPI: ${response.status} ${response.statusText}`);
            }
            return undefined;
        }
        
        const data = await response.json();
        return data as PokemonSpeciesResponse;
    } catch (error) {
        console.error('Errore nella ricerca Pokemon:', error);
        return undefined;
    }
}

export const getPokemonList = async (query: string): Promise<string[]> => {
    try {
        if (!query || query.trim().length === 0) {
            return [];
        }
        
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1000');
        
        if (!response.ok) {
            console.error(`Errore API PokeAPI (lista): ${response.status} ${response.statusText}`);
            return [];
        }
        
        const data = await response.json();
        
        if (!data?.results || !Array.isArray(data.results)) {
            console.error('Formato risposta PokeAPI non valido');
            return [];
        }
        
        const pokemonNames = data.results.map((pokemon: { name: string }) => pokemon.name);
        const queryLower = query.toLowerCase().trim();
        
        const filtered = pokemonNames.filter((name: string) => 
            name.toLowerCase().startsWith(queryLower)
        );
        
        return filtered.slice(0, 10);
    } catch (error) {
        console.error('Errore nel recupero lista Pokemon:', error);
        return [];
    }
}