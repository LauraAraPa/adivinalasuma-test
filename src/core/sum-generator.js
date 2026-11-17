import { LEVEL_RANGES } from '../config.js';

export function generateSum(level, previousSum = null) {
  if (!LEVEL_RANGES[level]) {
    throw new Error(`Invalid level: ${level}. Must be 1, 2 or 3.`);
  }
  const { top, bottom } = LEVEL_RANGES[level];
  let operand1, operand2, sum;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    operand1 = Math.floor(Math.random() * (top[1] - top[0] + 1)) + top[0];
    operand2 = Math.floor(Math.random() * (bottom[1] - bottom[0] + 1)) + bottom[0];
    sum = { operand1, operand2, answer: operand1 + operand2 };
    attempts++;
  } while (
    previousSum &&
    sum.operand1 === previousSum.operand1 &&
    sum.operand2 === previousSum.operand2 &&
    attempts < maxAttempts
  );

  return sum;
}
