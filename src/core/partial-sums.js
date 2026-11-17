export function decomposeSum(a, b) {
  const operand1 = {
    original: a,
    tens: Math.floor(a / 10) * 10,
    units: a % 10
  };

  const operand2 = {
    original: b,
    tens: Math.floor(b / 10) * 10,
    units: b % 10
  };

  const tensSum = operand1.tens + operand2.tens;
  const unitsSum = operand1.units + operand2.units;
  const answer = a + b;

  return {
    operand1,
    operand2,
    steps: {
      decompose: [
        `${a} = ${operand1.tens} + ${operand1.units}`,
        `${b} = ${operand2.tens} + ${operand2.units}`
      ],
      addTens: `${operand1.tens} + ${operand2.tens} = ${tensSum}`,
      addUnits: `${operand1.units} + ${operand2.units} = ${unitsSum}`,
      combine: `${tensSum} + ${unitsSum} = ${answer}`
    },
    answer
  };
}
