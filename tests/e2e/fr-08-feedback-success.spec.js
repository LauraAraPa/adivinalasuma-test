import { test, expect } from '@playwright/test';

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
}

test.describe('FR-8: Feedback Visual de Acierto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: Borde verde con glow alrededor del área de entrada', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Verificar que se agrega la clase success-border
    await expect(inputArea).toHaveClass(/success-border/, { timeout: 500 });
    
    // Esperar a que se remueva (800ms)
    await page.waitForTimeout(1000);
    await expect(inputArea).not.toHaveClass(/success-border/);
  });

  test('AC-2: Check mark animado aparece', async ({ page }) => {
    const checkMark = page.locator('.check-mark');
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Verificar que el check mark se muestra
    await expect(checkMark).toHaveClass(/show/, { timeout: 500 });
    
    // Esperar a que se oculte (800ms)
    await page.waitForTimeout(1000);
    await expect(checkMark).not.toHaveClass(/show/);
  });

  test('AC-3: Partículas de colores explotan desde el centro', async ({ page }) => {
    const particlesContainer = page.locator('.particles-container');
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Esperar a que se creen las partículas (100ms)
    await page.waitForTimeout(200);
    
    // Verificar que hay partículas creadas
    const particles = particlesContainer.locator('.particle');
    const count = await particles.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar que las partículas tienen colores
    const firstParticle = particles.first();
    const backgroundColor = await firstParticle.evaluate(el => el.style.backgroundColor);
    expect(backgroundColor).toBeTruthy();
    
    // Esperar a que se remuevan (1000ms)
    await page.waitForTimeout(1200);
    const countAfter = await particles.count();
    expect(countAfter).toBe(0);
  });

  test('AC-4: Nueva gema aparece en el contador', async ({ page }) => {
    const gemCount = page.locator('.gem-count');
    
    // Obtener valor inicial
    const initialGems = await gemCount.textContent();
    
    // Responder correctamente
    await answerCorrectly(page);
    await page.waitForTimeout(1000);
    
    // Verificar que las gemas incrementaron
    const finalGems = await gemCount.textContent();
    expect(parseInt(finalGems)).toBe(parseInt(initialGems) + 1);
  });

  test('AC-5: Duración 0.5-1 segundos', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    const startTime = Date.now();
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Esperar a que aparezca el feedback
    await expect(inputArea).toHaveClass(/success-border/, { timeout: 500 });
    
    // Esperar a que desaparezca
    await expect(inputArea).not.toHaveClass(/success-border/, { timeout: 1500 });
    
    const elapsed = Date.now() - startTime;
    
    // Verificar que duró entre 500ms y 1500ms (0.5-1.5s con margen)
    expect(elapsed).toBeGreaterThanOrEqual(500);
    expect(elapsed).toBeLessThanOrEqual(1500);
  });

  test('Escenario completo: Feedback visual completo al responder correctamente', async ({ page }) => {
    const inputArea = page.locator('.input-area');
    const checkMark = page.locator('.check-mark');
    const particlesContainer = page.locator('.particles-container');
    const gemCount = page.locator('.gem-count');
    
    // Valor inicial de gemas
    const initialGems = await gemCount.textContent();
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Verificar feedback visual inmediato (< 500ms)
    await expect(inputArea).toHaveClass(/success-border/, { timeout: 500 });
    await expect(checkMark).toHaveClass(/show/, { timeout: 500 });
    
    // Verificar partículas creadas
    await page.waitForTimeout(200);
    const particles = particlesContainer.locator('.particle');
    const particleCount = await particles.count();
    expect(particleCount).toBeGreaterThan(0);
    
    // Esperar a que el feedback desaparezca (800ms)
    await page.waitForTimeout(1000);
    await expect(inputArea).not.toHaveClass(/success-border/);
    await expect(checkMark).not.toHaveClass(/show/);
    
    // Verificar que las gemas incrementaron
    const finalGems = await gemCount.textContent();
    expect(parseInt(finalGems)).toBe(parseInt(initialGems) + 1);
    
    // Verificar que las partículas se removieron
    await page.waitForTimeout(500);
    const particleCountAfter = await particles.count();
    expect(particleCountAfter).toBe(0);
  });
});
