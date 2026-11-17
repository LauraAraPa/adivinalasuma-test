import { jest } from '@jest/globals';
import { getState, setLevel, submitAnswer, nextSum, subscribe, resetGameState } from '../../src/state/game-state.js';

describe('game-state', () => {
  beforeEach(() => {
    resetGameState();
  });

  describe('setLevel', () => {
    test('establece el nivel y genera una suma inicial', () => {
      setLevel(1);
      const state = getState();
      expect(state.currentLevel).toBe(1);
      expect(state.currentSum).not.toBeNull();
      expect(state.currentSum.operand1).toBeGreaterThanOrEqual(1);
      expect(state.currentSum.operand1).toBeLessThanOrEqual(9);
    });

    test('genera suma con operandos en rango correcto para Nivel 2', () => {
      setLevel(2);
      const state = getState();
      expect(state.currentLevel).toBe(2);
      expect(state.currentSum.operand1).toBeGreaterThanOrEqual(10);
      expect(state.currentSum.operand1).toBeLessThanOrEqual(99);
    });

    test('notifica a los subscribers cuando cambia el nivel', () => {
      const callback = jest.fn();
      subscribe(callback);
      setLevel(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        currentLevel: 1,
        currentSum: expect.any(Object)
      }));
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      setLevel(1);
    });

    test('respuesta correcta incrementa gemas y dispara evento success', () => {
      const state = getState();
      const correctAnswer = state.currentSum.answer;
      const initialGems = state.gems;
      const initialHits = state.hits;
      
      const result = submitAnswer(correctAnswer);
      
      expect(result).toBe(true);
      const newState = getState();
      expect(newState.gems).toBe(initialGems + 1);
      expect(newState.hits).toBe(initialHits + 1);
      expect(newState.lastEvent).toBe('success');
    });

    test('respuesta incorrecta incrementa errores y no cambia gemas ni hits', () => {
      const state = getState();
      const wrongAnswer = state.currentSum.answer + 999;
      const initialGems = state.gems;
      const initialHits = state.hits;
      const initialErrors = state.errors;
      
      const result = submitAnswer(wrongAnswer);
      
      expect(result).toBe(false);
      const newState = getState();
      expect(newState.gems).toBe(initialGems);
      expect(newState.hits).toBe(initialHits);
      expect(newState.errors).toBe(initialErrors + 1);
      expect(newState.lastEvent).toBe('error');
    });

    test('lanza error si no se ha inicializado el juego', async () => {
      jest.resetModules();
      const freshModule = await import('../../src/state/game-state.js');
      expect(() => freshModule.submitAnswer(5)).toThrow('Game not initialized');
    });

    test('notifica a los subscribers cuando se envía respuesta', () => {
      const callback = jest.fn();
      subscribe(callback);
      const state = getState();
      submitAnswer(state.currentSum.answer);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        lastEvent: 'success'
      }));
    });
  });

  describe('nextSum', () => {
    beforeEach(() => {
      setLevel(1);
    });

    test('genera nueva suma y resetea lastEvent', () => {
      const state = getState();
      const firstSum = state.currentSum;
      submitAnswer(firstSum.answer);
      
      expect(getState().lastEvent).toBe('success');
      
      nextSum();
      const newState = getState();
      expect(newState.lastEvent).toBeNull();
      expect(newState.currentSum).not.toEqual(firstSum);
    });

    test('lanza error si no se ha establecido nivel', async () => {
      jest.resetModules();
      const freshModule = await import('../../src/state/game-state.js');
      expect(() => freshModule.nextSum()).toThrow('Level not set');
    });

    test('evita repetición inmediata de suma', () => {
      const state = getState();
      const currentSum = state.currentSum;
      
      nextSum();
      const newState = getState();
      
      const isDifferent = 
        newState.currentSum.operand1 !== currentSum.operand1 ||
        newState.currentSum.operand2 !== currentSum.operand2;
      expect(isDifferent).toBe(true);
    });

    test('notifica a los subscribers cuando avanza a siguiente suma', () => {
      const callback = jest.fn();
      subscribe(callback);
      nextSum();
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        lastEvent: null
      }));
    });
  });

  describe('subscribe', () => {
    test('múltiples subscribers son notificados', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      subscribe(callback1);
      subscribe(callback2);
      
      setLevel(1);
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    test('getState retorna copia del estado', () => {
      setLevel(1);
      const state1 = getState();
      const state2 = getState();
      
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });

  describe('timeout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('timeout incrementa errores y dispara evento timeout', () => {
      setLevel(1);
      const initialErrors = getState().errors;
      
      // Avanzar el timer hasta 0 (15 segundos en Nivel 1)
      jest.advanceTimersByTime(15000);
      
      const state = getState();
      expect(state.errors).toBe(initialErrors + 1);
      expect(state.lastEvent).toBe('timeout');
    });

    test('timeout no incrementa gemas ni hits', () => {
      setLevel(1);
      const initialGems = getState().gems;
      const initialHits = getState().hits;
      
      jest.advanceTimersByTime(15000);
      
      const state = getState();
      expect(state.gems).toBe(initialGems);
      expect(state.hits).toBe(initialHits);
    });
  });
});
