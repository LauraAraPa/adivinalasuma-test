export function initFeedback() {
  createFeedbackElements();
}

function createFeedbackElements() {
  const gameContainer = document.querySelector('.game-container');
  if (!gameContainer) return;

  // Contenedor de feedback
  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'feedback-container';
  gameContainer.appendChild(feedbackContainer);

  // Check mark para éxito
  const checkMark = document.createElement('div');
  checkMark.className = 'check-mark';
  checkMark.innerHTML = '✓';
  feedbackContainer.appendChild(checkMark);

  // X mark para error
  const xMark = document.createElement('div');
  xMark.className = 'x-mark';
  xMark.innerHTML = '✗';
  feedbackContainer.appendChild(xMark);

  // Contenedor de partículas
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  feedbackContainer.appendChild(particlesContainer);
}

export function showSuccessFeedback() {
  const inputArea = document.querySelector('.input-area');
  const checkMark = document.querySelector('.check-mark');
  const particlesContainer = document.querySelector('.particles-container');

  if (inputArea) {
    inputArea.classList.add('success-border');
    setTimeout(() => {
      inputArea.classList.remove('success-border');
    }, 800);
  }

  if (checkMark) {
    checkMark.classList.add('show');
    setTimeout(() => {
      checkMark.classList.remove('show');
    }, 800);
  }

  if (particlesContainer) {
    createParticles(particlesContainer);
  }
}

export function showErrorFeedback() {
  const inputArea = document.querySelector('.input-area');
  const operationDisplay = document.querySelector('.operation-display');
  const xMark = document.querySelector('.x-mark');

  if (inputArea) {
    inputArea.classList.add('error-border');
    setTimeout(() => {
      inputArea.classList.remove('error-border');
    }, 800);
  }

  // Aplicar shake solo al área de operación e input, no a todo el contenedor
  if (operationDisplay) {
    operationDisplay.classList.add('shake');
    setTimeout(() => {
      operationDisplay.classList.remove('shake');
    }, 500);
  }

  if (inputArea) {
    inputArea.classList.add('shake');
    setTimeout(() => {
      inputArea.classList.remove('shake');
    }, 500);
  }

  if (xMark) {
    xMark.classList.add('show');
    setTimeout(() => {
      xMark.classList.remove('show');
    }, 800);
  }
}

export function showWarningFeedback() {
  const timer = document.querySelector('.timer');
  const body = document.body;

  if (timer) {
    timer.classList.add('warning');
  }

  if (body) {
    body.classList.add('warning-background');
  }
}

export function clearWarningFeedback() {
  const timer = document.querySelector('.timer');
  const body = document.body;

  if (timer) {
    timer.classList.remove('warning');
  }

  if (body) {
    body.classList.remove('warning-background');
  }
}

function createParticles(container) {
  const colors = ['#5BC0EB', '#7ED957', '#FFD93D', '#FF6B6B'];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 100 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    
    container.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}
