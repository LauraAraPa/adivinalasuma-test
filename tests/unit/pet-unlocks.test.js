import { jest } from '@jest/globals';
import { getState, setLevel, submitAnswer, nextSum, subscribe } from '../../src/state/game-state.js';

describe('Pet Unlocks', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('desbloquea Luna al alcanzar 10 gemas', async () => {
    jest.resetModules();
    const freshModule = await import('../../src/state/game-state.js');
    freshModule.setLevel(1);

    for (let i = 0; i < 10; i++) {
      const state = freshModule.getState();
      freshModule.submitAnswer(state.currentSum.answer);
    }

    const state = freshModule.getState();
    expect(state.unlockedPets).toContain('luna');
    expect(state.currentPet).not.toBeNull();
    expect(state.currentPet.id).toBe('luna');
  });

  test('desbloquea Max al alcanzar 25 gemas y reemplaza a Luna', async () => {
    jest.resetModules();
    const freshModule = await import('../../src/state/game-state.js');
    freshModule.setLevel(1);

    for (let i = 0; i < 25; i++) {
      const state = freshModule.getState();
      freshModule.submitAnswer(state.currentSum.answer);
    }

    const state = freshModule.getState();
    expect(state.unlockedPets).toContain('luna');
    expect(state.unlockedPets).toContain('max');
    expect(state.currentPet.id).toBe('max');
  });

  test('desbloquea múltiples mascotas si las gemas saltan varios umbrales', async () => {
    jest.resetModules();
    const freshModule = await import('../../src/state/game-state.js');
    freshModule.setLevel(1);

    // Simular salto de 0 a 50 gemas
    for (let i = 0; i < 50; i++) {
      const state = freshModule.getState();
      freshModule.submitAnswer(state.currentSum.answer);
    }

    const state = freshModule.getState();
    expect(state.unlockedPets).toContain('luna');
    expect(state.unlockedPets).toContain('max');
    expect(state.unlockedPets).toContain('rocco');
    expect(state.currentPet.id).toBe('rocco');
  });

  test('no desbloquea mascotas con respuestas incorrectas', async () => {
    jest.resetModules();
    const freshModule = await import('../../src/state/game-state.js');
    freshModule.setLevel(1);

    for (let i = 0; i < 15; i++) {
      const state = freshModule.getState();
      freshModule.submitAnswer(state.currentSum.answer + 999);
    }

    const state = freshModule.getState();
    expect(state.unlockedPets).toHaveLength(0);
    expect(state.currentPet).toBeNull();
  });

  test('currentPet es null cuando no hay mascotas desbloqueadas', () => {
    const state = getState();
    expect(state.currentPet).toBeNull();
  });
});
