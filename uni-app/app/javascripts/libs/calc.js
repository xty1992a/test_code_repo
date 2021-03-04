var floatObj = (function () {

  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和小数位数。如 3.14 >> 314，小数位数是 2
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, len: 2}
   */
  function toInteger(floatNum) {
    var ret = {len: 0, num: 0}
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    var strfi = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len = strfi.substr(dotPos + 1).length

    var times = Math.pow(10, len)
    var intNum = parseInt(floatNum * times + 0.5, 10)
    ret.len = len
    ret.num = rightMovePoint(floatNum, len)
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除，小数保留位数（add/subtract/multiply/divide/toDecimal）
   *
   */
  function operation(a, b, op) {
    var o1 = toInteger(a)
    var o2 = toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.len
    var t2 = o2.len
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
      case 'add':
        if (t1 === t2) { // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
          result = n1 + rightMovePoint(n2, t1 - t2)
        } else { // o1 小数位 小于 o2
          result = rightMovePoint(n1, t2 - t1) + n2
        }
        return leftMovePoint(result, max)
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - rightMovePoint(n2, t1 - t2)
        } else {
          result = rightMovePoint(n1, t2 - t1) - n2
        }
        return leftMovePoint(result, max)
      case 'multiply':
        result = n1 * n2  // 整数相除，精度问题？
        result = leftMovePoint(result, t1 + t2)
        return result
      case 'divide':
        if (t1 > t2) {
          result = n1 / n2
          result = leftMovePoint(result, t1 - t2)
        } else {
          result = n1 / n2
          result = rightMovePoint(result, t2 - t1)
        }
        // result = (n1 / n2) * (t2 / t1) // 整数相乘，精度问题？ 0.352423*10=3.5242299999999998
        return result
      default:
        return NaN
    }
  }

  /**
   * 小数点左移位
   * @param num 小数
   * @param digits 移动的位数
   * @returns {Number}
   */
  function leftMovePoint(num, digits) {
    let r1 = num + ''
    let n1 = digits - (Math.floor(r1) + '').length + 1
    for (var i = 0; i < n1; i++) {
      r1 = '0' + r1
    }
    let index = r1.indexOf('.')
    let pos
    pos = index === -1 ? r1.length - digits : index - digits;
    r1 = r1.replace(/\./, '')
    let begin, end
    begin = r1.substring(0, pos)
    end = r1.substring(pos)
    r1 = begin + '.' + end
    return parseFloat(r1)
  }

  /**
   * 小数点右移位
   * @param num 小数
   * @param digits 移动的位数
   * @returns {Number}
   */
  function rightMovePoint(num, digits) {
    let r1 = num + ''
    let index = r1.indexOf('.')
    let pos = index === -1 ? r1.length + digits : index + digits;
    let n2 = index === -1 ? 0 : r1.split('.')[1].length
    let n1 = digits - n2
    for (var i = 0; i < n1; i++) {
      r1 = r1 + '0'
    }
    r1 = r1.replace(/\./, '')
    let begin, end
    begin = r1.substring(0, pos)
    end = r1.substring(pos)
    r1 = begin + '.' + end
    return parseFloat(r1)
  }

  // 加减乘除的四个接口
  function add(a, b) {
    return operation(a, b, 'add')
  }

  function subtract(a, b) {
    return operation(a, b, 'subtract')
  }

  function multiply(a, b) {
    return operation(a, b, 'multiply')
  }

  function divide(a, b) {
    return operation(a, b, 'divide')
  }

  /**
   * 取小数位数
   * @param num
   * @param s   位数
   * @param flag 0:四舍五入，1:直接舍去
   * @returns {Number}
   */
  function toDecimal(num, s = 2, flag = 1) {
    let t = num < 0 ? -1 : 1;
    var des = rightMovePoint(num, s)
    if (flag === 0) {
      des = multiply(t, add(Math.abs(des), 0.5))
    }
    des = leftMovePoint(parseInt(des, 10), s)
    return des
  }

  // 求两个数组的差集
  function getDifference(map, target) {
    let a = new Set(map)
    let b = new Set(target)
    return Array.from(new Set([...a].filter(x => !b.has(x))))
  }

  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    toDecimal: toDecimal,
    getDifference
  }
})()


floatObj.toKM = function (num) {
  num = +num
  console.log('in ', num)

  if (num <= 0) {
    return '未知'
  } else if (num < 1000) {
    return Math.round(num) + 'm'
  } else if (num >= 1000 && num < 100000) {
    return this.toDecimal(num / 1000) + 'km'
  } else if (num >= 100000) {
    return Math.round(num / 1000) + 'km'
  }
  return '未知'
}

floatObj.doublePx = function (str) {
  return str
}
export default floatObj
// module.exports = floatObj
