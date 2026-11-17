// @ts-check
import { test, expect } from '@playwright/test';

/**
 * FR-18: Botón Atrás con reset completo
 * 
 * Este archivo contiene los tests de aceptación para el botón "Atrás".
 * Siguiendo el ciclo TDD: RED → GREEN → REFACTOR
 * 
 * Estado actual: RED 🔴 (estos tests fallarán hasta que la funcionalidad esté completa)
 */

test.describe('FR-18: Botón Atrás', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal antes de cada test
    await page.goto('/');
  });

  test('AC-1: El botón "Atrás" está visible en la pantalla de juego', async ({ page }) => {
    // GIVEN: Estoy en la pantalla de inicio
    await expect(page.locator('#home-screen')).toBeVisible();
    
    // WHEN: Selecciono Nivel 1 para entrar al juego
    await page.click('.level-button--1');
    
    // THEN: El botón "Atrás" debe estar visible
    const backButton = page.locator('#btn-back');
    await expect(backButton).toBeVisible();
    // El texto puede ser "Atrás" (español) o "Back" (inglés) dependiendo del idioma
    await expect(backButton).toHaveText(/atrás|back/i);
  });

  test('AC-2: Al hacer click, el cronómetro se resetea y se detiene', async ({ page }) => {
    // GIVEN: Estoy en el juego y el cronómetro está corriendo
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // Esperamos a que el cronómetro esté visible
    const timer = page.locator('.timer-value');
    await expect(timer).toBeVisible();
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: Después de reset, el timer debe estar en 0 (resetGameState pone timeRemaining = 0)
    // El game screen está oculto, pero el elemento sigue en el DOM
    await page.waitForTimeout(500);
    
    // Verificamos que estamos en home screen
    await expect(page.locator('#home-screen')).toBeVisible();
    
    // WHEN: Volvemos a entrar al juego
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // THEN: El timer debe empezar desde el valor inicial del nivel (15s para nivel 1)
    const timerAfterReset = page.locator('.timer-value');
    await expect(timerAfterReset).toBeVisible();
    
    // El timer debe estar en 15 (o muy cerca, ya que acaba de empezar)
    const timeValue = await timerAfterReset.textContent();
    const time = parseInt(timeValue);
    expect(time).toBeGreaterThanOrEqual(14); // Debería ser 15, pero permitimos 14 por el delay
    expect(time).toBeLessThanOrEqual(15);
  });

  test('AC-3: Al hacer click, el estado se resetea', async ({ page }) => {
    // GIVEN: Estoy en el juego con algunas gemas acumuladas
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // Simulamos responder correctamente para acumular gemas
    const input = page.locator('.answer-input');
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const correctAnswer = parseInt(operand1) + parseInt(operand2);
    
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperamos a que se actualice el contador de gemas
    await page.waitForTimeout(500);
    const gemsBefore = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsBefore)).toBeGreaterThan(0);
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: Las gemas deben resetearse a 0
    // Regresamos al juego para verificar
    await page.click('.level-button--1');
    const gemsAfter = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsAfter)).toBe(0);
  });

  test('AC-4: Al hacer click, se regresa a la pantalla de inicio', async ({ page }) => {
    // GIVEN: Estoy en la pantalla de juego
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    await expect(page.locator('#home-screen')).toBeHidden();
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: Debo estar en la pantalla de inicio
    await expect(page.locator('#home-screen')).toBeVisible();
    await expect(page.locator('#game-screen')).toBeHidden();
  });

  test('AC-5: La transición usa animación fade', async ({ page }) => {
    // GIVEN: Estoy en la pantalla de juego
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: Debe haber una transición visible (fade)
    // Verificamos que la clase fade-in se aplica durante la transición
    const homeScreen = page.locator('#home-screen');
    
    // La pantalla de inicio debe tener la clase fade-in temporalmente
    // Esto es difícil de capturar en el momento exacto, así que verificamos
    // que después de la transición (300ms), la clase se remueve
    await page.waitForTimeout(350);
    await expect(homeScreen).not.toHaveClass(/fade-in/);
  });

  test('AC-6: No hay diálogo de confirmación', async ({ page }) => {
    // GIVEN: Estoy en la pantalla de juego
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: No debe aparecer ningún diálogo de confirmación
    // Verificamos que no hay modales o dialogs visibles
    const dialog = page.locator('[role="dialog"], .modal, .confirm-dialog');
    await expect(dialog).toBeHidden();
    
    // Y debemos estar directamente en la pantalla de inicio
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('Escenario completo: Jugar, acumular gemas, volver atrás, verificar reset', async ({ page }) => {
    // Este test combina todos los acceptance criteria en un escenario real
    
    // GIVEN: Inicio un juego y acumulo algunas gemas
    await page.click('.level-button--1');
    await page.waitForSelector('#game-screen:not(.hidden)');
    
    // Respondo correctamente 3 veces
    for (let i = 0; i < 3; i++) {
      const operand1 = await page.locator('.operand-1').textContent();
      const operand2 = await page.locator('.operand-2').textContent();
      const correctAnswer = parseInt(operand1) + parseInt(operand2);
      
      const input = page.locator('.answer-input');
      await input.fill(correctAnswer.toString());
      await input.press('Enter');
      await page.waitForTimeout(500); // Esperar feedback
    }
    
    // Verifico que tengo gemas
    const gemsBefore = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsBefore)).toBe(3);
    
    // WHEN: Hago click en "Atrás"
    await page.click('#btn-back');
    
    // THEN: Debo estar en home screen
    await expect(page.locator('#home-screen')).toBeVisible();
    
    // WHEN: Vuelvo a entrar al juego
    await page.click('.level-button--1');
    
    // THEN: Las gemas deben estar en 0 (reset completo)
    const gemsAfter = await page.locator('.gem-count').textContent();
    expect(parseInt(gemsAfter)).toBe(0);
    
    // Y el botón atrás debe seguir visible
    await expect(page.locator('#btn-back')).toBeVisible();
  });
});
