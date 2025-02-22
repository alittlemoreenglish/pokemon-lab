export class PokemonAPI {
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2';
  }

  async getPokemonList(limit = 151) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon-species?limit=${limit}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Failed to fetch pokemon list:', error);
      throw error;
    }
  }

  async getPokemonDetails(nameOrId) {
    try {
      const pokemonResponse = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`);
      const pokemonData = await pokemonResponse.json();
      const speciesResponse = await fetch(`${this.baseUrl}/pokemon-species/${nameOrId}`);
      const speciesData = await speciesResponse.json();

      // Extract names in different languages
      const names = speciesData.names.reduce((acc, nameEntry) => {
        acc[nameEntry.language.name] = nameEntry.name;
        return acc;
      }, {});

      return {
        ...pokemonData,
        names
      };
    } catch (error) {
      console.error('Failed to fetch pokemon details:', error);
      throw error;
    }
  }
}