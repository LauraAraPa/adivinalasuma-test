import { subscribe, getState, pauseTimer, resumeTimer } from '../state/game-state.js';
import { decomposeSum } from '../core/partial-sums.js';
import { getCurrentLanguage, translations } from '../i18n/translations.js';

export function initEducationalFeedback() {
  const overlay = document.getElementById('educational-feedback-overlay');
  const btnContinue = document.getElementById('btn-educational-feedback-continue');
  
  if (!overlay) return;
  
  // Botón continuar
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      closeEducationalFeedback();
    });
  }
  
  // Cerrar al hacer click fuera del contenido
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeEducationalFeedback();
    }
  });
  
  // Cerrar con tecla Escape o Enter
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      const overlay = document.getElementById('educational-feedback-overlay');
      if (overlay && !overlay.classList.contains('hidden')) {
        closeEducationalFeedback();
      }
    }
  });
  
  subscribe((state) => {
    // Solo mostrar feedback educativo en N2 y N3
    if (!state.currentLevel || state.currentLevel === 1) return;
    
    // Verificar si estamos en los primeros 5 ejercicios
    const feedbackCount = state.educationalFeedbackCount[state.currentLevel] || 0;
    if (feedbackCount > 5) return;
    
    // Mostrar después de éxito o error (no en pet-unlock ni warning)
    if (state.lastEvent === 'success' || state.lastEvent === 'error') {
      showEducationalFeedback(state);
    }
  });
}

function showEducationalFeedback(state) {
  const overlay = document.getElementById('educational-feedback-overlay');
  const stepsContainer = document.getElementById('educational-feedback-steps');
  
  if (!overlay || !stepsContainer) return;
  if (!state.currentSum) return;
  
  // Obtener descomposición de la suma actual
  const decomposition = decomposeSum(
    state.currentSum.operand1,
    state.currentSum.operand2
  );
  
  // Renderizar pasos
  renderFeedbackSteps(stepsContainer, decomposition);
  
  // Usar requestAnimationFrame para asegurar que el DOM esté listo
  requestAnimationFrame(() => {
    // Mostrar overlay
    overlay.classList.remove('hidden');
    
    // Pausar el cronómetro después de mostrar el overlay
    setTimeout(() => {
      pauseTimer('educational');
    }, 50);
  });
}

function renderFeedbackSteps(container, decomposition) {
  const lang = getCurrentLanguage();
  const t = translations[lang];
  
  container.innerHTML = `
    <div class="feedback-step">
      <div class="feedback-step-title">${t['tutorial.step1'] || 'Paso 1: Descomponer'}</div>
      <div class="feedback-decompose">
        <div class="feedback-operand">
          <span class="feedback-number">${decomposition.operand1.original}</span>
          <span>=</span>
          <span class="feedback-tens">${decomposition.operand1.tens}</span>
          <span>+</span>
          <span class="feedback-units">${decomposition.operand1.units}</span>
        </div>
        <div class="feedback-operand">
          <span class="feedback-number">${decomposition.operand2.original}</span>
          <span>=</span>
          <span class="feedback-tens">${decomposition.operand2.tens}</span>
          <span>+</span>
          <span class="feedback-units">${decomposition.operand2.units}</span>
        </div>
      </div>
    </div>
    <div class="feedback-step">
      <div class="feedback-step-title">${t['tutorial.step2'] || 'Paso 2: Sumar decenas'}</div>
      <div class="feedback-equation">
        <span class="feedback-tens">${decomposition.operand1.tens}</span>
        <span>+</span>
        <span class="feedback-tens">${decomposition.operand2.tens}</span>
        <span>=</span>
        <span class="feedback-result">${decomposition.operand1.tens + decomposition.operand2.tens}</span>
      </div>
    </div>
    <div class="feedback-step">
      <div class="feedback-step-title">${t['tutorial.step3'] || 'Paso 3: Sumar unidades'}</div>
      <div class="feedback-equation">
        <span class="feedback-units">${decomposition.operand1.units}</span>
        <span>+</span>
        <span class="feedback-units">${decomposition.operand2.units}</span>
        <span>=</span>
        <span class="feedback-result">${decomposition.operand1.units + decomposition.operand2.units}</span>
      </div>
    </div>
    <div class="feedback-step">
      <div class="feedback-step-title">${t['tutorial.step4'] || 'Paso 4: Combinar'}</div>
      <div class="feedback-equation">
        <span class="feedback-tens">${decomposition.operand1.tens + decomposition.operand2.tens}</span>
        <span>+</span>
        <span class="feedback-units">${decomposition.operand1.units + decomposition.operand2.units}</span>
        <span>=</span>
        <span class="feedback-final">${decomposition.answer}</span>
      </div>
    </div>
  `;
}

export function closeEducationalFeedback() {
  const overlay = document.getElementById('educational-feedback-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    // Reanudar el cronómetro al cerrar el feedback
    resumeTimer('educational');
  }
}
