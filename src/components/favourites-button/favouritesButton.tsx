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
    const [favouritesCount, setFavouritesCount] = useState<number>(0);

    useEffect(() => {
        loadFavouriteState();
        loadFavouritesCount();
    }, [pokemon.name]);

    const loadFavouriteState = async () => {
        try {
            const isInFavourites = await isFavourite(pokemon.name);
            setIsFav(isInFavourites);
        } catch (error) {
            console.error('Errore nel verificare lo stato del favorito:', error);
        }
    };

    const loadFavouritesCount = async () => {
        try {
            const favourites = await getAllFavourites();
            setFavouritesCount(favourites.length);
        } catch (error) {
            console.error('Errore nel caricare il conteggio dei favoriti:', error);
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
                    setFavouritesCount(prev => Math.max(0, prev - 1));
                }
            } else {
                await addToFavourites(pokemon);
                setIsFav(true);
                setFavouritesCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Errore nel gestire il favorito:', error);
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
            <span className="favourites-count">{favouritesCount}</span>
        </button>
    );
};

