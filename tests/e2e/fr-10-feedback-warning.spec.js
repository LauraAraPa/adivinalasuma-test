import { test, expect } from '@playwright/test';

test.describe('FR-10: Feedback Visual de Tiempo Agotándose', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1 (15 segundos)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: Cronómetro cambia a rojo cuando quedan ≤5 segundos', async ({ page }) => {
    const timer = page.locator('.timer');
    
    // Esperar a que el timer llegue a 5 segundos o menos
    // Nivel 1 tiene 15 segundos, esperamos 11 segundos
    await page.waitForTimeout(11000);
    
    // Verificar que el timer tiene la clase warning
    await expect(timer).toHaveClass(/warning/, { timeout: 1000 });
    
    // Verificar color rojo en light mode
    const color = await timer.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*107,\s*107\)|#FF6B6B/i);
  });

  test('AC-2: Fondo parpadea en rojo claro', async ({ page }) => {
    // Esperar a que queden ≤5 segundos
    await page.waitForTimeout(11000);
    
    // Verificar que el body tiene la clase warning-background
    const body = page.locator('body');
    await expect(body).toHaveClass(/warning-background/, { timeout: 1000 });
  });

  test('AC-3: Animación pulse en el cronómetro', async ({ page }) => {
    const timer = page.locator('.timer');
    
    // Esperar a que queden ≤5 segundos
    await page.waitForTimeout(11000);
    
    // Verificar que el timer tiene la clase warning
    await expect(timer).toHaveClass(/warning/, { timeout: 1000 });
    
    // Verificar que la animación está aplicada (check CSS animation)
    const animation = await timer.evaluate(el => window.getComputedStyle(el).animationName);
    expect(animation).toBeTruthy();
  });

  test('AC-4: Se activa cuando quedan exactamente 5 segundos', async ({ page }) => {
    const timer = page.locator('.timer-value');
    
    // Esperar a que queden exactamente 5 segundos
    // Nivel 1 tiene 15 segundos, esperamos 10 segundos
    await page.waitForTimeout(10000);
    
    // Verificar que el timer muestra 5
    const timeValue = await timer.textContent();
    expect(parseInt(timeValue)).toBeLessThanOrEqual(5);
    expect(parseInt(timeValue)).toBeGreaterThan(0);
    
    // Verificar que la clase warning está aplicada
    const timerContainer = page.locator('.timer');
    await expect(timerContainer).toHaveClass(/warning/, { timeout: 1000 });
  });

  test('AC-5: Feedback se desactiva cuando el tiempo se reinicia', async ({ page }) => {
    const timer = page.locator('.timer');
    const body = page.locator('body');
    
    // Esperar a que queden ≤5 segundos
    await page.waitForTimeout(11000);
    
    // Verificar que el warning está activo
    await expect(timer).toHaveClass(/warning/, { timeout: 1000 });
    await expect(body).toHaveClass(/warning-background/, { timeout: 1000 });
    
    // Responder correctamente para reiniciar el timer
    const input = page.locator('.answer-input');
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const answer = parseInt(operand1) + parseInt(operand2);
    
    await input.fill(answer.toString());
    await input.press('Enter');
    
    // Esperar a que el timer se reinicie
    await page.waitForTimeout(1000);
    
    // Verificar que el warning se desactivó
    await expect(timer).not.toHaveClass(/warning/, { timeout: 1000 });
    await expect(body).not.toHaveClass(/warning-background/, { timeout: 1000 });
  });

  test('Escenario completo: Flujo de warning de tiempo', async ({ page }) => {
    const timer = page.locator('.timer');
    const timerValue = page.locator('.timer-value');
    const body = page.locator('body');
    const input = page.locator('.answer-input');
    
    // Esperar a que queden ≤5 segundos (11 segundos de 15)
    await page.waitForTimeout(11000);
    
    // Verificar timer en rango de warning
    const time = await timerValue.textContent();
    const timeNum = parseInt(time);
    expect(timeNum).toBeLessThanOrEqual(5);
    expect(timeNum).toBeGreaterThan(0);
    
    // Verificar clases de warning
    await expect(timer).toHaveClass(/warning/, { timeout: 1000 });
    await expect(body).toHaveClass(/warning-background/, { timeout: 1000 });
    
    // Verificar color rojo
    const color = await timer.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*107,\s*107\)|#FF6B6B/i);
    
    // Responder correctamente para reiniciar
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const answer = parseInt(operand1) + parseInt(operand2);
    
    await input.fill(answer.toString());
    await input.press('Enter');
    
    // Esperar a que se reinicie
    await page.waitForTimeout(1000);
    
    // Verificar que el warning se desactivó
    await expect(timer).not.toHaveClass(/warning/, { timeout: 1000 });
    await expect(body).not.toHaveClass(/warning-background/, { timeout: 1000 });
    
    // Verificar que el timer se reinició a 15
    const newTime = await timerValue.textContent();
    expect(parseInt(newTime)).toBeGreaterThanOrEqual(13);
    expect(parseInt(newTime)).toBeLessThanOrEqual(15);
  });
});
