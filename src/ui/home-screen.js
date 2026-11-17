import { setLevel, shouldShowTutorial } from '../state/game-state.js';
import { initTutorialScreen } from './tutorial-screen.js';

export function initHomeScreen() {
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const petCatalogContainer = document.getElementById('pet-catalog-container');
  const levelButtons = document.querySelectorAll('.level-button');
  const petsButton = document.getElementById('btn-home-pets');

  levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const level = parseInt(e.target.dataset.level);
      if (isNaN(level)) return;

      // Verificar si debe mostrar el tutorial
      if (shouldShowTutorial(level)) {
        showTutorialScreen(level);
        return;
      }

      setLevel(level);
      transitionToGame();
    });
  });

  if (petsButton) {
    petsButton.addEventListener('click', () => {
      if (petCatalogContainer) {
        petCatalogContainer.classList.remove('hidden');
      }
    });
  }
}

function showTutorialScreen(level) {
  const homeScreen = document.getElementById('home-screen');
  const tutorialScreen = document.getElementById('tutorial-screen');
  
  homeScreen.classList.add('fade-out');
  
  setTimeout(() => {
    homeScreen.classList.add('hidden');
    homeScreen.classList.remove('fade-out');
    tutorialScreen.classList.remove('hidden');
    tutorialScreen.classList.add('fade-in');
    
    setTimeout(() => {
      tutorialScreen.classList.remove('fade-in');
      initTutorialScreen(level);
    }, 300);
  }, 300);
}

function transitionToGame() {
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');

  homeScreen.classList.add('fade-out');

  setTimeout(() => {
    homeScreen.classList.add('hidden');
    homeScreen.classList.remove('fade-out');
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('fade-in');

    setTimeout(() => {
      gameScreen.classList.remove('fade-in');
    }, 300);
  }, 300);
}
