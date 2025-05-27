/* eslint-disable prettier/prettier */

export function calcular_porcentage(dataArray, total): { defecto: string, porcentage: number }[] {

  const rawPorcentages = dataArray.map(item => {
    const totalDefecto = item.encerado + item.lavado;
    return {
      defecto: item.defecto,
      porcentage: totalDefecto / total
    };
  });

  let sumOfRounded = 0;
  const roundedPorcentages = rawPorcentages.map(p => {
    const roundedValue = parseFloat(p.porcentage.toFixed(4));
    sumOfRounded += roundedValue;
    return {
      defecto: p.defecto,
      porcentage: roundedValue
    };
  });

  const difference = parseFloat((1 - sumOfRounded).toFixed(4));
  if (roundedPorcentages.length > 0) {
    const lastIndex = roundedPorcentages.length - 1;
    const lastValue = roundedPorcentages[lastIndex].porcentage + difference;
    // Redondeamos nuevamente, para evitar decimales extra
    roundedPorcentages[lastIndex].porcentage = parseFloat(lastValue.toFixed(4));
  }

  return roundedPorcentages
}

