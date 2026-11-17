import { subscribe, getState, closeHelpOverlay } from '../state/game-state.js';
import { decomposeSum } from '../core/partial-sums.js';

export function initHelpOverlay() {
  const overlay = document.getElementById('help-overlay');
  const btnClose = document.getElementById('btn-help-close');
  const stepsContainer = document.getElementById('help-steps');

  if (!overlay || !stepsContainer) return;

  subscribe((state) => {
    if (state.helpOverlayOpen && state.currentSum) {
      const { operand1, operand2 } = state.currentSum;
      const decomposition = decomposeSum(operand1, operand2);

      renderSteps(stepsContainer, decomposition);
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  });

  if (btnClose) {
    btnClose.addEventListener('click', closeHelpOverlay);
  }

  // Cerrar al hacer click fuera del contenido
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeHelpOverlay();
    }
  });

  // Cerrar con tecla Escape o Enter
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Enter') && getState().helpOverlayOpen) {
      closeHelpOverlay();
    }
  });
}

function renderSteps(container, decomposition) {
  const { operand1, operand2, steps } = decomposition;

  container.innerHTML = `
    <div class="help-step">
      <span class="step-number">1</span>
      <span class="step-label">Descomponer</span>
      <span class="step-value">
        <span class="tens-highlight">${operand1.original} = <span class="tens">${operand1.tens}</span> + <span class="units">${operand1.units}</span></span>
      </span>
      <span class="step-value">
        <span class="tens-highlight">${operand2.original} = <span class="tens">${operand2.tens}</span> + <span class="units">${operand2.units}</span></span>
      </span>
    </div>
    <div class="help-step">
      <span class="step-number">2</span>
      <span class="step-label">Sumar decenas</span>
      <span class="step-value">${steps.addTens}</span>
    </div>
    <div class="help-step">
      <span class="step-number">3</span>
      <span class="step-label">Sumar unidades</span>
      <span class="step-value">${steps.addUnits}</span>
    </div>
    <div class="help-step">
      <span class="step-number">4</span>
      <span class="step-label">Combinar</span>
      <span class="step-value">${steps.combine}</span>
    </div>
  `;
}
