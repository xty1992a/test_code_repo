const isOperator = symbol => /[\-\+\*\/\(\)]/.test(symbol);

const getPriority = (value) => {
  switch (value) {
	case '+':
	case '-':
	  return 1;
	case '*':
	case '/':
	  return 2;
	default:
	  return 0;
  }
};
const priority = (source, target) => getPriority(source) <= getPriority(target);
module.exports = {
  isOperator,
  priority,
  getPriority
};
