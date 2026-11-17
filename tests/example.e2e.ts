import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('la app abre correctamente', async ({ app, browser }) => {
  await app.open('/');
  await expect(browser.locator('body')).toBeVisible();
});
