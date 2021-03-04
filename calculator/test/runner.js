const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const testList = [
  {expression: '1+2', result: 1 + 2},
  {expression: '1*2', result: 2},
  {expression: '1/2', result: 1 / 2},
  {expression: '1-2', result: 1 - 2},
  {expression: '1+2*3', result: 1 + 2 * 3},
  {expression: '(1+2)*3', result: (1 + 2) * 3},
  {expression: '1+(1+2)*3', result: 1 + (1 + 2) * 3},
  {expression: '1+(1+2)*3+1', result: 1 + (1 + 2) * 3 + 1},
  {expression: '1+(1+2)*3+1', result: 1 + (1 + 2) * 3 + 1},
  {expression: '1+(1+2)*(3+1)', result: 1 + (1 + 2) * (3 + 1)},
];

let content = `
const Calculator = require('../src/core');\n
const calculator = new Calculator();\n
`;

testList.forEach(item => {
  content +=
	  `test("compute ${item.expression} should get ${item.result}", () => {\n  expect(calculator.compute("${item.expression}")).toBe(${item.result});\n});\n\n`;
});

fs.writeFileSync(path.resolve(__dirname, 'core.test.js'), content);
const result = shell.exec('npm test');
shell.echo(result.code !== 0 ? 'test fail' : 'test success');
shell.rm('-rf', './test/core.test.js');
shell.exit(0);

