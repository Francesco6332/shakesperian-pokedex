import { FAVOURITES_KEY } from '../components/favourites-section/favourites';
import type { Pokemon } from '../types/pokemon';
import { envConfig, configStatus } from '../config/environment';
import { 
    addFavouriteToFirebase, 
    removeFavouriteFromFirebase, 
    getAllFavouritesFromFirebase,
    isFavouriteInFirebase,
    type Favourite 
} from './firebaseFavourites';

export type { Favourite };


export async function addToFavourites(pokemon: Pokemon): Promise<Favourite> {
    const useFirebase = envConfig.storage.provider === 'firebase_storage';
    
    console.log('🔍 Storage provider configurato:', envConfig.storage.provider);
    console.log('🔍 Usa Firebase?', useFirebase);
    console.log('🔍 Firebase configurato?', configStatus.firebase.isValid);

    if (useFirebase) {
        try {
            console.log('📤 Tentativo di salvare in Firebase:', pokemon.name);
            const favourite = await addFavouriteToFirebase({
                name: pokemon.name,
                shakespeareanDescription: pokemon.shakespeareanDescription,
                originalDescription: pokemon.originalDescription,
            });
            if (favourite) {
                console.log('✅ Favorito salvato in Firebase:', favourite);
                window.dispatchEvent(new CustomEvent('favouritesChanged'));
                return favourite;
            }
            throw new Error('Impossibile aggiungere il favorito');
        } catch (error) {
            console.error('❌ Errore nell\'aggiungere ai favoriti Firebase, uso localStorage:', error);
            console.error('Dettagli errore:', error instanceof Error ? error.message : error);
            return addToFavouritesLocal(pokemon);
        }
    }

    console.log('💾 Usando localStorage (provider:', envConfig.storage.provider, ')');
    return addToFavouritesLocal(pokemon);
}

export async function removeFromFavourites(pokemonName: string): Promise<boolean> {
    const useFirebase = envConfig.storage.provider === 'firebase_storage';

    if (useFirebase) {
        try {
            const success = await removeFavouriteFromFirebase(pokemonName);
            if (success) {
                console.log('Favorito rimosso da Firebase:', pokemonName);
                // Notifica che i favoriti sono cambiati
                window.dispatchEvent(new CustomEvent('favouritesChanged'));
            }
            return success;
        } catch (error) {
            console.error('Errore nella rimozione da Firebase, uso localStorage:', error);
            return removeFromFavouritesLocal(pokemonName);
        }
    }

    return removeFromFavouritesLocal(pokemonName);
}

export async function getAllFavourites(): Promise<Favourite[]> {
    const useFirebase = envConfig.storage.provider === 'firebase_storage';

    if (useFirebase) {
        try {
            return await getAllFavouritesFromFirebase();
        } catch (error) {
            console.error('Errore nel recuperare i favoriti da Firebase, uso localStorage:', error);
            return getFavouritesLocal();
        }
    }

    return getFavouritesLocal();
}

export async function isFavourite(pokemonName: string): Promise<boolean> {
    const useFirebase = envConfig.storage.provider === 'firebase_storage';

    if (useFirebase) {
        try {
            return await isFavouriteInFirebase(pokemonName);
        } catch (error) {
            console.error('Errore nel verificare favorito in Firebase, uso localStorage:', error);
            return isFavouriteLocal(pokemonName);
        }
    }

    return isFavouriteLocal(pokemonName);
}

function addToFavouritesLocal(pokemon: Pokemon): Favourite {
    const savedFavourites = getFavouritesLocal();

    const existingIndex = savedFavourites.findIndex(fav => fav.name === pokemon.name);
    if (existingIndex !== -1) {
        return savedFavourites[existingIndex];
    }
    
    const newFavourite: Favourite = {
        id: crypto.randomUUID(),
        name: pokemon.name,
        shakespeareanDescription: pokemon.shakespeareanDescription,
        originalDescription: pokemon.originalDescription || '',
    };
    
    savedFavourites.push(newFavourite);
    
    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(savedFavourites));
        console.log('Favorito salvato in localStorage:', newFavourite);
        
        window.dispatchEvent(new CustomEvent('favouritesChanged'));
    } catch (error) {
        console.error('Errore nel salvare in localStorage:', error);
        throw error;
    }
    
    return newFavourite;
}

function removeFromFavouritesLocal(pokemonName: string): boolean {
    const favourites = getFavouritesLocal();
    const filtered = favourites.filter(fav => fav.name !== pokemonName);
    
    if (filtered.length === favourites.length) {
        return false;
    }
    
    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(filtered));
        console.log('Favorito rimosso da localStorage:', pokemonName);
        
        window.dispatchEvent(new CustomEvent('favouritesChanged'));
    } catch (error) {
        console.error('Errore nel rimuovere da localStorage:', error);
        throw error;
    }
    
    return true;
}

function getFavouritesLocal(): Favourite[] {
    const savedFavourites = localStorage.getItem(FAVOURITES_KEY);
    return savedFavourites ? JSON.parse(savedFavourites) : [];
}

function isFavouriteLocal(pokemonName: string): boolean {
    const favourites = getFavouritesLocal();
    return favourites.some(fav => fav.name === pokemonName);
}