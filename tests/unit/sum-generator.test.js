import { generateSum } from '../../src/core/sum-generator.js';

describe('generateSum', () => {
  describe('Nivel 1', () => {
    test('ambos operandos están entre 1 y 9', () => {
      for (let i = 0; i < 100; i++) {
        const sum = generateSum(1);
        expect(sum.operand1).toBeGreaterThanOrEqual(1);
        expect(sum.operand1).toBeLessThanOrEqual(9);
        expect(sum.operand2).toBeGreaterThanOrEqual(1);
        expect(sum.operand2).toBeLessThanOrEqual(9);
      }
    });

    test('answer es la suma correcta de operand1 + operand2', () => {
      const sum = generateSum(1);
      expect(sum.answer).toBe(sum.operand1 + sum.operand2);
    });
  });

  describe('Nivel 2', () => {
    test('operand1 está entre 10 y 99, operand2 entre 1 y 9', () => {
      for (let i = 0; i < 100; i++) {
        const sum = generateSum(2);
        expect(sum.operand1).toBeGreaterThanOrEqual(10);
        expect(sum.operand1).toBeLessThanOrEqual(99);
        expect(sum.operand2).toBeGreaterThanOrEqual(1);
        expect(sum.operand2).toBeLessThanOrEqual(9);
      }
    });

    test('answer es la suma correcta de operand1 + operand2', () => {
      const sum = generateSum(2);
      expect(sum.answer).toBe(sum.operand1 + sum.operand2);
    });
  });

  describe('Nivel 3', () => {
    test('ambos operandos están entre 10 y 99', () => {
      for (let i = 0; i < 100; i++) {
        const sum = generateSum(3);
        expect(sum.operand1).toBeGreaterThanOrEqual(10);
        expect(sum.operand1).toBeLessThanOrEqual(99);
        expect(sum.operand2).toBeGreaterThanOrEqual(10);
        expect(sum.operand2).toBeLessThanOrEqual(99);
      }
    });

    test('answer es la suma correcta de operand1 + operand2', () => {
      const sum = generateSum(3);
      expect(sum.answer).toBe(sum.operand1 + sum.operand2);
    });
  });

  describe('sin repetición inmediata', () => {
    test('genera suma diferente a la anterior en Nivel 1', () => {
      const previousSum = { operand1: 5, operand2: 3, answer: 8 };
      for (let i = 0; i < 50; i++) {
        const newSum = generateSum(1, previousSum);
        const isDifferent =
          newSum.operand1 !== previousSum.operand1 ||
          newSum.operand2 !== previousSum.operand2;
        expect(isDifferent).toBe(true);
      }
    });

    test('genera suma diferente a la anterior en Nivel 2', () => {
      const previousSum = { operand1: 45, operand2: 7, answer: 52 };
      for (let i = 0; i < 50; i++) {
        const newSum = generateSum(2, previousSum);
        const isDifferent =
          newSum.operand1 !== previousSum.operand1 ||
          newSum.operand2 !== previousSum.operand2;
        expect(isDifferent).toBe(true);
      }
    });

    test('genera suma diferente a la anterior en Nivel 3', () => {
      const previousSum = { operand1: 45, operand2: 23, answer: 68 };
      for (let i = 0; i < 50; i++) {
        const newSum = generateSum(3, previousSum);
        const isDifferent =
          newSum.operand1 !== previousSum.operand1 ||
          newSum.operand2 !== previousSum.operand2;
        expect(isDifferent).toBe(true);
      }
    });
  });

  describe('estructura del objeto retornado', () => {
    test('retorna objeto con operand1, operand2, y answer', () => {
      const sum = generateSum(1);
      expect(sum).toHaveProperty('operand1');
      expect(sum).toHaveProperty('operand2');
      expect(sum).toHaveProperty('answer');
      expect(typeof sum.operand1).toBe('number');
      expect(typeof sum.operand2).toBe('number');
      expect(typeof sum.answer).toBe('number');
    });
  });

  describe('variación de resultados', () => {
    test('genera sumas variadas en múltiples llamadas en Nivel 1', () => {
      const sums = new Set();
      for (let i = 0; i < 20; i++) {
        const sum = generateSum(1);
        sums.add(`${sum.operand1}+${sum.operand2}`);
      }
      expect(sums.size).toBeGreaterThan(1);
    });

    test('genera sumas variadas en múltiples llamadas en Nivel 2', () => {
      const sums = new Set();
      for (let i = 0; i < 20; i++) {
        const sum = generateSum(2);
        sums.add(`${sum.operand1}+${sum.operand2}`);
      }
      expect(sums.size).toBeGreaterThan(1);
    });

    test('genera sumas variadas en múltiples llamadas en Nivel 3', () => {
      const sums = new Set();
      for (let i = 0; i < 20; i++) {
        const sum = generateSum(3);
        sums.add(`${sum.operand1}+${sum.operand2}`);
      }
      expect(sums.size).toBeGreaterThan(1);
    });
  });

  describe('validación de nivel inválido', () => {
    test('lanza error con nivel inválido', () => {
      expect(() => generateSum(4)).toThrow();
      expect(() => generateSum(0)).toThrow();
    });
  });
});
