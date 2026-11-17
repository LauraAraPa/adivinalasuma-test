import { generateSum } from '../core/sum-generator.js';
import { validateAnswer } from '../core/validator.js';
import { LEVEL_TIMERS } from '../config.js';
import { PET_CATALOG } from '../core/pet-catalog.js';

const gameState = {
  currentLevel: null,
  currentSum: null,
  gems: 0,
  hits: 0,
  errors: 0,
  lastEvent: null,
  timeRemaining: 0,
  timerInterval: null,
  timerHandles: {},
  timerPaused: false,
  timerPauseReasons: new Set(),
  unlockedPets: [],
  currentPet: null,
  helpOverlayOpen: false,
  tutorialCompleted: { 2: false, 3: false },
  educationalFeedbackCount: { 2: 0, 3: 0 },
  subscribers: []
};

export function getState() {
  return { ...gameState };
}

export function setLevel(level) {
  gameState.currentLevel = level;
  
  // Reset feedback educativo al cambiar de nivel
  if (gameState.educationalFeedbackCount[level] === undefined) {
    gameState.educationalFeedbackCount[level] = 0;
  }
  
  gameState.currentSum = generateSum(level);
  gameState.timeRemaining = LEVEL_TIMERS[level] || 15;
  startTimer();
  notifySubscribers();
}

export function markTutorialCompleted(level) {
  gameState.tutorialCompleted[level] = true;
  notifySubscribers();
}

export function shouldShowTutorial(level) {
  return (level === 2 || level === 3) && !gameState.tutorialCompleted[level];
}

export function incrementEducationalFeedback() {
  if (gameState.currentLevel) {
    gameState.educationalFeedbackCount[gameState.currentLevel]++;
    notifySubscribers();
  }
}

export function shouldShowEducationalFeedback() {
  const level = gameState.currentLevel;
  if (!level || level === 1) return false;
  return gameState.educationalFeedbackCount[level] < 5;
}

export function getEducationalFeedbackCount() {
  return gameState.educationalFeedbackCount[gameState.currentLevel] || 0;
}

export function startTimer() {
  // Limpiar intervalo anterior si existe
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
  
  // No iniciar si está pausado
  if (gameState.timerPaused && gameState.timerPauseReasons.size > 0) {
    return;
  }
  
  gameState.timerInterval = setInterval(() => {
    if (gameState.timerPaused) return;
    
    gameState.timeRemaining--;
    
    if (gameState.timeRemaining <= 5 && gameState.timeRemaining > 0) {
      gameState.lastEvent = 'warning';
    }
    
    if (gameState.timeRemaining <= 0) {
      gameState.timeRemaining = 0;
      gameState.errors++;
      gameState.lastEvent = 'timeout';
      
      // Limpiar el intervalo antes de pausar
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
      }
      
      pauseTimer('timeout');
      gameState.timerHandles.timeout = setTimeout(() => {
        nextSum();
      }, 1000);
    }
    
    notifySubscribers();
  }, 1000);
}

export function pauseTimer(reason) {
  if (reason) {
    gameState.timerPauseReasons.add(reason);
  }
  gameState.timerPaused = true;
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
  notifySubscribers();
}

export function resumeTimer(reason) {
  if (reason) {
    gameState.timerPauseReasons.delete(reason);
  }
  if (gameState.timerPauseReasons.size === 0) {
    gameState.timerPaused = false;
  }
  // Reiniciar el timer si estaba detenido y ya no hay razones de pausa
  if (!gameState.timerInterval && !gameState.timerPaused) {
    startTimer();
  }
  notifySubscribers();
}

export function resetTimer() {
  gameState.timeRemaining = LEVEL_TIMERS[gameState.currentLevel] || 15;
  notifySubscribers();
}

