import { PokemonAPI } from './pokemonAPI.js';
import { PokemonFuser } from './pokemonFuser.js';
import { ImageGenerator } from './imageGenerator.js';
import { ThemeManager } from './themeManager.js';

class PokemonFusionGame {
  constructor() {
    this.api = new PokemonAPI();
    this.fuser = new PokemonFuser();
    this.imageGenerator = new ImageGenerator();

    this.pokemon1Select = document.getElementById('pokemon1');
    this.pokemon2Select = document.getElementById('pokemon2');
    this.pokemon1Display = document.getElementById('pokemon1-display');
    this.pokemon2Display = document.getElementById('pokemon2-display');
    this.fuseButton = document.getElementById('fuse-btn');
    this.loadingElement = document.getElementById('loading');
    this.fusionResult = document.getElementById('fusion-result');
    this.fusionName = document.getElementById('fusion-name');
    this.fusionImage = document.getElementById('fusion-image');
    this.fusionStats = document.getElementById('fusion-stats');

    new ThemeManager(); // Initialize theme manager

    this.initialize();
  }

  async initialize() {
    try {
      const pokemonList = await this.api.getPokemonList();
      this.populateSelects(pokemonList);
      this.setupEventListeners();
      
      // Initially disable the fuse button
      this.updateFuseButtonState();
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }

  populateSelects(pokemonList) {
    const createOptions = async (select) => {
      // Default first option to hint at selection
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select a Pokemon';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      for (const pokemonSpecies of pokemonList) {
        const pokemonDetails = await this.api.getPokemonDetails(pokemonSpecies.name);
        const option = document.createElement('option');
        option.value = pokemonSpecies.name;

        const englishName = pokemonDetails.names['en'] || pokemonSpecies.name;
        const chineseName = pokemonDetails.names['zh-Hant-TW'] || pokemonDetails.names['zh-Hant'] || '';

        let displayName = englishName.charAt(0).toUpperCase() + englishName.slice(1);
        if (chineseName) {
          displayName += ` (${chineseName})`;
        }
        option.textContent = displayName;
        select.appendChild(option);
      }
    };

    createOptions(this.pokemon1Select);
    createOptions(this.pokemon2Select);

    this.updatePokemonDisplay(this.pokemon1Select, this.pokemon1Display);
    this.updatePokemonDisplay(this.pokemon2Select, this.pokemon2Display);
  }

  setupEventListeners() {
    this.pokemon1Select.addEventListener('change', () => {
      this.updatePokemonDisplay(this.pokemon1Select, this.pokemon1Display);
      this.updateFuseButtonState();
    });

    this.pokemon2Select.addEventListener('change', () => {
      this.updatePokemonDisplay(this.pokemon2Select, this.pokemon2Display);
      this.updateFuseButtonState();
    });

    this.fuseButton.addEventListener('click', () => this.fusePokemon());
  }

  // New method to update fuse button state
  updateFuseButtonState() {
    const pokemon1 = this.pokemon1Select.value;
    const pokemon2 = this.pokemon2Select.value;

    // Disable button if either Pokemon is not selected
    this.fuseButton.disabled = !pokemon1 || !pokemon2;
    
    // Toggle a class for styling
    this.fuseButton.classList.toggle('disabled', !pokemon1 || !pokemon2);
  }

  async updatePokemonDisplay(select, display) {
    const pokemonName = select.value;
    
    // If no Pokemon is selected, reset display
    if (!pokemonName) {
      display.innerHTML = '<div class="placeholder-icon">?</div>';
      return;
    }
    
    display.classList.add('loading'); 
    display.innerHTML = '<div class="placeholder-icon">?</div>';

    try {
      const pokemon = await this.api.getPokemonDetails(pokemonName);
      const img = new Image();
      img.src = pokemon.sprites.front_default;
      img.alt = pokemon.names['en'] || pokemonName;

      img.onload = () => {
        display.classList.remove('loading'); 
        display.innerHTML = ''; 
        display.appendChild(img); 
      };

      img.onerror = () => {
        display.classList.remove('loading'); 
        display.innerHTML = '<div class="placeholder-icon">?</div>'; 
        console.error('Failed to load image for:', pokemonName);
      };

    } catch (error) {
      console.error('Failed to update pokemon display:', error);
      display.classList.remove('loading'); 
      display.innerHTML = '<div class="placeholder-icon">?</div>'; 
    }
  }

  async fusePokemon() {
    try {
      this.showLoading(true);
      
      // Add collision animation
      document.querySelector('.pokemon-select').classList.add('pokemon-collision');
      
      // Create explosion effect
      const explosionElement = document.createElement('div');
      explosionElement.classList.add('fusion-explosion');
      document.querySelector('.pokemon-select').appendChild(explosionElement);

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 600));

      const pokemon1 = await this.api.getPokemonDetails(this.pokemon1Select.value);
      const pokemon2 = await this.api.getPokemonDetails(this.pokemon2Select.value);

      const fusionData = await this.fuser.createFusion(pokemon1, pokemon2);

      const imagePrompt = await this.fuser.generateImagePrompt(fusionData);
      const fusionImageUrl = await this.imageGenerator.generateImage(imagePrompt);

      // Remove collision and explosion classes/elements
      document.querySelector('.pokemon-select').classList.remove('pokemon-collision');
      explosionElement.remove();

      this.displayFusionResult(fusionData, fusionImageUrl);
    } catch (error) {
      console.error('Failed to fuse pokemon:', error);
      // Ensure collision classes are removed even if there's an error
      document.querySelector('.pokemon-select').classList.remove('pokemon-collision');
    } finally {
      this.showLoading(false);
    }
  }

  showLoading(show) {
    this.loadingElement.classList.toggle('hidden', !show);
    this.fusionResult.classList.toggle('hidden', show);
  }

  displayFusionResult(fusionData, imageUrl) {
    this.fusionName.textContent = fusionData.name;
    this.fusionImage.innerHTML = `<img src="${imageUrl}" alt="${fusionData.name}">`;

    this.fusionStats.innerHTML = `
      <h3>Type: ${fusionData.type.join(' / ')}</h3>
      <p>${fusionData.description}</p>
      <h3>Stats:</h3>
      <ul>
        ${Object.entries(fusionData.stats).map(([stat, value]) =>
          `<li>${stat}: ${value}</li>`
        ).join('')}
      </ul>
      <h3>Abilities:</h3>
      <p>${fusionData.abilities.join(', ')}</p>
    `;
  }
}

new PokemonFusionGame();