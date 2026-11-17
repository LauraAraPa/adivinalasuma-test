import { validateAnswer } from '../../src/core/validator.js';

describe('validateAnswer', () => {
  describe('respuesta correcta', () => {
    test('retorna true cuando userAnswer es igual a sum.answer', () => {
      const sum = { operand1: 23, operand2: 45, answer: 68 };
      const result = validateAnswer(sum, 68);
      expect(result).toBe(true);
    });

    test('retorna true para sumas de Nivel 1', () => {
      const sum = { operand1: 5, operand2: 3, answer: 8 };
      const result = validateAnswer(sum, 8);
      expect(result).toBe(true);
    });

    test('retorna true para sumas de Nivel 2', () => {
      const sum = { operand1: 87, operand2: 56, answer: 143 };
      const result = validateAnswer(sum, 143);
      expect(result).toBe(true);
    });
  });

  describe('respuesta incorrecta', () => {
    test('retorna false cuando userAnswer es diferente a sum.answer', () => {
      const sum = { operand1: 23, operand2: 45, answer: 68 };
      const result = validateAnswer(sum, 13);
      expect(result).toBe(false);
    });

    test('retorna false para respuestas menores', () => {
      const sum = { operand1: 10, operand2: 20, answer: 30 };
      const result = validateAnswer(sum, 25);
      expect(result).toBe(false);
    });

    test('retorna false para respuestas mayores', () => {
      const sum = { operand1: 10, operand2: 20, answer: 30 };
      const result = validateAnswer(sum, 35);
      expect(result).toBe(false);
    });
  });

  describe('estructura de parámetros', () => {
    test('acepta objeto sum con operand1, operand2, answer', () => {
      const sum = { operand1: 7, operand2: 5, answer: 12 };
      expect(() => validateAnswer(sum, 12)).not.toThrow();
    });

    test('función es pura - mismos inputs producen mismos outputs', () => {
      const sum = { operand1: 15, operand2: 25, answer: 40 };
      const result1 = validateAnswer(sum, 40);
      const result2 = validateAnswer(sum, 40);
      expect(result1).toBe(result2);
    });
  });
});