export function submitAnswer(userAnswer) {
  if (!gameState.currentSum) {
    throw new Error('Game not initialized. Call setLevel() first.');
  }
  
  // Cerrar help overlay al enviar respuesta
  if (gameState.helpOverlayOpen) {
    gameState.helpOverlayOpen = false;
  }
  
  const isCorrect = validateAnswer(gameState.currentSum, userAnswer);
  
  let unlocked = false;
  
  if (isCorrect) {
    gameState.gems++;
    gameState.hits++;
    unlocked = checkPetUnlocks();
    // Solo setear 'success' si no hay un evento más importante (como pet-unlock)
    if (!unlocked) {
      gameState.lastEvent = 'success';
    }
  } else {
    gameState.errors++;
    gameState.lastEvent = 'error';
  }
  
  // Incrementar contador de feedback educativo si aplica
  if (gameState.currentLevel && gameState.currentLevel !== 1) {
    incrementEducationalFeedback();
  }
  
  pauseTimer('answer');
  notifySubscribers();
  
  // Si desbloqueó mascota, esperar 3s para la celebración
  if (unlocked) {
    gameState.timerHandles.petUnlock = setTimeout(() => {
      resumeTimer('answer');
      resumeTimer('petUnlock');
      nextSum();
    }, 3000);
  } else {
    // Verificar si hay feedback educativo visible
    const feedbackCount = gameState.educationalFeedbackCount[gameState.currentLevel] || 0;
    const shouldShowFeedback = gameState.currentLevel && 
      gameState.currentLevel !== 1 && 
      (gameState.lastEvent === 'success' || gameState.lastEvent === 'error') &&
      feedbackCount <= 5;
    
    if (shouldShowFeedback) {
      // No reanudar el timer - esperar a que el usuario cierre el feedback educativo
      // El timer se reanudará en closeEducationalFeedback()
      gameState.timerHandles.answer = setTimeout(() => {
        nextSum();
      }, 800);
    } else {
      gameState.timerHandles.answer = setTimeout(() => {
        resumeTimer('answer');
        nextSum();
      }, 800);
    }
  }
  
  return isCorrect;
}

function checkPetUnlocks() {
  if (!PET_CATALOG || PET_CATALOG.length === 0) return false;

  let newUnlock = false;
  PET_CATALOG.forEach(pet => {
    if (gameState.gems >= pet.threshold && !gameState.unlockedPets.includes(pet.id)) {
      gameState.unlockedPets.push(pet.id);
      newUnlock = true;
    }
  });

  if (newUnlock) {
    gameState.lastEvent = 'pet-unlock';
    pauseTimer('petUnlock');
  }

  if (newUnlock || gameState.unlockedPets.length > 0) {
    const highestThreshold = Math.max(...gameState.unlockedPets.map(id => {
      const p = PET_CATALOG.find(p => p.id === id);
      return p ? p.threshold : 0;
    }));
    gameState.currentPet = PET_CATALOG.find(p => p.threshold === highestThreshold) || null;
  } else {
    gameState.currentPet = null;
  }
  
  return newUnlock;
}

export function nextSum() {
  if (!gameState.currentLevel) {
    throw new Error('Level not set. Call setLevel() first.');
  }
  
  // Limpiar timer handle de pet unlock si existe
  if (gameState.timerHandles.petUnlock) {
    clearTimeout(gameState.timerHandles.petUnlock);
    gameState.timerHandles.petUnlock = null;
  }
  
  const previousSum = gameState.currentSum;
  gameState.currentSum = generateSum(gameState.currentLevel, previousSum);
  
  // No limpiar pet-unlock inmediatamente, dejar que la UI lo procese
  if (gameState.lastEvent !== 'pet-unlock') {
    gameState.lastEvent = null;
  }
  
  gameState.timeRemaining = LEVEL_TIMERS[gameState.currentLevel] || 15;
  startTimer();
  notifySubscribers();
}

export function subscribe(callback) {
  gameState.subscribers.push(callback);
}

export function clearLastEvent() {
  gameState.lastEvent = null;
  notifySubscribers();
}

export function resetGameState() {
  // Limpiar todos los timer handles pendientes
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
  Object.values(gameState.timerHandles).forEach(handle => {
    if (handle) clearTimeout(handle);
  });
  gameState.timerHandles = {};
  
  gameState.currentLevel = null;
  gameState.currentSum = null;
  gameState.gems = 0;
  gameState.hits = 0;
  gameState.errors = 0;
  gameState.lastEvent = null;
  gameState.timeRemaining = 0;
  gameState.unlockedPets = [];
  gameState.currentPet = null;
  gameState.helpOverlayOpen = false;
  gameState.tutorialCompleted = { 2: false, 3: false };
  gameState.educationalFeedbackCount = { 2: 0, 3: 0 };
  gameState.timerPaused = false;
  gameState.timerPauseReasons = new Set();
  notifySubscribers();
}

export function toggleHelpOverlay() {
  gameState.helpOverlayOpen = !gameState.helpOverlayOpen;
  
  // Pausar o reanudar el cronómetro según el estado
  if (gameState.helpOverlayOpen) {
    pauseTimer('help');
  } else {
    resumeTimer('help');
  }
  
  notifySubscribers();
}

export function closeHelpOverlay() {
  if (gameState.helpOverlayOpen) {
    gameState.helpOverlayOpen = false;
    resumeTimer('help');
    notifySubscribers();
  }
}

function notifySubscribers() {
  gameState.subscribers.forEach(callback => callback(getState()));
}
