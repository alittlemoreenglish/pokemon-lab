export class ImageGenerator {
  constructor() {
    this.pollinationsEndpoint = 'https://image.pollinations.ai/prompt/';
  }

  async generateImage(prompt) {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Create the full URL for the image
    const imageUrl = `${this.pollinationsEndpoint}${encodedPrompt}`;
    
    // Return the URL - Pollinations.ai will generate the image on demand when the URL is loaded
    return imageUrl;
  }
}