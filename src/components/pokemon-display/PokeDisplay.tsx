import './PokeDisplay.scss';
import React, { useState, useEffect } from 'react';
import type { Pokemon } from '../../types/pokemon';
import { getShakespeareanDescription } from '../../services/pokedisplay';
import { getCurrentPokemonName } from '../../utils/localStorage';

const PokeDisplay: React.FC = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPokemon = async (pokemonName: string) => {
        setLoading(true);
        setError(null);
        
        const result = await getShakespeareanDescription(pokemonName);
        
        if (result) {
            setPokemon(result);
        } else {
            setError('Failed to load Pokemon description. Please try again.');
            setPokemon(null);
        }
        
        setLoading(false);
    };

    useEffect(() => {
        // Load Pokemon from localStorage on mount
        const currentPokemonName = getCurrentPokemonName();
        if (currentPokemonName) {
            loadPokemon(currentPokemonName);
        }

        // Listen for search events
        const handlePokemonSearch = (event: CustomEvent) => {
            loadPokemon(event.detail);
        };

        window.addEventListener('pokemonSearch', handlePokemonSearch as EventListener);
        
        return () => {
            window.removeEventListener('pokemonSearch', handlePokemonSearch as EventListener);
        };
    }, []);

    if (loading) {
        return (
            <div className="poke-display-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="poke-display-container">
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!pokemon) {
        return (
            <div className="poke-display-container">
                <p>Search for a Pokemon to see its Shakespearean description!</p>
            </div>
        );
    }

    return (
        <div className="poke-display-container">
            <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
            <p className="description">{pokemon.shakespeareanDescription}</p>
        </div>
    );
};

export default PokeDisplay;