export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isTrue(v) {
  return v === true;
}

export function isFalse(v) {
  return v === false;
}

export function isString(value) {
  return value === value + '';
}

export function isNumber(value) {
  return value === +value;
}

export function isPrimitive(value) {
  return (
	  typeof value === 'string' ||
	  typeof value === 'number' ||
	  typeof value === 'symbol' ||
	  typeof value === 'boolean'
  );
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

const _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

function isPromise(val) {
  return (
	  isDef(val) &&
	  typeof val.then === 'function' &&
	  typeof val.catch === 'function'
  );
}

function deepReactive(target, key, obj, traps) {
  Object.keys(obj);
}
