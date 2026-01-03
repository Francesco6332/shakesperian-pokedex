const CURRENT_POKEMON_KEY = 'currentPokemonName';

export const saveCurrentPokemonName = (name: string): void => {
    try {
        localStorage.setItem(CURRENT_POKEMON_KEY, name.toLowerCase());
    } catch (error) {
        console.error('Error saving Pokemon name to localStorage:', error);
    }
};

export const getCurrentPokemonName = (): string | null => {
    try {
        return localStorage.getItem(CURRENT_POKEMON_KEY);
    } catch (error) {
        console.error('Error reading Pokemon name from localStorage:', error);
        return null;
    }
};

export const clearCurrentPokemonName = (): void => {
    try {
        localStorage.removeItem(CURRENT_POKEMON_KEY);
    } catch (error) {
        console.error('Error clearing Pokemon name from localStorage:', error);
    }
};

