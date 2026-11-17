# Adivina la Suma

App web de cálculo mental para niños de 9-11 años.

## Instalación

```bash
npm install
```

## Ejecución local

Opción 1 - Python:
```bash
python3 -m http.server 8000
```

Opción 2 - npx:
```bash
npx serve
```

Luego abre http://localhost:8000 en tu navegador.

## Pruebas

Pruebas unitarias (Jest):
```bash
npm run test:unit
```

**Total de pruebas:** 67 tests en 7 archivos

| Archivo | Pruebas |
|---------|---------|
| `game-state.test.js` | 15 |
| `partial-sums.test.js` | 6 |
| `pet-catalog.test.js` | 8 |
| `pet-unlocks.test.js` | 5 |
| `sum-generator.test.js` | 14 |
| `translations.test.js` | 11 |
| `validator.test.js` | 8 |

**Nota:** Todas las pruebas deben pasar (67/67). Si alguna falla, indica un bug en el código.

Pruebas E2E (Playwright):
```bash
npm run test:e2e
```

## Estructura del proyecto

```
/src
  /core      - Lógica pura (generación de sumas, validación)
  /state     - Estado global con patrón pub/sub
  /ui        - Manipulación DOM
  /i18n      - Traducciones
/styles      - Estilos CSS
/assets      - Sonidos e imágenes
/tests
  /unit      - Pruebas unitarias Jest
  /e2e       - Pruebas E2E Playwright
```
