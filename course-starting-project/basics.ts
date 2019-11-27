function add(n1: number, n2: number, printResult: boolean, phrase): number {
  const result = n1 + n2;
  if (printResult) {
    console.log(phrase + result);
  } else {
    return result;
  }
}

const number1 = 5;
const number2 = 15;
const showResult = true;
const resultPhrase = "Result is: ";

const result = add(number1, number2, showResult, resultPhrase);
