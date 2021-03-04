"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.timers");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Rx = _interopRequireWildcard(require("rxjs/Rx"));

var _axios = _interopRequireDefault(require("axios"));

Rx.Observable.fromPromise(_axios["default"].get("https://api.github.com/users/xty1992a")).map(function (res) {
  return res.data;
}).subscribe(function (result) {
  console.log(result);
}, function (err) {
  console.log(err);
});
console.log(Promise.resolve("ok"));
console.log([].includes(0));

var Class = /*#__PURE__*/function () {
  function Class(age) {
    (0, _classCallCheck2["default"])(this, Class);
    (0, _defineProperty2["default"])(this, "name", "test");
    this.age = age;
  }

  (0, _createClass2["default"])(Class, [{
    key: "say",
    value: function say() {
      console.log(this.name, this.age);
    }
  }]);
  return Class;
}();

var sleep = function sleep(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return sleep(1000);

          case 2:
            new Class(10).say();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _main.apply(this, arguments);
}

main();
