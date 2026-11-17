import { subscribe, toggleHelpOverlay } from '../state/game-state.js';

export function initHelpButton() {
  const btnHelp = document.getElementById('btn-help');
  if (!btnHelp) return;

  subscribe((state) => {
    // Visible solo en N2 y N3
    if (state.currentLevel === 2 || state.currentLevel === 3) {
      btnHelp.style.display = 'block';
    } else {
      btnHelp.style.display = 'none';
    }
  });

  btnHelp.addEventListener('click', () => {
    toggleHelpOverlay();
  });
}
