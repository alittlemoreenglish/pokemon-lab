export class PokemonFuser {
  async createFusion(pokemon1, pokemon2) {
    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a fusion of two Pokemon: ${pokemon1.name} and ${pokemon2.name}.
          Generate a creative combination including a fusion name, type, description, stats, and abilities.
          
          interface PokemonFusion {
            name: string;
            type: string[];
            description: string;
            stats: {
              hp: number;
              attack: number;
              defense: number;
              speed: number;
            };
            abilities: string[];
          }
          
          {
            "name": "Pikasaur",
            "type": ["Electric", "Grass"],
            "description": "A unique fusion of Pikachu and Bulbasaur, combining electrical powers with plant-based abilities.",
            "stats": {
              "hp": 65,
              "attack": 75,
              "defense": 70,
              "speed": 85
            },
            "abilities": ["Volt Growth", "Static Garden"]
          }
          `,
          data: {
            pokemon1: {
              name: pokemon1.name,
              types: pokemon1.types.map(t => t.type.name),
              stats: pokemon1.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
              }, {}),
              abilities: pokemon1.abilities.map(a => a.ability.name)
            },
            pokemon2: {
              name: pokemon2.name,
              types: pokemon2.types.map(t => t.type.name),
              stats: pokemon2.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
              }, {}),
              abilities: pokemon2.abilities.map(a => a.ability.name)
            }
          }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to create fusion:', error);
      throw error;
    }
  }

  async generateImagePrompt(fusionData) {
    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a detailed image generation prompt for the Pokemon fusion: ${fusionData.name}. Analyze their key visual characteristics and create a detailed image generation prompt
                    Focus on key visual elements like:
          - Body shape and structure
          - Distinctive features (ears, tail, wings, etc)
          - Color patterns and markings
          - Special characteristics (fur, scales, etc)
          - Size and proportions
          - Notable facial features
          - Any iconic visual elements
          
          Create a detailed image generation prompt that captures the fusion of their visual traits.
          
          interface ImagePrompt {
            prompt: string;
          }
          
          {
            "prompt": "A Pokemon fusion sprite in pixel art style, combining the red cheek pouches and pointed ears of Pikachu with the majestic quadrupedal form and golden wheel structure of Arceus, front-facing game asset style with crisp pixel edges, 32-bit color depth reminiscent of Pokemon FireRed, maintaining clear sprite proportions."
          }
          `,
          data: fusionData
        })
      });

      const result = await response.json();
      return result.prompt;
    } catch (error) {
      console.error('Failed to generate image prompt:', error);
      throw error;
    }
  }
}