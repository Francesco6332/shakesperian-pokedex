import { 
    collection, 
    doc, 
    addDoc, 
    deleteDoc, 
    getDocs, 
    query, 
    where,
    Timestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

export interface Favourite {
    id: string;
    name: string;
    shakespeareanDescription: string;
    originalDescription: string;
    createdAt?: Timestamp;
}

const FAVOURITES_COLLECTION = 'favourites';

export async function addFavouriteToFirebase(pokemon: { name: string; shakespeareanDescription: string; originalDescription?: string }): Promise<Favourite | null> {
    if (!db || !isFirebaseConfigured) {
        throw new Error('Firebase non è configurato');
    }

    try {
        const existingFavourite = await getFavouriteByName(pokemon.name);
        if (existingFavourite) {
            return existingFavourite;
        }

        const favouriteData = {
            name: pokemon.name,
            shakespeareanDescription: pokemon.shakespeareanDescription,
            originalDescription: pokemon.originalDescription || '',
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, FAVOURITES_COLLECTION), favouriteData);
        
        return {
            id: docRef.id,
            ...favouriteData,
        };
    } catch (error) {
        console.error('Errore nell\'aggiungere il favorito a Firestore:', error);
        throw error;
    }
}

export async function removeFavouriteFromFirebase(pokemonName: string): Promise<boolean> {
    if (!db || !isFirebaseConfigured) {
        throw new Error('Firebase non è configurato');
    }

    try {
        const favourite = await getFavouriteByName(pokemonName);
        if (!favourite) {
            return false;
        }

        await deleteDoc(doc(db, FAVOURITES_COLLECTION, favourite.id));
        return true;
    } catch (error) {
        console.error('Errore nella rimozione del favorito:', error);
        throw error;
    }
}

async function getFavouriteByName(name: string): Promise<Favourite | null> {
    if (!db || !isFirebaseConfigured) {
        return null;
    }

    try {
        const q = query(collection(db, FAVOURITES_COLLECTION), where('name', '==', name));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        } as Favourite;
    } catch (error) {
        console.error('Errore nel recuperare il favorito:', error);
        return null;
    }
}

export async function isFavouriteInFirebase(pokemonName: string): Promise<boolean> {
    const favourite = await getFavouriteByName(pokemonName);
    return favourite !== null;
}

export async function getAllFavouritesFromFirebase(): Promise<Favourite[]> {
    if (!db || !isFirebaseConfigured) {
        return [];
    }

    try {
        const querySnapshot = await getDocs(collection(db, FAVOURITES_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Favourite));
    } catch (error) {
        console.error('Errore nel recuperare i favoriti:', error);
        return [];
    }
}

