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

test.describe('FR-6: Cronómetro Variable por Nivel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: Nivel 1 tiene cronómetro de 15 segundos', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el timer muestra aproximadamente 15 (puede ser 14-15 por timing)
    const timer = page.locator('.timer-value');
    await expect(timer).toBeVisible({ timeout: 5000 });
    
    const timerValue = await timer.textContent();
    const seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(14);
    expect(seconds).toBeLessThanOrEqual(15);
  });

  test('AC-2: Nivel 2 tiene cronómetro de 20 segundos', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Verificar que el timer muestra aproximadamente 20 (puede ser 19-20 por timing)
    const timer = page.locator('.timer-value');
    await expect(timer).toBeVisible({ timeout: 5000 });
    
    const timerValue = await timer.textContent();
    const seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(19);
    expect(seconds).toBeLessThanOrEqual(20);
  });

  test('AC-3: Nivel 3 tiene cronómetro de 25 segundos', async ({ page }) => {
    // Ir a Nivel 3 y completar tutorial
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    
    // Verificar que el timer muestra aproximadamente 25 (puede ser 24-25 por timing)
    const timer = page.locator('.timer-value');
    await expect(timer).toBeVisible({ timeout: 5000 });
    
    const timerValue = await timer.textContent();
    const seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(24);
    expect(seconds).toBeLessThanOrEqual(25);
  });

  test('AC-4: El cronómetro cuenta regresivamente', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    const timer = page.locator('.timer-value');
    
    // Capturar valor inicial
    const initialValue = await timer.textContent();
    const initialSeconds = parseInt(initialValue);
    
    // Esperar 3 segundos
    await page.waitForTimeout(3000);
    
    // Capturar valor después
    const afterValue = await timer.textContent();
    const afterSeconds = parseInt(afterValue);
    
    // Verificar que disminuyó (permitimos 2-4 segundos de diferencia por timing)
    const difference = initialSeconds - afterSeconds;
    expect(difference).toBeGreaterThanOrEqual(2);
    expect(difference).toBeLessThanOrEqual(4);
  });

  test('AC-5: Al llegar a 0, se dispara el timeout', async ({ page }) => {
    // Ir a Nivel 1 (15 segundos)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    const timer = page.locator('.timer-value');
    
    // Esperar a que el timer llegue a 0 (15 segundos + buffer)
    await page.waitForTimeout(16000);
    
    // Verificar que el timer muestra 0 o ya se reinició (15)
    // Ambos casos prueban que el timeout ocurrió
    const timerValue = await timer.textContent();
    const seconds = parseInt(timerValue);
    expect([0, 15]).toContain(seconds);
  });

  test('AC-6: Al timeout, se incrementa el contador de errores', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Obtener errores iniciales
    const errorsBefore = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsBefore)).toBe(0);
    
    // Esperar a que el timer llegue a 0
    await page.waitForTimeout(16000);
    
    // Verificar que los errores incrementaron
    const errorsAfter = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsAfter)).toBe(1);
  });

  test('AC-7: Al timeout, se avanza a la siguiente suma', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Capturar primera suma
    const operand1Before = await page.locator('.operand-1').textContent();
    const operand2Before = await page.locator('.operand-2').textContent();
    
    // Esperar a que el timer llegue a 0 y avance
    await page.waitForTimeout(17000);
    
    // Capturar nueva suma
    const operand1After = await page.locator('.operand-1').textContent();
    const operand2After = await page.locator('.operand-2').textContent();
    
    // Verificar que la suma cambió
    const sumChanged = (operand1Before !== operand1After) || (operand2Before !== operand2After);
    expect(sumChanged).toBe(true);
  });

  test('AC-8: El cronómetro se reinicia para cada nueva suma', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    const timer = page.locator('.timer-value');
    
    // Responder correctamente para avanzar a la siguiente suma
    const input = page.locator('.answer-input');
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const correctAnswer = parseInt(operand1) + parseInt(operand2);
    
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperar a que avance a la siguiente suma
    await page.waitForTimeout(1500);
    
    // Verificar que el timer se reinició a 15
    const timerValue = await timer.textContent();
    expect(parseInt(timerValue)).toBe(15);
  });

  test('Escenario completo: Cronómetro en los 3 niveles', async ({ page }) => {
    // Nivel 1: 15 segundos
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    let timer = page.locator('.timer-value');
    let timerValue = await timer.textContent();
    let seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(14);
    expect(seconds).toBeLessThanOrEqual(15);
    
    // Volver al inicio
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Nivel 2: 20 segundos (con tutorial)
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    timer = page.locator('.timer-value');
    timerValue = await timer.textContent();
    seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(19);
    expect(seconds).toBeLessThanOrEqual(20);
    
    // Volver al inicio
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Nivel 3: 25 segundos (con tutorial)
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    
    timer = page.locator('.timer-value');
    timerValue = await timer.textContent();
    seconds = parseInt(timerValue);
    expect(seconds).toBeGreaterThanOrEqual(24);
    expect(seconds).toBeLessThanOrEqual(25);
  });
});
