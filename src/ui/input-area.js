import { submitAnswer } from '../state/game-state.js';

export function initInputArea() {
  const answerInput = document.querySelector('.answer-input');
  const btnEnter = document.getElementById('btn-enter');
  
  if (!answerInput) return;
  
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
      return;
    }
    
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  });
  
  answerInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  // Botón ENTER
  if (btnEnter) {
    btnEnter.addEventListener('click', (e) => {
      e.preventDefault();
      handleSubmit();
      answerInput.focus();
    });
  }
}

function handleSubmit() {
  const answerInput = document.querySelector('.answer-input');
  if (!answerInput) return;
  
  const value = answerInput.value.trim();
  if (!value) return;
  
  const answer = parseInt(value, 10);
  submitAnswer(answer);
  
  answerInput.value = '';
  answerInput.focus();
}
