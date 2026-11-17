import { test, expect } from '@playwright/test';

/**
 * Helper para responder incorrectamente
 */
async function answerIncorrectly(page) {
  const input = page.locator('.answer-input');
  await input.fill('999');
  await input.press('Enter');
}

test.describe('FR-9: Feedback Visual de Error', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: Shake horizontal suave (0.5s)', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    const operationDisplay = page.locator('.operation-display');
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Verificar que se agrega la clase shake a input-area y operation-display
    await expect(inputArea).toHaveClass(/shake/, { timeout: 500 });
    await expect(operationDisplay).toHaveClass(/shake/, { timeout: 500 });
    
    // Esperar a que se remueva (500ms)
    await page.waitForTimeout(700);
    await expect(inputArea).not.toHaveClass(/shake/);
    await expect(operationDisplay).not.toHaveClass(/shake/);
  });

  test('AC-2: Borde rojo con glow', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Verificar que se agrega la clase error-border
    await expect(inputArea).toHaveClass(/error-border/, { timeout: 500 });
    
    // Esperar a que se remueva (800ms)
    await page.waitForTimeout(1000);
    await expect(inputArea).not.toHaveClass(/error-border/);
  });

  test('AC-3: X mark en coral', async ({ page }) => {
    const xMark = page.locator('.x-mark');
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Verificar que el X mark se muestra
    await expect(xMark).toHaveClass(/show/, { timeout: 500 });
    
    // Esperar a que se oculte (800ms)
    await page.waitForTimeout(1000);
    await expect(xMark).not.toHaveClass(/show/);
  });

  test('AC-4: Duración 0.5-1 segundos', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    const startTime = Date.now();
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Esperar a que aparezca el feedback
    await expect(inputArea).toHaveClass(/error-border/, { timeout: 500 });
    
    // Esperar a que desaparezca
    await expect(inputArea).not.toHaveClass(/error-border/, { timeout: 1500 });
    
    const elapsed = Date.now() - startTime;
    
    // Verificar que duró entre 500ms y 1500ms (0.5-1.5s con margen)
    expect(elapsed).toBeGreaterThanOrEqual(500);
    expect(elapsed).toBeLessThanOrEqual(1500);
  });

  test('AC-5: Sin penalización de gemas', async ({ page }) => {
    const gemCount = page.locator('.gem-count');
    
    // Obtener valor inicial
    const initialGems = await gemCount.textContent();
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    await page.waitForTimeout(1000);
    
    // Verificar que las gemas NO cambiaron
    const finalGems = await gemCount.textContent();
    expect(parseInt(finalGems)).toBe(parseInt(initialGems));
  });

  test('Escenario completo: Feedback visual completo al responder incorrectamente', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    const operationDisplay = page.locator('.operation-display');
    const xMark = page.locator('.x-mark');
    const gemCount = page.locator('.gem-count');
    
    // Valor inicial de gemas
    const initialGems = await gemCount.textContent();
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Verificar feedback visual inmediato (< 500ms)
    await expect(inputArea).toHaveClass(/error-border/, { timeout: 500 });
    await expect(xMark).toHaveClass(/show/, { timeout: 500 });
    await expect(inputArea).toHaveClass(/shake/, { timeout: 500 });
    await expect(operationDisplay).toHaveClass(/shake/, { timeout: 500 });
    
    // Esperar a que el feedback desaparezca (800ms)
    await page.waitForTimeout(1000);
    await expect(inputArea).not.toHaveClass(/error-border/);
    await expect(xMark).not.toHaveClass(/show/);
    await expect(inputArea).not.toHaveClass(/shake/);
    await expect(operationDisplay).not.toHaveClass(/shake/);
    
    // Verificar que las gemas NO cambiaron
    const finalGems = await gemCount.textContent();
    expect(parseInt(finalGems)).toBe(parseInt(initialGems));
  });
});
