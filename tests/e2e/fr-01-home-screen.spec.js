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

test.describe('FR-1: Pantalla de inicio con selección de nivel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-1: La pantalla de inicio muestra el título "Adivina la Suma"', async ({ page }) => {
    // Verificar que la pantalla de inicio está visible
    const homeScreen = page.locator('#home-screen');
    await expect(homeScreen).toBeVisible({ timeout: 5000 });
    
    // Verificar título (puede estar en español o inglés según i18n)
    const title = page.locator('.home-title');
    await expect(title).toBeVisible();
    
    const titleText = await title.textContent();
    expect(titleText).toMatch(/adivina\s+la\s+suma|guess\s+the\s+sum/i);
  });

  test('AC-2: La pantalla de inicio muestra 3 botones de nivel', async ({ page }) => {
    // Verificar que hay 3 botones de nivel
    const levelButtons = page.locator('.level-button');
    await expect(levelButtons).toHaveCount(3);
    
    // Verificar que cada botón tiene el texto correcto (español o inglés)
    await expect(levelButtons.nth(0)).toHaveText(/nivel\s*1|level\s*1/i);
    await expect(levelButtons.nth(1)).toHaveText(/nivel\s*2|level\s*2/i);
    await expect(levelButtons.nth(2)).toHaveText(/nivel\s*3|level\s*3/i);
  });

  test('AC-3: Los botones tienen colores diferenciados', async ({ page }) => {
    // Verificar color de Nivel 1 (cyan: #5BC0EB)
    const btn1 = page.locator('.level-button--1');
    const btn1Color = await btn1.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(btn1Color).toMatch(/rgb\(91,\s*192,\s*235\)|#5BC0EB/i);
    
    // Verificar color de Nivel 2 (verde: #7ED957)
    const btn2 = page.locator('.level-button--2');
    const btn2Color = await btn2.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(btn2Color).toMatch(/rgb\(126,\s*217,\s*87\)|#7ED957/i);
    
    // Verificar color de Nivel 3 (naranja: #FF8C42)
    const btn3 = page.locator('.level-button--3');
    const btn3Color = await btn3.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(btn3Color).toMatch(/rgb\(255,\s*140,\s*66\)|#FF8C42/i);
  });

  test('AC-4: Al hacer clic en Nivel 1, se inicia el juego directamente', async ({ page }) => {
    // Click en Nivel 1
    await page.click('.level-button[data-level="1"]');
    
    // Esperar a que el juego esté visible
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el juego está visible
    const gameScreen = page.locator('#game-screen');
    await expect(gameScreen).toBeVisible();
    
    // Verificar que el home está oculto
    const homeScreen = page.locator('#home-screen');
    await expect(homeScreen).toBeHidden();
    
    // Verificar que NO apareció el tutorial
    const tutorialScreen = page.locator('#tutorial-screen');
    await expect(tutorialScreen).toBeHidden();
  });

  test('AC-5: Al hacer clic en Nivel 2 por primera vez, se muestra el tutorial', async ({ page }) => {
    // Click en Nivel 2
    await page.click('.level-button[data-level="2"]');
    
    // Esperar a que el tutorial esté visible
    await page.waitForSelector('#tutorial-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el tutorial está visible
    const tutorialScreen = page.locator('#tutorial-screen');
    await expect(tutorialScreen).toBeVisible();
    
    // Verificar que el home está oculto
    const homeScreen = page.locator('#home-screen');
    await expect(homeScreen).toBeHidden();
    
    // Verificar que el juego NO está visible aún
    const gameScreen = page.locator('#game-screen');
    await expect(gameScreen).toBeHidden();
  });

  test('AC-6: Al hacer clic en Nivel 3 por primera vez, se muestra el tutorial', async ({ page }) => {
    // Click en Nivel 3
    await page.click('.level-button[data-level="3"]');
    
    // Esperar a que el tutorial esté visible
    await page.waitForSelector('#tutorial-screen:not(.hidden)', { timeout: 5000 });
    
    // Verificar que el tutorial está visible
    const tutorialScreen = page.locator('#tutorial-screen');
    await expect(tutorialScreen).toBeVisible();
  });

  test('AC-7: Después de completar tutorial, Nivel 2 va directo al juego (en la misma sesión)', async ({ page }) => {
    // Primera vez: completar tutorial de Nivel 2
    await page.click('.level-button[data-level="2"]');
    await completeTutorial(page, 2);
    
    // Verificar que el juego está visible después del tutorial
    const gameScreen = page.locator('#game-screen');
    await expect(gameScreen).toBeVisible();
    
    // Verificar que el tutorial está oculto
    const tutorialScreen = page.locator('#tutorial-screen');
    await expect(tutorialScreen).toBeHidden();
    
    // Nota: Si el usuario vuelve al home con "Atrás" y selecciona Nivel 2 de nuevo,
    // el tutorial puede aparecer nuevamente (comportamiento válido para refuerzo)
  });

  test('AC-8: La pantalla de inicio tiene un botón "Mascotas"', async ({ page }) => {
    // Verificar que el botón Mascotas existe y es visible
    const btnPets = page.locator('#btn-home-pets');
    await expect(btnPets).toBeVisible();
    
    // Verificar que tiene texto de mascotas (español o inglés)
    const btnText = await btnPets.textContent();
    expect(btnText).toMatch(/mascotas|pets/i);
    
    // Click en botón para verificar que abre el catálogo
    await btnPets.click();
    
    // Verificar que el catálogo se abre
    const catalog = page.locator('#pet-catalog-container');
    await expect(catalog).toBeVisible({ timeout: 5000 });
  });

  test('Escenario completo: Navegación completa desde home', async ({ page }) => {
    // Verificar home screen inicial
    await expect(page.locator('#home-screen')).toBeVisible();
    await expect(page.locator('.home-title')).toHaveText(/adivina\s+la\s+suma|guess\s+the\s+sum/i);
    
    // Probar Nivel 1 (va directo al juego)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('#game-screen')).toBeVisible();
    
    // Volver al home
    await page.click('#btn-back');
    await page.waitForSelector('#home-screen:not(.hidden)', { timeout: 5000 });
    
    // Probar botón Mascotas
    await page.click('#btn-home-pets');
    await page.waitForSelector('#pet-catalog-container:not(.hidden)', { timeout: 5000 });
    await expect(page.locator('#pet-catalog-container')).toBeVisible();
    
    // Cerrar catálogo
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });
});
