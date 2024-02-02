/**
 * Utility function to easily add alpha to a HEX color value
 */
export function colorAlpha(p, aColor, alpha) {
  //   const { color, red, green, blue } = p;
  var c = p.color(aColor);
  return p.color(
    "rgba(" + [p.red(c), p.green(c), p.blue(c), alpha].join(",") + ")"
  );
}

// Bell curve distribution function
export function bellCurve(p, x, max) {
  const mean = max / 2; // Set the peak of the bell curve at half of the max
  const standardDeviation = max / 4; // Adjust the standard deviation as needed

  // Gaussian (normal) distribution formula
  const exponent = -0.5 * p.pow((x - mean) / standardDeviation, 2);
  const result = p.exp(exponent) / (standardDeviation * p.sqrt(TWO_PI));

  //   console.log("result ::: ", result);

  // Map the result to the desired alpha range (0 to 1)
  const mappedResult = p.map(result, 0, 0.003, 0, 1); // Adjust the range as needed

  //   console.log("mappedResult ::: ", mappedResult);
  return mappedResult;
}
