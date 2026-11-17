import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('la pantalla de inicio muestra el título y los niveles', async ({ app, screen }) => {
  await app.open('/');

  await expect(screen.locator('.home-title')).toBeVisible();
  await expect(screen.locator('.home-subtitle')).toBeVisible();
  await expect(screen.locator('button.level-button--1')).toBeVisible();
  await expect(screen.locator('button.level-button--2')).toBeVisible();
});

test('al seleccionar nivel 1 se muestra la pantalla de juego', async ({ app, screen }) => {
  await app.open('/');

  await screen.locator('button.level-button--1').click();

  // Esperar la transición
  await screen.waitForTimeout(500);

  await expect(screen.locator('#game-screen')).toBeVisible();
  await expect(screen.locator('.operand-1')).toBeVisible();
  await expect(screen.locator('.operand-2')).toBeVisible();
  await expect(screen.locator('input.answer-input')).toBeVisible();
  await expect(screen.locator('.timer-value')).toBeVisible();
  await expect(screen.locator('.gem-count')).toHaveText('0');
});

test('al seleccionar nivel 2 se muestra la pantalla de juego con nivel 2', async ({ app, screen }) => {
  await app.open('/');

  await screen.locator('button.level-button--2').click();
  await screen.waitForTimeout(500);

  await expect(screen.locator('.level-badge-text')).toContainText('2');
});
