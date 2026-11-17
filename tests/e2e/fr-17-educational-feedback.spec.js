import { test, expect } from '@playwright/test';

/**
 * Helper function para completar el tutorial
 */
async function completeTutorial(page, level) {
  // Esperar a que el tutorial esté visible
  await page.waitForSelector('#tutorial-screen:not(.hidden)', { timeout: 5000 });
  
  // Esperar a que los ejercicios se rendericen completamente
  await page.waitForSelector('.tutorial-exercise-card', { timeout: 5000 });
  
  // Completar los 2 ejercicios del tutorial
  const exercises = page.locator('.tutorial-exercise-card');
  const exerciseCount = await exercises.count();
  
  for (let i = 0; i < exerciseCount; i++) {
    const exercise = exercises.nth(i);
    const input = exercise.locator('.exercise-input');
    const answer = await input.getAttribute('data-answer');
    
    await input.fill(answer);
    await input.press('Enter');
    await page.waitForTimeout(500);
  }
  
  // Click en "Comenzar juego"
  const btnStart = page.locator('#btn-tutorial-start');
  await expect(btnStart).toBeVisible({ timeout: 5000 });
  await btnStart.click();
  
  await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  await page.waitForTimeout(500);
}

/**
 * Helper para responder una suma correctamente
 */
async function answerCorrectly(page) {
  const input = page.locator('.answer-input');
  const operand1 = await page.locator('.operand-1').textContent();
  const operand2 = await page.locator('.operand-2').textContent();
  const answer = parseInt(operand1) + parseInt(operand2);
  
  await input.fill(answer.toString());
  await input.press('Enter');
  
  // Esperar a que se procese la respuesta
  await page.waitForTimeout(500);
}

/**
 * Helper para responder una suma incorrectamente
 */
async function answerIncorrectly(page) {
  const input = page.locator('.answer-input');
  
  await input.fill('999');
  await input.press('Enter');
  
  await page.waitForTimeout(500);
}

test.describe('FR-17: Feedback Educativo Automático', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: El feedback aparece en los primeros 5 ejercicios de N2', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Primer ejercicio - debe aparecer feedback
    await answerCorrectly(page);
    
    // Verificar que el overlay de feedback educativo aparece
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    
    // Cerrar feedback
    await page.click('#btn-educational-feedback-continue');
    await page.waitForTimeout(500);
  });

  test('AC-1: El feedback aparece en los primeros 5 ejercicios de N3', async ({ page }) => {
    // Ir a Nivel 3 y completar tutorial
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    
    // Primer ejercicio
    await answerCorrectly(page);
    
    // Verificar feedback
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    
    await page.click('#btn-educational-feedback-continue');
  });

  test('AC-2: El feedback NO aparece en Nivel 1', async ({ page }) => {
    // Ir a Nivel 1 (sin tutorial)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Responder ejercicio
    await answerCorrectly(page);
    
    // Verificar que el feedback NO aparece
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
  });

  test('AC-3: El feedback muestra los 4 pasos de Sumas Parciales', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Primer ejercicio
    await answerCorrectly(page);
    
    // Verificar overlay visible
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    
    // Verificar 4 pasos
    const steps = feedbackOverlay.locator('.feedback-step');
    await expect(steps).toHaveCount(4);
    
    // Verificar títulos de pasos (pueden estar en español o inglés según i18n)
    await expect(steps.nth(0).locator('.feedback-step-title')).toHaveText(/descomponer|decompose/i);
    await expect(steps.nth(1).locator('.feedback-step-title')).toHaveText(/decenas|tens/i);
    await expect(steps.nth(2).locator('.feedback-step-title')).toHaveText(/unidades|units/i);
    await expect(steps.nth(3).locator('.feedback-step-title')).toHaveText(/combinar|combine/i);
    
    await page.click('#btn-educational-feedback-continue');
  });

  test('AC-4: El feedback aparece tanto en acierto como en error', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Ejercicio 1 - acierto
    await answerCorrectly(page);
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    await page.click('#btn-educational-feedback-continue');
    await page.waitForTimeout(500);
    
    // Ejercicio 2 - error
    await answerIncorrectly(page);
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    await page.click('#btn-educational-feedback-continue');
  });

  test('AC-5: Después del 5° ejercicio, el feedback NO aparece automáticamente', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Completar 5 ejercicios con feedback
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
      await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
      await page.click('#btn-educational-feedback-continue');
      await page.waitForTimeout(500);
    }
    
    // Ejercicio 6 - NO debe aparecer feedback
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
  });

  test('AC-6: Después del 5° ejercicio, el feedback aparece con botón de ayuda', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Completar 5 ejercicios
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
      await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
      await page.click('#btn-educational-feedback-continue');
      await page.waitForTimeout(500);
    }
    
    // Ejercicio 6 - NO debe aparecer feedback automático
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
    
    // Ahora usar botón de ayuda (overlay no debe estar bloqueando)
    await page.click('#btn-help');
    await page.waitForTimeout(500);
    
    // Verificar que aparece el overlay de ayuda (que también muestra los 4 pasos)
    const helpOverlay = page.locator('#help-overlay');
    await expect(helpOverlay).toBeVisible({ timeout: 5000 });
    
    // Cerrar help overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('AC-7: El conteo se reinicia al cambiar de nivel', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Completar 5 ejercicios en N2
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
      await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
      await page.click('#btn-educational-feedback-continue');
      await page.waitForTimeout(500);
    }
    
    // Ejercicio 6 - NO debe aparecer feedback
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
    
    // Volver al inicio
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Ir a Nivel 3
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    
    // Primer ejercicio en N3 - debe aparecer feedback (conteo reiniciado)
    await answerCorrectly(page);
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    
    await page.click('#btn-educational-feedback-continue');
  });

  test('AC-8: El conteo se reinicia al presionar Atrás', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Completar 5 ejercicios
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
      await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
      await page.click('#btn-educational-feedback-continue');
      await page.waitForTimeout(500);
    }
    
    // Ejercicio 6 - NO debe aparecer feedback
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
    
    // Volver al inicio con Atrás
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Volver a Nivel 2 (tutorial aparecerá de nuevo)
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Primer ejercicio - debe aparecer feedback (conteo reiniciado)
    await answerCorrectly(page);
    await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
    
    await page.click('#btn-educational-feedback-continue');
  });

  test('Escenario completo: Feedback educativo en N2 - 5 ejercicios', async ({ page }) => {
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    const feedbackOverlay = page.locator('#educational-feedback-overlay');
    
    // Completar 5 ejercicios consecutivos
    for (let i = 1; i <= 5; i++) {
      await answerCorrectly(page);
      
      // Verificar feedback visible
      await expect(feedbackOverlay).toBeVisible({ timeout: 5000 });
      
      // Verificar que hay 4 pasos
      const steps = feedbackOverlay.locator('.feedback-step');
      await expect(steps).toHaveCount(4);
      
      // Cerrar feedback
      await page.click('#btn-educational-feedback-continue');
      await page.waitForTimeout(500);
    }
    
    // Ejercicio 6 - sin feedback automático
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    await expect(feedbackOverlay).toBeHidden({ timeout: 3000 });
    
    // Verificar que el botón de ayuda funciona
    await page.click('#btn-help');
    const helpOverlay = page.locator('#help-overlay');
    await expect(helpOverlay).toBeVisible({ timeout: 5000 });
    
    await page.keyboard.press('Escape');
  });
});
