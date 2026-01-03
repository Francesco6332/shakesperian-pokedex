import React, { useEffect, useRef } from 'react';
import './PokeSearch.scss';    
import { useState } from 'react';
import { searchPokemon, getPokemonList } from '../../services/pokesearch';
import { saveCurrentPokemonName } from '../../utils/localStorage';

const PokemonSearch: React.FC = () => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (search.trim().length > 0) {
            getPokemonList(search).then(results => {
                setSuggestions(results);
                setShowDropdown(results.length > 0);
                setSelectedIndex(-1);
            });
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = (pokemonName: string) => {
        if (!pokemonName.trim()) {
            alert('Please enter a Pokemon name');
            return;
        }

        saveCurrentPokemonName(pokemonName);

        searchPokemon(pokemonName).then(data => {
            console.log('Pokemon data:', data);
            setSearch('');
            setShowDropdown(false);
            window.dispatchEvent(new CustomEvent('pokemonSearch', { detail: pokemonName }));
        }).catch(error => {
            console.error('Error searching for Pokemon:', error);
            alert('Error searching for Pokemon. Please try again.');
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        performSearch(search);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                performSearch(suggestions[selectedIndex]);
            } else {
                performSearch(search);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (pokemonName: string) => {
        performSearch(pokemonName);
    };

    return(
        <div className="pokemon-search-container">
            <img src="/logo.png" alt="Logo" className="logo" />
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search for a Pokemon" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => search.trim().length > 0 && suggestions.length > 0 && setShowDropdown(true)}
                    />
                    {showDropdown && suggestions.length > 0 && (
                        <div ref={dropdownRef} className="dropdown">
                            {suggestions.map((pokemon, index) => (
                                <div
                                    key={pokemon}
                                    className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => handleSuggestionClick(pokemon)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {pokemon}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" onClick={handleSubmit}>Search</button>
            </form>
        </div>
    );
};

export default PokemonSearch;

