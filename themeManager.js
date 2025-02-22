export class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.moonIcon = this.themeToggle.querySelector('.moon');
    this.sunIcon = this.themeToggle.querySelector('.sun');
    
    // Add accessibility attributes
    this.themeToggle.setAttribute('aria-label', 'Toggle color theme');
    this.themeToggle.setAttribute('aria-pressed', 'false');

    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update accessibility state
    this.themeToggle.setAttribute('aria-pressed', theme === 'dark');

    // Optional: Add a slight animation to theme toggle
    this.animateThemeToggle();
  }

  animateThemeToggle() {
    this.themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      this.themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(this.currentTheme);
  }
}