Number.prototype.operatorAdd = function (b) {
  return parseFloat(this + b).toFixed(2);
};
Number.prototype.operatorSub = function (b) {
  return parseFloat(this - b).toFixed(2);
};
Number.prototype.operatorMul = function (b) {
  return parseFloat(this * b).toFixed(2);
};
Number.prototype.operatorDiv = function (b) {
  return parseFloat(this / b).toFixed(2);
};

