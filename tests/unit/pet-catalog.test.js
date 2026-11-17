import { PET_CATALOG } from '../../src/core/pet-catalog.js';

describe('PET_CATALOG', () => {
  test('tiene exactamente 5 mascotas', () => {
    expect(PET_CATALOG).toHaveLength(5);
  });

  test('cada mascota tiene la estructura correcta', () => {
    PET_CATALOG.forEach(pet => {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet).toHaveProperty('type');
      expect(pet).toHaveProperty('threshold');
      expect(pet).toHaveProperty('icon');
      expect(pet).toHaveProperty('color');
      expect(typeof pet.id).toBe('string');
      expect(typeof pet.name).toBe('string');
      expect(typeof pet.type).toBe('string');
      expect(typeof pet.threshold).toBe('number');
      expect(typeof pet.icon).toBe('string');
      expect(typeof pet.color).toBe('string');
    });
  });

  test('los umbrales están en orden ascendente', () => {
    const thresholds = PET_CATALOG.map(p => p.threshold);
    for (let i = 1; i < thresholds.length; i++) {
      expect(thresholds[i]).toBeGreaterThan(thresholds[i - 1]);
    }
  });

  test('los umbrales son [10, 25, 40, 60, 100]', () => {
    const thresholds = PET_CATALOG.map(p => p.threshold);
    expect(thresholds).toEqual([10, 25, 40, 60, 100]);
  });

  test('los IDs son correctos', () => {
    const ids = PET_CATALOG.map(p => p.id);
    expect(ids).toEqual(['luna', 'max', 'rocco', 'draco', 'sparkle']);
  });

  test('todas las mascotas tienen ícono no vacío', () => {
    PET_CATALOG.forEach(pet => {
      expect(pet.icon).not.toBe('');
      expect(pet.icon.length).toBeGreaterThan(0);
    });
  });

  test('el catálogo está congelado (inmutable)', () => {
    expect(Object.isFrozen(PET_CATALOG)).toBe(true);
  });

  test('Luna tiene ícono de gatito', () => {
    const luna = PET_CATALOG.find(p => p.id === 'luna');
    expect(luna.icon).toBe('/assets/images/pets/luna.svg');
  });
});
