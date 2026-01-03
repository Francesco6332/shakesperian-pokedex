import './App.css'
import PokemonSearch from './components/pokemon-search/PokeSearch'
import PokeDisplay from './components/pokemon-display/PokeDisplay'

function App() {

  return (
    <div className="app-container">
      <div className="search-section">
        <PokemonSearch />
      </div>
      <div className="results-section">
        <PokeDisplay />
      </div>
    </div>
  )
}

export default App
