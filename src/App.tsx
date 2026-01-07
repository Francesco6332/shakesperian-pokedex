import './App.css'
import PokemonSearch from './components/pokemon-search/PokeSearch'
import PokeDisplay from './components/pokemon-display/PokeDisplay'
import FavouritesSection from './components/favourites-section/favourites'

function App() {

  return (
    <div className="app-container">
      <div className="search-section">
        <PokemonSearch />
      </div>
      <div className="results-section">
        <PokeDisplay />
      </div>
      <div className="favourites-section">
        <FavouritesSection />
      </div>
    </div>
  )
}

export default App
