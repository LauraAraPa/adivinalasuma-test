import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('responder correctamente una suma incrementa las gemas', async ({ app, screen }) => {
  await app.open('/');

  // Seleccionar nivel 1 (sumas simples de 1 dígito)
  await screen.locator('button.level-button--1').click();
  await screen.waitForTimeout(500);

  // Leer los operandos de la pantalla
  const operand1Text = await screen.locator('.operand-1').textContent();
  const operand2Text = await screen.locator('.operand-2').textContent();
  const operand1 = parseInt(operand1Text!.trim());
  const operand2 = parseInt(operand2Text!.trim());
  const respuestaCorrecta = operand1 + operand2;

  // Escribir la respuesta correcta y presionar Enter
  const input = screen.locator('input.answer-input');
  await input.fill(String(respuestaCorrecta));
  await input.press('Enter');

  // Esperar el feedback de éxito
  await screen.waitForTimeout(1000);

  // Verificar que las gemas incrementaron a 1
  await expect(screen.locator('.gem-count')).toHaveText('1');
});

test('responder incorrectamente muestra feedback de error', async ({ app, screen }) => {
  await app.open('/');

  await screen.locator('button.level-button--1').click();
  await screen.waitForTimeout(500);

  // Responder con un valor incorrecto
  const input = screen.locator('input.answer-input');
  await input.fill('999');
  await input.press('Enter');

  await screen.waitForTimeout(500);

  // Verificar que las gemas NO incrementaron
  await expect(screen.locator('.gem-count')).toHaveText('0');
});
