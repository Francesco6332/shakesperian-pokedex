import React, { useState, useEffect } from 'react';
import './favourites.scss';
import { getAllFavourites, removeFromFavourites, type Favourite } from '../../services/pokefavourite';

export const FAVOURITES_KEY = 'favourites';

const FavouritesSection: React.FC = () => {
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadFavourites();
            
        const handleFavouritesChanged = () => {
            loadFavourites();
        };
        
        window.addEventListener('favouritesChanged', handleFavouritesChanged);
        
        return () => {
            window.removeEventListener('favouritesChanged', handleFavouritesChanged);
        };
    }, []);

    const loadFavourites = async () => {
        setIsLoading(true);
        try {
            const favs = await getAllFavourites();
            setFavourites(favs);
        } catch (error) {
            console.error('Errore nel caricare i favoriti:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFavourite = async (pokemonName: string) => {
        try {
            const success = await removeFromFavourites(pokemonName);
            if (success) {
                setFavourites(prev => prev.filter(fav => fav.name !== pokemonName));
            }
        } catch (error) {
            console.error('Errore nella rimozione del favorito:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="favourites-section">
                <h2>Favourites</h2>
                <p className="loading-message">Caricamento...</p>
            </div>
        );
    }

    return (
        <div className="favourites-section">
            <h2>Favourites ({favourites.length})</h2>
            
            {favourites.length === 0 ? (
                <p className="empty-message">Nessun favorito salvato</p>
            ) : (
                <ul className="favourites-list">
                    {favourites.map((favourite) => (
                        <li key={favourite.id} className="favourite-item">
                            <div className="favourite-content">
                                <h3 className="favourite-name">{favourite.name}</h3>
                                <p className="favourite-description">
                                    {favourite.shakespeareanDescription}
                                </p>
                                {favourite.originalDescription && (
                                    <p className="favourite-original">
                                        Originale: {favourite.originalDescription}
                                    </p>
                                )}
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveFavourite(favourite.name)}
                                title="Rimuovi dai favoriti"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavouritesSection;