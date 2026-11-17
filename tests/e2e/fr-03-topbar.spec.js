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
 * Helper para responder correctamente
 */
async function answerCorrectly(page) {
  const input = page.locator('.answer-input');
  const operand1 = await page.locator('.operand-1').textContent();
  const operand2 = await page.locator('.operand-2').textContent();
  const answer = parseInt(operand1) + parseInt(operand2);
  
  await input.fill(answer.toString());
  await input.press('Enter');
  await page.waitForTimeout(1000);
}

test.describe('FR-3: Topbar con gemas, hits, errores y cronómetro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: El topbar muestra el contador de gemas con ícono', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el contador de gemas existe
    const gemCounter = page.locator('.gem-counter');
    await expect(gemCounter).toBeVisible();
    
    // Verificar que muestra el valor inicial (0)
    const gemCount = page.locator('.gem-count');
    await expect(gemCount).toHaveText('0');
  });

  test('AC-2: El topbar muestra el contador de hits', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el contador de hits existe
    const hitsCounter = page.locator('.stat-hits');
    await expect(hitsCounter).toBeVisible();
    
    // Verificar que muestra el valor inicial (0)
    const hitsCount = page.locator('.hits-count');
    await expect(hitsCount).toHaveText('0');
  });

  test('AC-3: El topbar muestra el contador de errores', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el contador de errores existe
    const errorsCounter = page.locator('.stat-errors');
    await expect(errorsCounter).toBeVisible();
    
    // Verificar que muestra el valor inicial (0)
    const errorsCount = page.locator('.errors-count');
    await expect(errorsCount).toHaveText('0');
  });

  test('AC-4: El topbar muestra el cronómetro', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el cronómetro existe
    const timer = page.locator('.timer');
    await expect(timer).toBeVisible();
    
    // Verificar que muestra el valor inicial (15 para Nivel 1, puede ser 13-15 por timing)
    const timerValue = page.locator('.timer-value');
    const value = await timerValue.textContent();
    const seconds = parseInt(value);
    expect(seconds).toBeGreaterThanOrEqual(13);
    expect(seconds).toBeLessThanOrEqual(15);
  });

  test('AC-5: Los contadores inician en 0', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que todos los contadores inician en 0
    const gemCount = await page.locator('.gem-count').textContent();
    const hitsCount = await page.locator('.hits-count').textContent();
    const errorsCount = await page.locator('.errors-count').textContent();
    
    expect(parseInt(gemCount)).toBe(0);
    expect(parseInt(hitsCount)).toBe(0);
    expect(parseInt(errorsCount)).toBe(0);
  });

  test('AC-6: El topbar es visible durante todo el juego', async ({ page }) => {
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar topbar visible
    const topBar = page.locator('.top-bar');
    await expect(topBar).toBeVisible();
    
    // Responder varias preguntas
    for (let i = 0; i < 3; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que el topbar sigue visible
    await expect(topBar).toBeVisible();
    
    // Verificar que los contadores se actualizaron
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBe(3);
  });

  test('Escenario completo: Topbar actualiza correctamente durante el juego', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Verificar topbar visible
    const topBar = page.locator('.top-bar');
    await expect(topBar).toBeVisible();
    
    // Verificar valores iniciales
    expect(await page.locator('.gem-count').textContent()).toBe('0');
    expect(await page.locator('.hits-count').textContent()).toBe('0');
    expect(await page.locator('.errors-count').textContent()).toBe('0');
    
    // 2 respuestas correctas
    for (let i = 0; i < 2; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar gemas y hits
    expect(await page.locator('.gem-count').textContent()).toBe('2');
    expect(await page.locator('.hits-count').textContent()).toBe('2');
    expect(await page.locator('.errors-count').textContent()).toBe('0');
    
    // 1 respuesta incorrecta
    const input = page.locator('.answer-input');
    await input.fill('999');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar errores incrementaron
    expect(await page.locator('.errors-count').textContent()).toBe('1');
    expect(await page.locator('.gem-count').textContent()).toBe('2');
    expect(await page.locator('.hits-count').textContent()).toBe('2');
  });
});
