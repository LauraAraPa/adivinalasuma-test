import { getState, subscribe } from '../state/game-state.js';
import { showSuccessFeedback, showErrorFeedback, showWarningFeedback, clearWarningFeedback } from './feedback.js';
import { playSuccessSound, playErrorSound, playWarningSound } from './sounds.js';
import { getCurrentLanguage, translations } from '../i18n/translations.js';

let lastEvent = null;
let lastTimeRemaining = null;
let lastSumKey = null;

export function initGameScreen() {
  subscribe(render);
}

function render(state) {
  if (!state.currentSum) return;

  const gemCount = document.querySelector('.gem-count');
  const hitsCount = document.querySelector('.hits-count');
  const errorsCount = document.querySelector('.errors-count');
  const timerValue = document.querySelector('.timer-value');
  const timer = document.querySelector('.timer');
  const levelBadgeText = document.querySelector('.level-badge-text');
  const operand1 = document.querySelector('.operand-1');
  const operand2 = document.querySelector('.operand-2');
  const answerInput = document.querySelector('.answer-input');

  if (gemCount) gemCount.textContent = state.gems;
  if (hitsCount) hitsCount.textContent = state.hits;
  if (errorsCount) errorsCount.textContent = state.errors;
  if (timerValue) timerValue.textContent = state.timeRemaining;
  if (levelBadgeText) {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const levelText = `${t['level.number'] || 'Nivel'} ${state.currentLevel}`;
    levelBadgeText.textContent = levelText;
  }
  if (operand1) operand1.textContent = state.currentSum.operand1;
  if (operand2) operand2.textContent = state.currentSum.operand2;
  
  // Detectar si cambió la suma (nueva suma)
  const currentSumKey = `${state.currentSum.operand1}-${state.currentSum.operand2}`;
  const isNewSum = currentSumKey !== lastSumKey;
  lastSumKey = currentSumKey;
  
  // Feedback de advertencia (≤5 segundos)
  if (timer) {
    if (state.timeRemaining <= 5 && state.timeRemaining > 0) {
      timer.classList.add('timer-warning');
      showWarningFeedback();
      
      // Reproducir sonido de advertencia cada segundo
      if (lastTimeRemaining !== state.timeRemaining) {
        playWarningSound();
      }
      
      lastEvent = 'warning';
    } else {
      timer.classList.remove('timer-warning');
      clearWarningFeedback();
      if (lastEvent === 'warning') {
        lastEvent = null;
      }
    }
  }
  
  // Feedback de éxito
  if (state.lastEvent === 'success' && lastEvent !== 'success') {
    showSuccessFeedback();
    playSuccessSound();
    lastEvent = 'success';
  }
  
  // Feedback de error o timeout
  if ((state.lastEvent === 'error' || state.lastEvent === 'timeout') && lastEvent !== state.lastEvent) {
    showErrorFeedback();
    playErrorSound();
    lastEvent = state.lastEvent;
  }
  
  // Reset de evento después de mostrar feedback
  if (state.lastEvent === null && lastEvent !== null) {
    lastEvent = null;
  }
  
  // Actualizar último timeRemaining
  lastTimeRemaining = state.timeRemaining;
  
  if (answerInput) {
    // Solo limpiar el input cuando hay una nueva suma
    if (isNewSum) {
      answerInput.value = '';
    }
    if (document.activeElement !== answerInput) {
      answerInput.focus();
    }
  }
}
