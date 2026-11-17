import { pauseTimer, resetGameState } from '../state/game-state.js';

export function initBackButton() {
  const btnBack = document.getElementById('btn-back');
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');

  if (!btnBack || !homeScreen || !gameScreen) return;

  btnBack.addEventListener('click', () => {
    pauseTimer();
    resetGameState();
    
    gameScreen.classList.add('hidden');
    gameScreen.classList.remove('fade-in');
    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('fade-in');
    
    setTimeout(() => {
      homeScreen.classList.remove('fade-in');
    }, 300);
  });
}
