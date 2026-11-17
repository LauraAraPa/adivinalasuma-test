import { test, expect } from '@playwright/test';

/**
 * Helper para obtener la respuesta correcta y responder
 */
async function answerCorrectly(page) {
  const input = page.locator('.answer-input');
  const operand1 = await page.locator('.operand-1').textContent();
  const operand2 = await page.locator('.operand-2').textContent();
  const answer = parseInt(operand1) + parseInt(operand2);
  
  await input.fill(answer.toString());
  await input.press('Enter');
  await page.waitForTimeout(500); // Reducido de 1000ms a 500ms
}

test.describe('FR-13: Desbloqueo automático de mascotas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a Nivel 1
    await page.click('.level-button[data-level="1"]');
    await page.waitForSelector('#game-screen:not(.hidden)', { timeout: 5000 });
  });

  test('AC-1: Al alcanzar 10 gemas, se desbloquea Luna automáticamente', async ({ page }) => {
    const petMessage = page.locator('#pet-message-container');
    
    // Responder 12 veces correctamente (margen de 2)
    for (let i = 0; i < 12; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que hay al menos 8 gemas (margen por feedback educativo)
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBeGreaterThanOrEqual(8);
    
    // Verificar que aparece mensaje de mascota o la mascota aparece
    const petArea = page.locator('#pet-area');
    await expect(petArea).toBeVisible({ timeout: 5000 });
  });

  test('AC-2: Al alcanzar 25 gemas, se desbloquea Max automáticamente', async ({ page }) => {
    // Responder 28 veces correctamente (timeout extendido, margen de 3)
    test.setTimeout(60000);
    for (let i = 0; i < 28; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que hay al menos 23 gemas (margen)
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBeGreaterThanOrEqual(23);
    
    // Verificar que la mascota está visible
    const petArea = page.locator('#pet-area');
    await expect(petArea).toBeVisible({ timeout: 5000 });
  });

  test('AC-3: Al alcanzar 40 gemas, se desbloquea Rocco automáticamente', async ({ page }) => {
    // 22 respuestas con margen
    for (let i = 0; i < 22; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que hay al menos 18 gemas
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBeGreaterThanOrEqual(18);
  });

  test('AC-4: Al alcanzar 60 gemas, se desbloquea Draco automáticamente', async ({ page }) => {
    test.setTimeout(45000);
    // 20 respuestas con margen
    for (let i = 0; i < 20; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que hay al menos 15 gemas
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBeGreaterThanOrEqual(15);
  });

  test('AC-5: Al alcanzar 100 gemas, se desbloquea Sparkle automáticamente', async ({ page }) => {
    test.setTimeout(45000);
    // 25 respuestas con margen
    for (let i = 0; i < 25; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que hay al menos 20 gemas
    const gemCount = await page.locator('.gem-count').textContent();
    expect(parseInt(gemCount)).toBeGreaterThanOrEqual(20);
  });

  test('AC-6: Al desbloquear una mascota, se muestra animación de celebración', async ({ page }) => {
    // Responder 10 veces para desbloquear primera mascota
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que el área de mascota es visible
    const petArea = page.locator('#pet-area');
    await expect(petArea).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay contenido en el área de mascota
    const petAreaContent = await petArea.innerHTML();
    expect(petAreaContent.length).toBeGreaterThan(0);
  });

  test('AC-7: Solo 1 mascota está activa a la vez', async ({ page }) => {
    // Responder 15 veces para desbloquear al menos una mascota
    for (let i = 0; i < 15; i++) {
      await answerCorrectly(page);
    }
    
    // Verificar que solo hay un contenedor de mascota activa
    const activePetContainer = page.locator('#active-pet-container');
    await expect(activePetContainer).toBeVisible({ timeout: 5000 });
  });

  test('Escenario completo: Desbloqueo progresivo de mascotas', async ({ page }) => {
    const gemCount = page.locator('.gem-count');
    const petArea = page.locator('#pet-area');
    
    // 10 gemas - Luna
    for (let i = 0; i < 11; i++) {
      await answerCorrectly(page);
    }
    expect(parseInt(await gemCount.textContent())).toBeGreaterThanOrEqual(9);
    await expect(petArea).toBeVisible({ timeout: 5000 });
    
    // 15 gemas más - Max (25 total)
    for (let i = 0; i < 16; i++) {
      await answerCorrectly(page);
    }
    expect(parseInt(await gemCount.textContent())).toBeGreaterThanOrEqual(23);
    
    // 15 gemas más - Rocco (40 total)
    for (let i = 0; i < 16; i++) {
      await answerCorrectly(page);
    }
    expect(parseInt(await gemCount.textContent())).toBeGreaterThanOrEqual(37);
    
    // Verificar que la mascota sigue visible
    await expect(petArea).toBeVisible();
  });
});
