export interface Pokemon {
  name: string;
  shakespeareanDescription: string;
  originalDescription?: string; // Opzionale, per riferimento
}

export interface PokemonSpeciesResponse {
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface ShakespeareTranslationResponse {
  success: {
    total: number;
  };
  contents: {
    translated: string;
    text: string;
    translation: string;
  };
}

export interface ApiError {
  message: string;
  code?: string | number;
}

