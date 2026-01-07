import React from 'react';
import './favouritesButton.scss';
import HeartIcon from '../../assets/icons/heart.svg';
import { useState, useEffect } from 'react';
import type { Pokemon } from '../../types/pokemon';
import { addToFavourites, removeFromFavourites, isFavourite, getAllFavourites } from '../../services/pokefavourite';

interface FavouritesButtonProps {
    pokemon: Pokemon;
}

export const FavouritesButton: React.FC<FavouritesButtonProps> = ({ pokemon }) => {
    const [isFav, setIsFav] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        loadFavouriteState();
        
        const handleFavouritesChanged = () => {
            loadFavouriteState();
        };
        
        window.addEventListener('favouritesChanged', handleFavouritesChanged);
        
        return () => {
            window.removeEventListener('favouritesChanged', handleFavouritesChanged);
        };
    }, [pokemon.name]);

    const loadFavouriteState = async () => {
        try {
            const isInFavourites = await isFavourite(pokemon.name);
            setIsFav(isInFavourites);
        } catch (error) {
            console.error('Errore nel verificare lo stato del favorito:', error);
        }
    };

   

    const handleToggleFavourite = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isFav) {
                const success = await removeFromFavourites(pokemon.name);
                if (success) {
                    setIsFav(false);
                }
            } else {
                await addToFavourites(pokemon);
                setIsFav(true);
            }
        } catch (error) {
            console.error('Errore nel gestire il favorito:', error);
            alert('Errore nel salvare il favorito. Controlla la console per maggiori dettagli.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            className={`favourites-button ${isFav ? 'active' : ''}`} 
            onClick={handleToggleFavourite}
            disabled={isLoading}
            title={isFav ? 'Rimuovi dai favoriti' : 'Aggiungi ai favoriti'}
        >
            <div className="heart-icon-wrapper">
                <img src={HeartIcon} alt="Heart" className={isFav ? 'active' : ''} />
            </div>
        </button>
    );
};

