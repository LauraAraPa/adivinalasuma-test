import { initHomeScreen } from './ui/home-screen.js';
import { initGameScreen } from './ui/game-screen.js';
import { initInputArea } from './ui/input-area.js';
import { initGemCounter } from './ui/gem-counter.js';
import { initFeedback } from './ui/feedback.js';
import { initSounds } from './ui/sounds.js';
import { initTheme } from './ui/theme.js';
import { initI18n } from './i18n/translations.js';
import { initPetCatalogScreen } from './ui/pet-catalog-screen.js';
import { initPet } from './ui/pet.js';
import { initBackButton } from './ui/back-button.js';
import { initHelpButton } from './ui/help-button.js';
import { initHelpOverlay } from './ui/help-overlay.js';
import { initTutorialScreen } from './ui/tutorial-screen.js';
import { initEducationalFeedback } from './ui/educational-feedback.js';

console.log("Adivina la Suma cargado");

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  initHomeScreen();
  initGameScreen();
  initInputArea();
  initGemCounter();
  initFeedback();
  initSounds();
  initPetCatalogScreen();
  initPet();
  initBackButton();
  initHelpButton();
  initHelpOverlay();
  initEducationalFeedback();
});
