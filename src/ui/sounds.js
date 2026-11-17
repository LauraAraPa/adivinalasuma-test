let audioContext = null;
let soundsLoaded = false;

const sounds = {
  success: null,
  error: null,
  warning: null,
  unlock: null
};

export function initSounds() {
  // Los sonidos se cargarán después de la primera interacción
  document.addEventListener('click', loadSounds, { once: true });
}

function loadSounds() {
  if (soundsLoaded) return;
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear sonidos sintéticos simples
    sounds.success = createSuccessSound();
    sounds.error = createErrorSound();
    sounds.warning = createWarningSound();
    sounds.unlock = createUnlockSound();
    
    soundsLoaded = true;
  } catch (error) {
    console.warn('No se pudo inicializar el sistema de audio:', error);
  }
}

function createSuccessSound() {
  return () => {
    if (!audioContext) return;
    
    // Sonido de éxito: acorde ascendente brillante
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 0.4;
    
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + (i * 0.08);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };
}

function createErrorSound() {
  return () => {
    if (!audioContext) return;
    
    // Sonido de error: tono descendente suave
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };
}

function createWarningSound() {
  return () => {
    if (!audioContext) return;
    
    // Sonido de advertencia: beep corto y agudo
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880; // A5
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };
}

function createUnlockSound() {
  return () => {
    if (!audioContext) return;
    
    // Fanfarria de trompeta: acorde triunfal ascendente
    const notes = [
      { freq: 523.25, start: 0, duration: 0.15 },      // C5
      { freq: 659.25, start: 0.1, duration: 0.15 },    // E5
      { freq: 783.99, start: 0.2, duration: 0.15 },    // G5
      { freq: 1046.50, start: 0.3, duration: 0.4 }     // C6 (nota final larga)
    ];
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'sawtooth'; // Timbre de trompeta
      
      const startTime = audioContext.currentTime + note.start;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });
  };
}

export function playUnlockSound() {
  if (soundsLoaded && sounds.unlock) {
    sounds.unlock();
  }
}

export function playSuccessSound() {
  if (sounds.success) {
    sounds.success();
  }
}

export function playErrorSound() {
  if (sounds.error) {
    sounds.error();
  }
}

export function playWarningSound() {
  if (sounds.warning) {
    sounds.warning();
  }
}
