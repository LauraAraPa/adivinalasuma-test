import { test, expect } from '@playwright/test';

test.describe('Debug: Tutorial Flow', () => {
  test('Debug: Complete tutorial step by step', async ({ page }) => {
    await page.goto('/');
    
    // Ir a Nivel 2
    await page.click('.level-button[data-level="2"]');
    
    // Esperar a que el tutorial esté visible
    await page.waitForSelector('#tutorial-screen:not(.hidden)', { timeout: 5000 });
    console.log('Tutorial visible');
    
    // Tomar screenshot para ver el estado
    await page.screenshot({ path: 'test-results/tutorial-visible.png' });
    
    // Verificar que los ejercicios están presentes
    const exercises = page.locator('.tutorial-exercise-card');
    const exerciseCount = await exercises.count();
    console.log(`Ejercicios encontrados: ${exerciseCount}`);
    
    // Completar primer ejercicio
    const exercise1 = exercises.nth(0);
    const input1 = exercise1.locator('.exercise-input');
    const answer1 = await input1.getAttribute('data-answer');
    console.log(`Respuesta ejercicio 1: ${answer1}`);
    
    await input1.fill(answer1);
    await input1.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verificar feedback
    const feedback1 = exercise1.locator('.exercise-feedback');
    const feedbackText1 = await feedback1.textContent();
    console.log(`Feedback ejercicio 1: ${feedbackText1}`);
    
    // Completar segundo ejercicio
    const exercise2 = exercises.nth(1);
    const input2 = exercise2.locator('.exercise-input');
    const answer2 = await input2.getAttribute('data-answer');
    console.log(`Respuesta ejercicio 2: ${answer2}`);
    
    await input2.fill(answer2);
    await input2.press('Enter');
    await page.waitForTimeout(1000);
    
    const feedback2 = exercise2.locator('.exercise-feedback');
    const feedbackText2 = await feedback2.textContent();
    console.log(`Feedback ejercicio 2: ${feedbackText2}`);
    
    // Screenshot antes de hacer click en "Comenzar"
    await page.screenshot({ path: 'test-results/tutorial-before-start.png' });
    
    // Hacer click en "Comenzar juego"
    const btnStart = page.locator('#btn-tutorial-start');
    const btnStartVisible = await btnStart.isVisible();
    console.log(`Botón Comenzar visible: ${btnStartVisible}`);
    
    await btnStart.click();
    console.log('Click en Comenzar juego');
    
    // Esperar un momento
    await page.waitForTimeout(1000);
    
    // Screenshot después de hacer click
    await page.screenshot({ path: 'test-results/tutorial-after-start.png' });
    
    // Verificar estado de las pantallas
    const tutorialHidden = await page.locator('#tutorial-screen').evaluate(el => el.classList.contains('hidden'));
    const gameVisible = await page.locator('#game-screen').evaluate(el => !el.classList.contains('hidden'));
    
    console.log(`Tutorial hidden: ${tutorialHidden}`);
    console.log(`Game visible: ${gameVisible}`);
    
    // Esperar a que el juego esté visible
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
    console.log('Game screen visible!');
  });
});
