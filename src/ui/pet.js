import { subscribe } from '../state/game-state.js';
import { getRandomMessage, getNextPetInfo, getCurrentLanguage, translations } from '../i18n/translations.js';
import { playUnlockSound } from './sounds.js';

function getNextPetSvg(petName) {
  const petId = petName.toLowerCase().split(' ')[0];
  return `/assets/images/pets/${petId}.svg`;
}

export function initPet() {
  const petArea = document.getElementById('pet-area');
  const container = document.getElementById('active-pet-container');
  const messageContainer = document.getElementById('pet-message-container');
  if (!container || !petArea) return;

  let messageTimeout = null;
  let lastEventShown = null;

  subscribe((state) => {
    const hasPet = state.currentPet !== null;
    const nextPetInfo = getNextPetInfo(state.gems, state.unlockedPets || []);

    // Render pet or progress indicator
    if (hasPet) {
      // Pet unlocked - show it
      container.innerHTML = `<img src="${state.currentPet.icon}" alt="${state.currentPet.name}" class="pet-display-icon" />`;
      container.style.display = 'flex';
      petArea.style.display = 'flex';
    } else if (nextPetInfo) {
      // No pet yet - show ONLY progress message, NO pet image
      container.innerHTML = '';
      container.style.display = 'none';
      petArea.style.display = 'flex';
    } else {
      // All pets unlocked
      container.innerHTML = '';
      container.style.display = 'none';
      petArea.style.display = 'none';
    }

    // Handle reactions and messages
    if (state.lastEvent && state.lastEvent !== lastEventShown) {
      lastEventShown = state.lastEvent;
      
      // Pet unlock celebration
      if (state.lastEvent === 'pet-unlock') {
        playUnlockSound();
        launchConfetti();
        
        if (messageContainer) {
          if (messageTimeout) clearTimeout(messageTimeout);
          
          const unlockMessages = [
            '¡Nueva mascota desbloqueada! ',
            '¡Logro desbloqueado! ',
            '¡Felicidades! ',
            '¡Nuevo compañero! '
          ];
          const message = unlockMessages[Math.floor(Math.random() * unlockMessages.length)];
          messageContainer.textContent = message;
          messageContainer.classList.add('show');
          
          messageTimeout = setTimeout(() => {
            messageContainer.classList.remove('show');
          }, 3000);
        }
        
        return;
      }
      
      // Only show reactions if pet is unlocked
      if (hasPet) {
        container.classList.remove('pet-celebrate', 'pet-comfort');
        void container.offsetWidth;
        
        if (state.lastEvent === 'success') {
          container.classList.add('pet-celebrate');
        } else if (state.lastEvent === 'error' || state.lastEvent === 'timeout') {
          container.classList.add('pet-comfort');
        }
        
        setTimeout(() => {
          container.classList.remove('pet-celebrate', 'pet-comfort');
        }, 1000);
      }
      
      // Show message
      if (messageContainer) {
        if (messageTimeout) {
          clearTimeout(messageTimeout);
        }
        
        let message = '';
        
        if (hasPet) {
          // Pet is unlocked - show motivational messages
          const messageType = state.lastEvent === 'success' ? 'success' : 'error';
          message = getRandomMessage(messageType);
        } else if (nextPetInfo) {
          // No pet yet - show progress messages
          message = getRandomMessage('progress', {
            gems: state.gems,
            remaining: nextPetInfo.remaining,
            nextPet: nextPetInfo.name
          });
        }
        
        if (message) {
          messageContainer.textContent = message;
          messageContainer.classList.add('show');
          
          messageTimeout = setTimeout(() => {
            messageContainer.classList.remove('show');
          }, 2500);
        }
      }
    }
    
    // Reset lastEventShown when event is cleared
    if (!state.lastEvent) {
      lastEventShown = null;
    }
  });
}

function launchConfetti() {
  const colors = ['#5BC0EB', '#7ED957', '#FFD93D', '#FF6B6B', '#C084FC', '#FF69B4'];
  const confettiCount = 50;
  const container = document.body;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    const shape = Math.random();
    if (shape < 0.33) {
      confetti.style.borderRadius = '50%';
    } else if (shape < 0.66) {
      confetti.style.borderRadius = '0';
    } else {
      confetti.style.width = '8px';
      confetti.style.height = '16px';
      confetti.style.borderRadius = '2px';
    }
    
    container.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
}
