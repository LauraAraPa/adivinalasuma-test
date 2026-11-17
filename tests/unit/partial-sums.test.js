import { decomposeSum } from '../../src/core/partial-sums.js';

describe('decomposeSum', () => {
  describe('suma 2 cifras + 1 cifra', () => {
    test('decompone 24 + 7 correctamente', () => {
      const result = decomposeSum(24, 7);

      expect(result.operand1).toEqual({ original: 24, tens: 20, units: 4 });
      expect(result.operand2).toEqual({ original: 7, tens: 0, units: 7 });
      expect(result.steps.addTens).toBe('20 + 0 = 20');
      expect(result.steps.addUnits).toBe('4 + 7 = 11');
      expect(result.steps.combine).toBe('20 + 11 = 31');
      expect(result.answer).toBe(31);
    });
  });

  describe('suma 2 cifras + 2 cifras', () => {
    test('decompone 24 + 37 correctamente', () => {
      const result = decomposeSum(24, 37);

      expect(result.operand1).toEqual({ original: 24, tens: 20, units: 4 });
      expect(result.operand2).toEqual({ original: 37, tens: 30, units: 7 });
      expect(result.steps.addTens).toBe('20 + 30 = 50');
      expect(result.steps.addUnits).toBe('4 + 7 = 11');
      expect(result.steps.combine).toBe('50 + 11 = 61');
      expect(result.answer).toBe(61);
    });
  });

  describe('suma 1 cifra + 1 cifra', () => {
    test('decompone 7 + 5 correctamente', () => {
      const result = decomposeSum(7, 5);

      expect(result.operand1).toEqual({ original: 7, tens: 0, units: 7 });
      expect(result.operand2).toEqual({ original: 5, tens: 0, units: 5 });
      expect(result.steps.addTens).toBe('0 + 0 = 0');
      expect(result.steps.addUnits).toBe('7 + 5 = 12');
      expect(result.steps.combine).toBe('0 + 12 = 12');
      expect(result.answer).toBe(12);
    });
  });

  describe('suma con carry', () => {
    test('decompone 35 + 8 con carry en unidades', () => {
      const result = decomposeSum(35, 8);

      expect(result.operand1).toEqual({ original: 35, tens: 30, units: 5 });
      expect(result.operand2).toEqual({ original: 8, tens: 0, units: 8 });
      expect(result.steps.addUnits).toBe('5 + 8 = 13');
      expect(result.steps.combine).toBe('30 + 13 = 43');
      expect(result.answer).toBe(43);
    });
  });

  describe('función pura', () => {
    test('mismos inputs producen mismos outputs', () => {
      const result1 = decomposeSum(24, 7);
      const result2 = decomposeSum(24, 7);

      expect(result1).toEqual(result2);
    });

    test('no modifica los argumentos originales', () => {
      const a = 24;
      const b = 7;
      decomposeSum(a, b);

      expect(a).toBe(24);
      expect(b).toBe(7);
    });
  });
});
