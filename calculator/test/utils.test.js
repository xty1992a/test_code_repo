const utils = require('../src/utils');

test('+ is operator', () => {
  expect(utils.isOperator('+')).toBe(true);
});
test('- is operator', () => {
  expect(utils.isOperator('-')).toBe(true);
});
test('* is operator', () => {
  expect(utils.isOperator('*')).toBe(true);
});
test('/ is operator', () => {
  expect(utils.isOperator('/')).toBe(true);
});
test('( is operator', () => {
  expect(utils.isOperator('(')).toBe(true);
});
test(') is operator', () => {
  expect(utils.isOperator(')')).toBe(true);
});
test('1 is not operator', () => {
  expect(utils.isOperator('1')).toBe(false);
});
test('a is not operator', () => {
  expect(utils.isOperator('a')).toBe(false);
});

