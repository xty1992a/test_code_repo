const utils = require('./utils');

class Calculator {
  restore() {
	this.result = [];
	this.operators = [];
  }

  // 将表达式拆解为token
  splitTokens(expression) {
	const symbol = ['(', ')', '+', '-', '*', '/'];
	const re = /\d|\./;
	const tokens = [];
	const chars = expression.trim().replace(/\s/g, '').split('');
	let token = '';
	chars.forEach(c => {
	  if (re.test(c)) {
		token += c;
	  }
	  /*	  else if (c === ' ' && token) {
			  tokens.push(token);
			  token = '';
			}*/
	  else if (symbol.includes(c)) {
		if (token) {
		  tokens.push(token);
		  token = '';
		}
		tokens.push(c);
	  }
	});

	if (token) {
	  tokens.push(token);
	}
	return tokens;
  }

  // 将操作符压入操作符栈
  pushOperator(token) {
	if (/[\-\+\*\/]/.test(token)) {
	  // 比较当前的操作符与操作符栈顶的操作符优先级
	  // 优先级小于等于栈顶操作符,将栈顶元素弹出加入输出
	  while (utils.priority(token, this.operators[this.operators.length - 1]) && this.operators.length > 0) {
		this.result.push(this.operators.pop());
	  }
	  this.operators.push(token);
	}
	else if (token === '(') {
	  this.operators.push(token);
	}
	else if (token === ')') {
	  let top = this.operators.pop();
	  while (top !== '(' && this.operators.length > 0) {
		this.result.push(top);
		top = this.operators.pop();
	  }
	  // 右括号没有匹配到左括号
	  if (top !== '(') {
		throw "error: unmatched ()";
	  }
	}
  }

  expressionToRPN(expression) {
	const tokens = this.splitTokens(expression);

	while (tokens.length) {
	  const token = tokens.shift();
	  if (/^\d*\.?\d*$/.test(token)) {
		this.result.push(token);
	  }
	  else if (utils.isOperator(token)) {
		this.pushOperator(token);
	  }
	  else {
		throw new Error(`unexpect token ${token}`);
	  }
	}

	// tokens用尽,还有操作符
	if (this.operators.length > 0) {
	  // 如果栈顶的操作符为括号，则说明原表达式有不匹配的括号
	  if (this.operators[this.operators.length - 1] === ')' || this.operators[this.operators.length - 1] === '(') {
		throw "error: unmatched ()";
	  }
	  while (this.operators.length) {
		this.result.push(this.operators.pop());
	  }
	}

	return this.result;
  }

  compute(expression) {
	this.restore();
	this.expressionToRPN(expression);
	console.log(this.result);
	// return (new Function(`return ${expression}`))();
  }
}

module.exports = Calculator;

const clac = new Calculator();
clac.compute('(1+ 2) * 4.5');
