import { test, expect } from '@playwright/test';

test.describe('FR-4: Input de respuesta vía teclado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: El input acepta solo dígitos numéricos', async ({ page }) => {
    const input = page.locator('.answer-input');
    await expect(input).toBeVisible();
    
    // Intentar ingresar caracteres no numéricos
    await input.fill('abc');
    let value = await input.inputValue();
    expect(value).toBe('');
    
    // Ingresar dígitos
    await input.fill('123');
    value = await input.inputValue();
    expect(value).toBe('123');
    
    // Mezclar dígitos con letras
    await input.fill('12a3b');
    value = await input.inputValue();
    expect(value).toBe('123');
  });

  test('AC-2: El input envía la respuesta al presionar Enter', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Obtener respuesta correcta
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const correctAnswer = parseInt(operand1) + parseInt(operand2);
    
    // Ingresar respuesta y presionar Enter
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperar a que se procese
    await page.waitForTimeout(1000);
    
    // Verificar que las gemas incrementaron (respuesta correcta)
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBe(1);
  });

  test('AC-3: El input se limpia automáticamente después de cada respuesta', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Obtener respuesta correcta
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const correctAnswer = parseInt(operand1) + parseInt(operand2);
    
    // Ingresar respuesta
    await input.fill(correctAnswer.toString());
    await expect(input).toHaveValue(correctAnswer.toString());
    
    // Presionar Enter
    await input.press('Enter');
    
    // Esperar a que se procese y el input se limpie
    await page.waitForTimeout(1000);
    
    // Verificar que el input está vacío
    const value = await input.inputValue();
    expect(value).toBe('');
  });

  test('AC-4: El input recupera el foco automáticamente después de cada respuesta', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // Obtener respuesta correcta
    const operand1 = await page.locator('.operand-1').textContent();
    const operand2 = await page.locator('.operand-2').textContent();
    const correctAnswer = parseInt(operand1) + parseInt(operand2);
    
    // Ingresar respuesta
    await input.fill(correctAnswer.toString());
    await input.press('Enter');
    
    // Esperar a que se procese
    await page.waitForTimeout(1000);
    
    // Verificar que el input tiene el foco
    const isFocused = await input.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('AC-5: El input es de tipo texto y acepta entrada numérica', async ({ page }) => {
    const input = page.locator('.answer-input');
    await expect(input).toBeVisible();
    
    // Verificar que es un input de texto
    const type = await input.getAttribute('type');
    expect(type).toBe('text');
    
    // Verificar que tiene inputmode numeric (para teclados móviles)
    const inputmode = await input.getAttribute('inputmode');
    expect(inputmode).toBe('numeric');
  });

  test('AC-6: El input está visible durante todo el juego', async ({ page }) => {
    const input = page.locator('.answer-input');
    await expect(input).toBeVisible();
    
    // Responder varias preguntas
    for (let i = 0; i < 3; i++) {
      const operand1 = await page.locator('.operand-1').textContent();
      const operand2 = await page.locator('.operand-2').textContent();
      const correctAnswer = parseInt(operand1) + parseInt(operand2);
      
      await input.fill(correctAnswer.toString());
      await input.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verificar que el input sigue visible
      await expect(input).toBeVisible();
    }
  });

  test('Escenario completo: Múltiples respuestas con input', async ({ page }) => {
    const input = page.locator('.answer-input');
    
    // 3 respuestas correctas
    for (let i = 0; i < 3; i++) {
      const operand1 = await page.locator('.operand-1').textContent();
      const operand2 = await page.locator('.operand-2').textContent();
      const correctAnswer = parseInt(operand1) + parseInt(operand2);
      
      await input.fill(correctAnswer.toString());
      await input.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verificar input limpio y con foco
      await expect(input).toHaveValue('');
      const isFocused = await input.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
    
    // Verificar gemas acumuladas
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBe(3);
  });
});
