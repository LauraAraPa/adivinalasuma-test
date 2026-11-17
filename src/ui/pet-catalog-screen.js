import { PET_CATALOG } from '../core/pet-catalog.js';
import { getState, subscribe, pauseTimer, resumeTimer } from '../state/game-state.js';
import { getCurrentLanguage, translations } from '../i18n/translations.js';

export function initPetCatalogScreen() {
  const container = document.getElementById('pet-catalog-container');
  const btnOpen = document.getElementById('btn-pet-catalog');
  const btnClose = document.getElementById('btn-close-catalog');
  const btnBackCatalog = document.getElementById('btn-back-catalog');
  const grid = container ? container.querySelector('.pet-grid') : null;

  if (!container || !grid) return;

  renderCatalog(grid, getState());
  subscribe((state) => renderCatalog(grid, state));

  const openCatalog = () => {
    pauseTimer('catalog');
    container.classList.remove('hidden');
  };

  const closeCatalog = () => {
    container.classList.add('hidden');
    resumeTimer('catalog');
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', openCatalog);
  }

  if (btnClose) {
    btnClose.addEventListener('click', closeCatalog);
  }

  if (btnBackCatalog) {
    btnBackCatalog.addEventListener('click', closeCatalog);
  }

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !container.classList.contains('hidden')) {
      closeCatalog();
    }
  });
}

function renderCatalog(grid, state) {
  grid.innerHTML = '';
  const unlockedIds = state.unlockedPets || [];
  const lang = getCurrentLanguage();

  PET_CATALOG.forEach(pet => {
    const isUnlocked = unlockedIds.includes(pet.id);
    const card = document.createElement('div');
    card.className = `pet-card ${isUnlocked ? 'pet-card--unlocked' : 'pet-card--locked'}`;
    
    const petNameKey = `pet.${pet.id}`;
    const petName = translations[lang][petNameKey] || pet.name;
    const gemSuffix = pet.threshold === 1 ? translations[lang]['gem.suffix'] : translations[lang]['gems.suffix'];

    card.innerHTML = `
      <img src="${pet.icon}" alt="${petName}" class="pet-icon" />
      <div class="pet-name">${petName}</div>
      <div class="pet-threshold">${pet.threshold} ${gemSuffix}</div>
      ${!isUnlocked ? '<div class="pet-lock">🔒</div>' : ''}
    `;
    grid.appendChild(card);
  });
}
