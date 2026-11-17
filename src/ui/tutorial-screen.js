import { decomposeSum } from '../core/partial-sums.js';
import { markTutorialCompleted, resetGameState } from '../state/game-state.js';
import { setLevel } from '../state/game-state.js';
import { getCurrentLanguage, translations } from '../i18n/translations.js';

export function initTutorialScreen(level) {
  const tutorialScreen = document.getElementById('tutorial-screen');
  const stepsContainer = document.getElementById('tutorial-steps');
  const exercisesContainer = document.getElementById('tutorial-exercises');
  const btnStart = document.getElementById('btn-tutorial-start');
  const btnBack = document.getElementById('btn-tutorial-back');
  
  if (!tutorialScreen) return;
  
  // Limpiar contenido anterior
  stepsContainer.innerHTML = '';
  exercisesContainer.innerHTML = '';
  
  // Determinar ejemplo según nivel
  const example = level === 2 ? { a: 24, b: 7 } : { a: 24, b: 37 };
  const decomposition = decomposeSum(example.a, example.b);
  
  // Renderizar los 4 pasos del tutorial
  renderSteps(stepsContainer, decomposition, level);
  
  // Renderizar ejercicios guiados
  renderExercises(exercisesContainer, level);
  
  // Botón comenzar
  btnStart.addEventListener('click', () => {
    completeTutorial(level);
  });
  
  // Botón volver
  btnBack.addEventListener('click', () => {
    backToHome();
  });
}

function renderSteps(container, decomposition, level) {
  const lang = getCurrentLanguage();
  const t = translations[lang];
  
  const steps = [
    {
      title: t['tutorial.step1'] || 'Paso 1: Descomponer los operandos',
      content: `
        <div class="tutorial-decompose">
          <div class="tutorial-operand">
            <span class="tutorial-number">${decomposition.operand1.original}</span>
            <span>=</span>
            <span class="tutorial-tens">${decomposition.operand1.tens}</span>
            <span>+</span>
            <span class="tutorial-units">${decomposition.operand1.units}</span>
          </div>
          <div class="tutorial-operand">
            <span class="tutorial-number">${decomposition.operand2.original}</span>
            <span>=</span>
            <span class="tutorial-tens">${decomposition.operand2.tens}</span>
            <span>+</span>
            <span class="tutorial-units">${decomposition.operand2.units}</span>
          </div>
        </div>
      `
    },
    {
      title: t['tutorial.step2'] || 'Paso 2: Sumar las decenas',
      content: `
        <div class="tutorial-step">
          <span class="tutorial-tens">${decomposition.operand1.tens}</span>
          <span>+</span>
          <span class="tutorial-tens">${decomposition.operand2.tens}</span>
          <span>=</span>
          <span class="tutorial-result">${decomposition.operand1.tens + decomposition.operand2.tens}</span>
        </div>
      `
    },
    {
      title: t['tutorial.step3'] || 'Paso 3: Sumar las unidades',
      content: `
        <div class="tutorial-step">
          <span class="tutorial-units">${decomposition.operand1.units}</span>
          <span>+</span>
          <span class="tutorial-units">${decomposition.operand2.units}</span>
          <span>=</span>
          <span class="tutorial-result">${decomposition.operand1.units + decomposition.operand2.units}</span>
        </div>
      `
    },
    {
      title: t['tutorial.step4'] || 'Paso 4: Combinar los resultados',
      content: `
        <div class="tutorial-step">
          <span class="tutorial-tens">${decomposition.operand1.tens + decomposition.operand2.tens}</span>
          <span>+</span>
          <span class="tutorial-units">${decomposition.operand1.units + decomposition.operand2.units}</span>
          <span>=</span>
          <span class="tutorial-final">${decomposition.answer}</span>
        </div>
      `
    }
  ];
  
  steps.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.className = 'tutorial-step-card';
    stepElement.innerHTML = `
      <div class="tutorial-step-number">${index + 1}</div>
      <h3 class="tutorial-step-title">${step.title}</h3>
      <div class="tutorial-step-content">${step.content}</div>
    `;
    container.appendChild(stepElement);
  });
}

function renderExercises(container, level) {
  const exercises = level === 2 
    ? [{ a: 24, b: 7 }, { a: 35, b: 6 }]
    : [{ a: 24, b: 37 }, { a: 48, b: 25 }];
  
  exercises.forEach((exercise, index) => {
    const decomposition = decomposeSum(exercise.a, exercise.b);
    const exerciseElement = document.createElement('div');
    exerciseElement.className = 'tutorial-exercise-card';
    exerciseElement.innerHTML = `
      <div class="exercise-label">Ejercicio ${index + 1} de 2</div>
      <div class="exercise-operation">
        <div class="exercise-operand">${exercise.a}</div>
        <div class="exercise-operand">+ ${exercise.b}</div>
        <div class="exercise-line"></div>
        <input type="text" class="exercise-input" data-answer="${decomposition.answer}" placeholder="?" />
      </div>
      <div class="exercise-feedback"></div>
    `;
    container.appendChild(exerciseElement);
    
    // Agregar validación de input
    const input = exerciseElement.querySelector('.exercise-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validateExerciseAnswer(input, decomposition.answer, exerciseElement);
      }
    });
  });
}

function validateExerciseAnswer(input, correctAnswer, container) {
  const userAnswer = parseInt(input.value);
  const feedback = container.querySelector('.exercise-feedback');
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '¡Correcto! ';
    feedback.className = 'exercise-feedback success';
    input.classList.add('correct');
  } else {
    feedback.textContent = `Casi. La respuesta correcta es ${correctAnswer}`;
    feedback.className = 'exercise-feedback error';
    input.classList.add('incorrect');
  }
  
  input.disabled = true;
}

function completeTutorial(level) {
  markTutorialCompleted(level);
  
  const tutorialScreen = document.getElementById('tutorial-screen');
  const gameScreen = document.getElementById('game-screen');
  
  tutorialScreen.classList.add('fade-out');
  
  setTimeout(() => {
    tutorialScreen.classList.add('hidden');
    tutorialScreen.classList.remove('fade-out');
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('fade-in');
    
    setLevel(level);
    
    setTimeout(() => {
      gameScreen.classList.remove('fade-in');
    }, 300);
  }, 300);
}

function backToHome() {
  const tutorialScreen = document.getElementById('tutorial-screen');
  const homeScreen = document.getElementById('home-screen');
  
  // Resetear el estado del juego
  resetGameState();
  
  tutorialScreen.classList.add('fade-out');
  
  setTimeout(() => {
    tutorialScreen.classList.add('hidden');
    tutorialScreen.classList.remove('fade-out');
    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('fade-in');
    
    setTimeout(() => {
      homeScreen.classList.remove('fade-in');
    }, 300);
  }, 300);
}
