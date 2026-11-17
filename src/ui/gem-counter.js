import { subscribe, getState } from '../state/game-state.js';

let previousGems = 0;

export function initGemCounter() {
  previousGems = getState().gems;
  subscribe(render);
}

function render(state) {
  const gemCount = document.querySelector('.gem-count');
  const gemIcon = document.querySelector('.gem-icon');
  
  if (!gemCount) return;
  
  gemCount.textContent = state.gems;
  
  if (state.gems > previousGems && gemIcon) {
    gemIcon.classList.remove('gem-bounce');
    void gemIcon.offsetWidth;
    gemIcon.classList.add('gem-bounce');
    
    setTimeout(() => {
      gemIcon.classList.remove('gem-bounce');
    }, 500);
  }
  
  previousGems = state.gems;
}
