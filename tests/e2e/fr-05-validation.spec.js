import { test, expect } from '@playwright/test';

/**
 * Helper function para completar el tutorial
 */
async function completeTutorial(page, level) {
  await page.waitForSelector('#tutorial-screen:not(.hidden)', { timeout: 5000 });
  await page.waitForSelector('.tutorial-exercise-card', { timeout: 5000 });
  
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
  
  const btnStart = page.locator('#btn-tutorial-start');
  await expect(btnStart).toBeVisible({ timeout: 5000 });
  await btnStart.click();
  
  await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  await page.waitForTimeout(500);
}

/**
 * Helper para obtener la respuesta correcta de la suma actual
 */
async function getCorrectAnswer(page) {
  const operand1 = await page.locator('.operand-1').textContent();
  const operand2 = await page.locator('.operand-2').textContent();
  return parseInt(operand1) + parseInt(operand2);
}

test.describe('FR-5: Validación de respuesta y avance automático', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: Al responder correctamente, se incrementa el contador de gemas', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Obtener gemas iniciales
    const gemsBefore = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsBefore)).toBe(0);
    
    // Responder correctamente
    const correctAnswer = await getCorrectAnswer(page);
    const input = page.locator('.answer-input');
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperar a que se procese la respuesta
    await page.waitForTimeout(1000);
    
    // Verificar que las gemas incrementaron
    const gemsAfter = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsAfter)).toBe(1);
  });

  test('AC-2: Al responder correctamente, se incrementa el contador de hits', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Obtener hits iniciales
    const hitsBefore = await page.locator('.hits-count').textContent();
    expect(parseInt(hitsBefore)).toBe(0);
    
    // Responder correctamente
    const correctAnswer = await getCorrectAnswer(page);
    const input = page.locator('.answer-input');
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    await page.waitForTimeout(1000);
    
    // Verificar que los hits incrementaron
    const hitsAfter = await page.locator('.hits-count').textContent();
    expect(parseInt(hitsAfter)).toBe(1);
  });

  test('AC-3: Al responder correctamente, se avanza automáticamente a la siguiente suma', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Capturar primera suma
    const operand1Before = await page.locator('.operand-1').textContent();
    const operand2Before = await page.locator('.operand-2').textContent();
    
    // Responder correctamente
    const correctAnswer = await getCorrectAnswer(page);
    const input = page.locator('.answer-input');
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperar a que avance
    await page.waitForTimeout(1000);
    
    // Capturar nueva suma
    const operand1After = await page.locator('.operand-1').textContent();
    const operand2After = await page.locator('.operand-2').textContent();
    
    // Verificar que la suma cambió
    const sumChanged = (operand1Before !== operand1After) || (operand2Before !== operand2After);
    expect(sumChanged).toBe(true);
  });

  test('AC-4: Al responder incorrectamente, se incrementa el contador de errores', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Obtener errores iniciales
    const errorsBefore = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsBefore)).toBe(0);
    
    // Responder incorrectamente
    const input = page.locator('.answer-input');
    await input.fill('999');
    await input.press('Enter');
    
    await page.waitForTimeout(1000);
    
    // Verificar que los errores incrementaron
    const errorsAfter = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsAfter)).toBe(1);
  });

  test('AC-5: Al responder incorrectamente, NO se incrementan gemas ni hits', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Responder incorrectamente
    const input = page.locator('.answer-input');
    await input.fill('999');
    await input.press('Enter');
    
    await page.waitForTimeout(1000);
    
    // Verificar que gemas y hits siguen en 0
    const gems = await page.locator('.gem-count').textContent();
    const hits = await page.locator('.hits-count').textContent();
    expect(parseInt(gems)).toBe(0);
    expect(parseInt(hits)).toBe(0);
  });

  test('AC-6: Al responder incorrectamente, se avanza automáticamente a la siguiente suma', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Capturar primera suma
    const operand1Before = await page.locator('.operand-1').textContent();
    const operand2Before = await page.locator('.operand-2').textContent();
    
    // Responder incorrectamente
    const input = page.locator('.answer-input');
    await input.fill('999');
    await input.press('Enter');
    
    // Esperar a que avance
    await page.waitForTimeout(1000);
    
    // Capturar nueva suma
    const operand1After = await page.locator('.operand-1').textContent();
    const operand2After = await page.locator('.operand-2').textContent();
    
    // Verificar que la suma cambió
    const sumChanged = (operand1Before !== operand1After) || (operand2Before !== operand2After);
    expect(sumChanged).toBe(true);
  });

  test('AC-7: Al agotarse el tiempo (timeout), se incrementa el contador de errores', async ({ page }) => {
    // Ir a Nivel 1 (timer de 15 segundos)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Obtener errores iniciales
    const errorsBefore = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsBefore)).toBe(0);
    
    // Esperar a que el timer llegue a 0 (15 segundos + buffer)
    await page.waitForTimeout(16000);
    
    // Verificar que los errores incrementaron
    const errorsAfter = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsAfter)).toBe(1);
  });

  test('AC-8: Al timeout, se avanza automáticamente a la siguiente suma', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Capturar primera suma
    const operand1Before = await page.locator('.operand-1').textContent();
    const operand2Before = await page.locator('.operand-2').textContent();
    
    // Esperar a que el timer llegue a 0
    await page.waitForTimeout(16000);
    
    // Capturar nueva suma
    const operand1After = await page.locator('.operand-1').textContent();
    const operand2After = await page.locator('.operand-2').textContent();
    
    // Verificar que la suma cambió
    const sumChanged = (operand1Before !== operand1After) || (operand2Before !== operand2After);
    expect(sumChanged).toBe(true);
  });

  test('Escenario completo: Múltiples respuestas correctas e incorrectas', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    const input = page.locator('.answer-input');
    
    // 3 respuestas correctas
    for (let i = 0; i < 3; i++) {
      const correctAnswer = await getCorrectAnswer(page);
      await input.fill(correctAnswer.toString());
      await input.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Verificar gemas y hits
    const gems = await page.locator('.gem-count').textContent();
    const hits = await page.locator('.hits-count').textContent();
    expect(parseInt(gems)).toBe(3);
    expect(parseInt(hits)).toBe(3);
    
    // 2 respuestas incorrectas
    for (let i = 0; i < 2; i++) {
      await input.fill('999');
      await input.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Verificar errores
    const errors = await page.locator('.errors-count').textContent();
    expect(parseInt(errors)).toBe(2);
    
    // Verificar que gemas y hits no cambiaron
    const gemsFinal = await page.locator('.gem-count').textContent();
    const hitsFinal = await page.locator('.hits-count').textContent();
    expect(parseInt(gemsFinal)).toBe(3);
    expect(parseInt(hitsFinal)).toBe(3);
  });
});
