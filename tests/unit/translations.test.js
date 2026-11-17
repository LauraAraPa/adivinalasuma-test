import { getNextPetInfo, getRandomMessage, PET_MESSAGES } from '../../src/i18n/translations.js';

describe('translations.js', () => {
  
  describe('getNextPetInfo', () => {
    
    test('retorna la siguiente mascota cuando no hay gemas', () => {
      const currentGems = 0;
      const unlockedPets = [];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toEqual({
        name: 'Luna 🐱',
        threshold: 10,
        remaining: 10
      });
    });

    test('retorna la siguiente mascota cuando hay algunas gemas', () => {
      const currentGems = 5;
      const unlockedPets = [];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toEqual({
        name: 'Luna 🐱',
        threshold: 10,
        remaining: 5
      });
    });

    test('retorna la siguiente mascota después de desbloquear Luna', () => {
      const currentGems = 15;
      const unlockedPets = ['luna'];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toEqual({
        name: 'Max 🐶',
        threshold: 25,
        remaining: 10
      });
    });

    test('retorna null cuando todas las mascotas están desbloqueadas', () => {
      const currentGems = 100;
      const unlockedPets = ['luna', 'max', 'rocco', 'draco', 'sparkle'];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toBeNull();
    });

    test('retorna null cuando las gemas superan el umbral máximo', () => {
      const currentGems = 150;
      const unlockedPets = ['luna', 'max', 'rocco', 'draco', 'sparkle'];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toBeNull();
    });

    test('salta mascotas ya desbloqueadas', () => {
      const currentGems = 20;
      const unlockedPets = ['luna', 'max'];
      
      const result = getNextPetInfo(currentGems, unlockedPets);
      
      expect(result).toEqual({
        name: 'Rocco 🦊',
        threshold: 40,
        remaining: 20
      });
    });
  });

  describe('getRandomMessage', () => {
    
    test('retorna un mensaje de éxito en español', () => {
      const messages = PET_MESSAGES.es.success;
      const message = getRandomMessage('success');
      
      // La función usa el idioma actual (es por defecto)
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
      expect(messages).toContain(message);
    });

    test('retorna un mensaje de error en español', () => {
      const messages = PET_MESSAGES.es.error;
      const message = getRandomMessage('error');
      
      expect(message).toBeTruthy();
      expect(messages).toContain(message);
    });

    test('retorna un mensaje de progreso con variables reemplazadas', () => {
      const context = {
        gems: 5,
        remaining: 5,
        nextPet: 'Luna 🐱'
      };
      
      const message = getRandomMessage('progress', context);
      
      expect(message).toBeTruthy();
      expect(message).toContain('5');
      expect(message).toContain('Luna 🐱');
    });

    test('retorna string vacío para tipo inexistente', () => {
      const message = getRandomMessage('tipo_que_no_existe');
      
      expect(message).toBe('');
    });

    test('retorna mensaje de unlock', () => {
      const messages = PET_MESSAGES.es.unlock;
      const message = getRandomMessage('unlock', {});
      
      expect(typeof message).toBe('string');
      expect(messages).toContain(message);
    });
  });
});
