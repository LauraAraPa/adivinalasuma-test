import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('el toggle de tema cambia entre modo claro y oscuro', async ({ app, screen }) => {
  await app.open('/');

  // Verificar que existe el botón de tema
  const themeToggle = screen.locator('button.theme-toggle');
  await expect(themeToggle).toBeVisible();

  // Hacer clic para cambiar el tema
  await themeToggle.click();
  await screen.waitForTimeout(300);

  // Verificar que el modo oscuro se activó
  const html = screen.locator('html');
  const hasDarkMode = await html.evaluate((el) => el.classList.contains('dark-mode'));
  expect(hasDarkMode).toBe(true);

  // Volver al modo claro
  await themeToggle.click();
  await screen.waitForTimeout(300);

  const hasDarkModeAfter = await html.evaluate((el) => el.classList.contains('dark-mode'));
  expect(hasDarkModeAfter).toBe(false);
});

test('el selector de idioma cambia entre español e inglés', async ({ app, screen }) => {
  await app.open('/');

  const languageSelector = screen.locator('select.language-selector');
  await expect(languageSelector).toBeVisible();

  // Cambiar a inglés
  await languageSelector.selectOption('en');
  await screen.waitForTimeout(300);

  // Verificar que el subtítulo cambió
  const subtitle = screen.locator('.home-subtitle');
  await expect(subtitle).toContainText('Select');

  // Volver a español
  await languageSelector.selectOption('es');
  await screen.waitForTimeout(300);

  await expect(subtitle).toContainText('Selecciona');
});
