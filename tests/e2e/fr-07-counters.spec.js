import { test, expect } from '@playwright/test';

/**
 * Helper para obtener la respuesta correcta
 */
async function getCorrectAnswer(page) {
  const operand1 = await page.locator('.operand-1').textContent();
  const operand2 = await page.locator('.operand-2').textContent();
  return parseInt(operand1) + parseInt(operand2);
}

test.describe('FR-7: Acumulación de gemas, hits y errores', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: Cada respuesta correcta incrementa gemas en 1', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Responder correctamente
    const correctAnswer = await getCorrectAnswer(page);
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar gemas
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBe(1);
  });

  test('AC-2: Cada respuesta correcta incrementa hits en 1', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Responder correctamente
    const correctAnswer = await getCorrectAnswer(page);
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar hits
    const hitsCount = await page.locator('.hits-count').textContent();
    expect(parseInt(hitsCount)).toBe(1);
  });

  test('AC-3: Cada respuesta incorrecta incrementa errores en 1', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Responder incorrectamente
    await input.fill('999');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar errores
    const errorsCount = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsCount)).toBe(1);
  });

  test('AC-4: Respuesta incorrecta NO incrementa gemas ni hits', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Responder incorrectamente
    await input.fill('999');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar gemas y hits siguen en 0
    const gemCount = await page.locator('.gem-count').textContent();
    const hitsCount = await page.locator('.hits-count').textContent();
    expect(parseInt(gemCount)).toBe(0);
    expect(parseInt(hitsCount)).toBe(0);
  });

  test('AC-5: Timeout incrementa errores en 1', async ({ page }) => {
    // Esperar a que el timer llegue a 0 (15 segundos + buffer)
    await page.waitForTimeout(16000);
    
    // Verificar errores
    const errorsCount = await page.locator('.errors-count').textContent();
    expect(parseInt(errorsCount)).toBe(1);
  });

  test('AC-6: Timeout NO incrementa gemas ni hits', async ({ page }) => {
    // Esperar a que el timer llegue a 0
    await page.waitForTimeout(16000);
    
    // Verificar gemas y hits siguen en 0
    const gemCount = await page.locator('.gem-count').textContent();
    const hitsCount = await page.locator('.hits-count').textContent();
    expect(parseInt(gemCount)).toBe(0);
    expect(parseInt(hitsCount)).toBe(0);
  });

  test('AC-7: Al volver al inicio, todos los contadores se reinician a 0', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Acumular algunas gemas y errores
    const correctAnswer = await getCorrectAnswer(page);
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    await input.fill('999');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar que hay gemas y errores
    const gemCountBefore = await page.locator('.gem-count').textContent();
    const errorsCountBefore = await page.locator('.errors-count').textContent();
    expect(parseInt(gemCountBefore)).toBeGreaterThanOrEqual(1);
    expect(parseInt(errorsCountBefore)).toBeGreaterThanOrEqual(1);
    
    // Volver al inicio
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Volver a entrar al juego
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que todos los contadores se reiniciaron
    const gemCountAfter = await page.locator('.gem-count').textContent();
    const hitsCountAfter = await page.locator('.hits-count').textContent();
    const errorsCountAfter = await page.locator('.errors-count').textContent();
    
    expect(parseInt(gemCountAfter)).toBe(0);
    expect(parseInt(hitsCountAfter)).toBe(0);
    expect(parseInt(errorsCountAfter)).toBe(0);
  });

  test('Escenario completo: Múltiples respuestas y verificación de contadores', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // 5 respuestas correctas
    for (let i = 0; i < 5; i++) {
      const correctAnswer = await getCorrectAnswer(page);
      await input.fill(correctAnswer.toString());
      await input.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // 3 respuestas incorrectas
    for (let i = 0; i < 3; i++) {
      await input.fill('999');
      await input.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Verificar contadores finales
    const gemCount = await page.locator('.gem-count').textContent();
    const hitsCount = await page.locator('.hits-count').textContent();
    const errorsCount = await page.locator('.errors-count').textContent();
    
    expect(parseInt(gemCount)).toBe(5);
    expect(parseInt(hitsCount)).toBe(5);
    expect(parseInt(errorsCount)).toBe(3);
  });
});
