import { test, expect } from '@playwright/test';

/**
 * Helper function para completar el tutorial
 * El tutorial tiene 2 ejercicios que deben completarse antes de continuar
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
    
    // Ingresar la respuesta y presionar Enter
    await input.fill(answer);
    await input.press('Enter');
    
    // Esperar a que se valide la respuesta
    await page.waitForTimeout(500);
  }
  
  // Hacer click en "Comenzar juego" para completar el tutorial
  const btnStart = page.locator('#btn-tutorial-start');
  await expect(btnStart).toBeVisible({ timeout: 5000 });
  await btnStart.click();
  
  // Esperar a que el juego esté visible (puede tomar hasta 300ms por la animación)
  await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  
  // Dar tiempo adicional para que las animaciones terminen
  await page.waitForTimeout(500);
}

test.describe('FR-16: Botón ¿Cómo lo hago?', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: El botón es visible solo en Nivel 2 y Nivel 3', async ({ page }) => {
    // Nivel 1 - botón NO visible
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    const helpButtonN1 = page.locator('#btn-help');
    await expect(helpButtonN1).toBeHidden();
    
    // Volver al home
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Nivel 2 - botón visible (después de completar tutorial)
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    const helpButtonN2 = page.locator('#btn-help');
    await expect(helpButtonN2).toBeVisible();
    
    // Volver al home
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Nivel 3 - botón visible (después de completar tutorial)
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    const helpButtonN3 = page.locator('#btn-help');
    await expect(helpButtonN3).toBeVisible();
  });

  test('AC-2: Al hacer click, se muestra el overlay con descomposición', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Click en botón de ayuda
    await page.click('#btn-help');
    
    // Verificar que el overlay se muestra
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
  });

  test('AC-3: El overlay muestra los 4 pasos de Sumas Parciales', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Click en botón de ayuda
    await page.click('#btn-help');
    
    // Verificar los 4 pasos
    const steps = page.locator('.help-step');
    await expect(steps).toHaveCount(4);
    
    // Verificar contenido de cada paso
    const step1 = steps.nth(0);
    await expect(step1.locator('.step-label')).toHaveText('Descomponer');
    
    const step2 = steps.nth(1);
    await expect(step2.locator('.step-label')).toHaveText('Sumar decenas');
    
    const step3 = steps.nth(2);
    await expect(step3.locator('.step-label')).toHaveText('Sumar unidades');
    
    const step4 = steps.nth(3);
    await expect(step4.locator('.step-label')).toHaveText('Combinar');
  });

  test('AC-4: El cronómetro se pausa mientras el overlay está abierto', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Esperar a que el timer esté visible
    const timer = page.locator('.timer-value');
    await expect(timer).toBeVisible({ timeout: 5000 });
    
    // Click en botón de ayuda para abrir overlay
    await page.click('#btn-help');
    
    // Esperar a que el overlay esté visible
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Capturar tiempo DESPUÉS de que el overlay esté abierto (ahora está pausado)
    const pausedTime = await timer.textContent();
    
    // Esperar 2 segundos
    await page.waitForTimeout(2000);
    
    // Verificar que el timer no cambió (sigue pausado)
    const timeAfterWait = await timer.textContent();
    expect(timeAfterWait).toBe(pausedTime);
  });

  test('AC-5: El overlay se puede cerrar con botón X', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Abrir overlay
    await page.click('#btn-help');
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Cerrar con botón X
    await page.click('#btn-help-close');
    
    // Verificar que el overlay se cerró
    await expect(overlay).toBeHidden({ timeout: 5000 });
  });

  test('AC-5: El overlay se puede cerrar con tecla Escape', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Abrir overlay
    await page.click('#btn-help');
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Cerrar con Escape
    await page.keyboard.press('Escape');
    
    // Verificar que el overlay se cerró
    await expect(overlay).toBeHidden({ timeout: 5000 });
  });

  test('AC-5: El overlay se puede cerrar con tecla Enter', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Abrir overlay
    await page.click('#btn-help');
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Cerrar con Enter
    await page.keyboard.press('Enter');
    
    // Verificar que el overlay se cerró
    await expect(overlay).toBeHidden({ timeout: 5000 });
  });

  test('AC-6: Al cerrar el overlay, el cronómetro se reanuda', async ({ page }) => {
    // Ir a Nivel 2 y completar tutorial
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Abrir overlay
    await page.click('#btn-help');
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Capturar tiempo DESPUÉS de que el overlay esté abierto (ahora está pausado)
    const timer = page.locator('.timer-value');
    const pausedTime = await timer.textContent();
    
    // Cerrar overlay con Escape
    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden({ timeout: 5000 });
    
    // Esperar 2 segundos
    await page.waitForTimeout(2000);
    
    // Verificar que el timer cambió (se reanudó)
    const resumedTime = await timer.textContent();
    const pausedSeconds = parseInt(pausedTime);
    const resumedSeconds = parseInt(resumedTime);
    
    // El tiempo debe haber disminuido (el timer está corriendo)
    expect(resumedSeconds).toBeLessThan(pausedSeconds);
  });

  test('Escenario completo: Abrir ayuda, ver pasos, cerrar, verificar timer', async ({ page }) => {
    // Ir a Nivel 3 y completar tutorial
    await page.click('.level-button[data-level="3"]');
    await completeTutorial(page, 3);
    
    // Verificar que el botón de ayuda está visible
    const helpButton = page.locator('#btn-help');
    await expect(helpButton).toBeVisible({ timeout: 5000 });
    
    // Abrir overlay
    await page.click('#btn-help');
    const overlay = page.locator('#help-overlay');
    await expect(overlay).toBeVisible({ timeout: 5000 });
    
    // Capturar tiempo pausado (después de que el overlay esté visible)
    const timer = page.locator('.timer-value');
    await page.waitForTimeout(500); // Esperar a que el timer se pause
    const pausedTime = await timer.textContent();
    
    // Esperar 2 segundos y verificar que el timer sigue pausado
    await page.waitForTimeout(2000);
    const timeAfterWait = await timer.textContent();
    expect(timeAfterWait).toBe(pausedTime);
    
    // Verificar los 4 pasos
    const steps = page.locator('.help-step');
    await expect(steps).toHaveCount(4);
    
    // Cerrar con Escape
    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden({ timeout: 5000 });
    
    // Verificar que el timer se reanudó (el tiempo debe disminuir)
    await page.waitForTimeout(2000);
    const resumedTime = await timer.textContent();
    const pausedSeconds = parseInt(pausedTime);
    const resumedSeconds = parseInt(resumedTime);
    expect(resumedSeconds).toBeLessThan(pausedSeconds);
  });
});
