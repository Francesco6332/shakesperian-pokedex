import type { FlavorTextEntry, Pokemon } from "../types/pokemon";
import { searchPokemon } from './pokesearch';
import { translateToShakespeare } from './shakespeareApi';

export const getShakespeareanDescription = async (pokemonName: string): Promise<Pokemon | undefined> => {
    try {
        const speciesData = await searchPokemon(pokemonName);
        if (!speciesData) {
            return undefined;
        }

        const englishEntry = speciesData.flavor_text_entries.find(
            (entry: FlavorTextEntry) => entry.language.name === 'en'
        );

        if (!englishEntry) {
            console.error('No English flavor text found');
            return undefined;
        }

        const shakespeareanText = await translateToShakespeare(englishEntry.flavor_text);
        
        const description = shakespeareanText || englishEntry.flavor_text;

        const pokemon: Pokemon = {
            name: speciesData.name,
            shakespeareanDescription: description,
            originalDescription: englishEntry.flavor_text,
        };

        return pokemon;
    } catch (error) {
        console.error('Error getting Shakespearean description:', error);
        return undefined;
    }
};