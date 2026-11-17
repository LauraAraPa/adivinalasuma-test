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
  await page.waitForTimeout(800);
}

/**
 * Helper para responder incorrectamente
 */
async function answerIncorrectly(page) {
  const input = page.locator('.answer-input');
  await input.fill('999');
  await input.press('Enter');
  await page.waitForTimeout(800);
}

test.describe('FR-14: Reacciones de Mascotas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1 (sin tutorial)
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: La mascota activa aparece al alcanzar 10 gemas', async ({ page }) => {
    const petArea = page.locator('#pet-area');
    const activePetContainer = page.locator('#active-pet-container');
    
    // Inicialmente no hay mascota (<10 gemas)
    await expect(activePetContainer).toBeHidden();
    
    // Acumular 10 gemas
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que la mascota aparece
    await expect(activePetContainer).toBeVisible({ timeout: 5000 });
    await expect(petArea).toBeVisible();
  });

  test('AC-2: Ubicación: esquina inferior derecha', async ({ page }) => {
    // Acumular 10 gemas para desbloquear mascota
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que pet-area está visible
    const petArea = page.locator('#pet-area');
    await expect(petArea).toBeVisible({ timeout: 5000 });
    
    // Verificar posición CSS (bottom y right)
    const position = await petArea.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        bottom: style.bottom,
        right: style.right
      };
    });
    
    // El pet-area debe estar en la esquina inferior derecha
    expect(position.bottom).toMatch(/0|auto/);
    expect(position.right).toMatch(/0|auto/);
  });

  test('AC-3: Estado Idle: mascota visible sin animación activa', async ({ page }) => {
    // Acumular 10 gemas
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    // Esperar a que las animaciones de reacción terminen
    await page.waitForTimeout(1500);
    
    // Verificar que la mascota está visible en estado idle
    const activePetContainer = page.locator('#active-pet-container');
    await expect(activePetContainer).toBeVisible();
    
    // Verificar que no tiene clases de animación activa
    const className = await activePetContainer.getAttribute('class');
    expect(className).not.toContain('pet-celebrate');
    expect(className).not.toContain('pet-comfort');
  });

  test('AC-4: Celebración en acierto: animación + mensaje', async ({ page }) => {
    // Acumular 10 gemas para desbloquear mascota
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    await page.waitForTimeout(1000);
    
    const activePetContainer = page.locator('#active-pet-container');
    const messageContainer = page.locator('#pet-message-container');
    
    // Responder correctamente
    await answerCorrectly(page);
    
    // Verificar animación de celebración
    await expect(activePetContainer).toHaveClass(/pet-celebrate/, { timeout: 2000 });
    
    // Verificar mensaje motivacional
    await expect(messageContainer).toHaveClass(/show/, { timeout: 2000 });
    const message = await messageContainer.textContent();
    expect(message.length).toBeGreaterThan(0);
  });

  test('AC-5: Consuelo en error: animación + mensaje', async ({ page }) => {
    // Acumular 10 gemas para desbloquear mascota
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    await page.waitForTimeout(1000);
    
    const activePetContainer = page.locator('#active-pet-container');
    const messageContainer = page.locator('#pet-message-container');
    
    // Responder incorrectamente
    await answerIncorrectly(page);
    
    // Verificar animación de consuelo
    await expect(activePetContainer).toHaveClass(/pet-comfort/, { timeout: 2000 });
    
    // Verificar mensaje de ánimo
    await expect(messageContainer).toHaveClass(/show/, { timeout: 2000 });
    const message = await messageContainer.textContent();
    expect(message.length).toBeGreaterThan(0);
  });

  test('AC-6: Desbloqueo: animación sparkle + bounce', async ({ page }) => {
    const petArea = page.locator('#pet-area');
    const activePetContainer = page.locator('#active-pet-container');
    const messageContainer = page.locator('#pet-message-container');
    
    // Acumular 9 gemas (una menos para desbloquear)
    for (let i = 0; i < 9; i++) {
      await answerCorrectly(page);
    }
    
    // La siguiente respuesta correcta desbloqueará la mascota
    await answerCorrectly(page);
    
    // Verificar que aparece la mascota
    await expect(activePetContainer).toBeVisible({ timeout: 3000 });
    
    // Verificar mensaje de desbloqueo
    await expect(messageContainer).toHaveClass(/show/, { timeout: 3000 });
    const message = await messageContainer.textContent();
    expect(message).toMatch(/desbloqueada|logro|felicidades|compañero/i);
  });

  test('AC-7: Mensaje de progreso si <10 gemas', async ({ page }) => {
    const messageContainer = page.locator('#pet-message-container');
    
    // Responder correctamente (menos de 10 gemas)
    await answerCorrectly(page);
    
    // Verificar mensaje de progreso
    await expect(messageContainer).toHaveClass(/show/, { timeout: 2000 });
    const message = await messageContainer.textContent();
    
    // El mensaje debe mencionar la próxima mascota o gemas restantes
    expect(message).toMatch(/gema|luna|falta|próxima/i);
  });

  test('AC-8: Solo 1 mascota activa a la vez', async ({ page }) => {
    // Acumular 30 gemas (desbloquea Luna y Max)
    for (let i = 0; i < 30; i++) {
      await answerCorrectly(page);
    }
    
    await page.waitForTimeout(1000);
    
    // Verificar que solo hay un contenedor de mascota activa
    const activePetContainers = page.locator('#active-pet-container');
    const count = await activePetContainers.count();
    expect(count).toBe(1);
    
    // Verificar que solo hay una imagen de mascota
    const petImages = activePetContainers.locator('img');
    const imgCount = await petImages.count();
    expect(imgCount).toBe(1);
  });

  test('Escenario completo: Flujo de reacciones de mascotas', async ({ page }) => {
    const petArea = page.locator('#pet-area');
    const activePetContainer = page.locator('#active-pet-container');
    const messageContainer = page.locator('#pet-message-container');
    
    // Estado inicial: sin mascota
    await expect(activePetContainer).toBeHidden();
    
    // 5 gemas - debe mostrar mensaje de progreso
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
    }
    await expect(messageContainer).toHaveClass(/show/, { timeout: 2000 });
    
    // 10 gemas - desbloquear Luna
    for (let i = 0; i < 5; i++) {
      await answerCorrectly(page);
    }
    await expect(activePetContainer).toBeVisible({ timeout: 3000 });
    await expect(messageContainer).toHaveClass(/show/, { timeout: 3000 });
    
    await page.waitForTimeout(1000);
    
    // Acierto - celebración
    await answerCorrectly(page);
    await expect(activePetContainer).toHaveClass(/pet-celebrate/, { timeout: 2000 });
    
    await page.waitForTimeout(1500);
    
    // Error - consuelo
    await answerIncorrectly(page);
    await expect(activePetContainer).toHaveClass(/pet-comfort/, { timeout: 2000 });
  });
});
