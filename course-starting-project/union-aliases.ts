enum Conversion {
  AS_NUMBER = "as-number",
  AS_STRING = "as-string"
}

type Combinable = string | number;

function combine(
  input1: Combinable,
  input2: Combinable,
  conversionType: Conversion
) {
  let result;

  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    conversionType === Conversion.AS_NUMBER
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }

  return result;
}

const combinedAges = combine(24, 30, Conversion.AS_NUMBER);
console.log(combinedAges);

const combinedStringAges = combine("24", "40", Conversion.AS_NUMBER);
console.log(combinedStringAges);

const combinedNames = combine("Max", "Anna", Conversion.AS_STRING);
console.log(combinedNames);
