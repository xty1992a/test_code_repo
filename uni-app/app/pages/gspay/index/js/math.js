/**
 * floatTool 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */
var floatTool = function () {
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
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
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

    // toFixed 修复
    function toFixed(num, s) {
        var times = Math.pow(10, s)
        var des = Math.add(Math.mult(num, times), 0.5);
        des = parseInt(des, 10) / times
        return des + ''
    }

    function changeToDecimal(x, length) {
        var flag = 1;
        if (isNaN(parseFloat(x))) {
            return false;
        }
        length = parseInt(length);
        if (isNaN(length)) {
            length = 2;
        }
        if (length <= 0) {
            length = 0;
        }
        var m = Math.pow(10, length);
        var f_x;
        var xArr = x.toString().split('.');
        if (xArr.length > 1 && xArr[1].length > length) {
            switch (flag) {
                case 0:
                    f_x = Math.round(x * m) / m;
                    break;
                case 1:
                    f_x = Math.floor(x * m) / m;
                    break;
                case 2:
                    f_x = Math.ceil(x * m) / m;
                    break;
                default:
                    f_x = Math.round(x * m) / m;
                    break;
            }
        } else {
            f_x = x;
        }
        var s_x = f_x.toString();
        if (length == 0) {
            return s_x;
        }
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + length) {
            s_x += '0';
        }
        return toFixed(s_x, length);
    }

    //创建日期（）
    function parseDate(str) {
        if (typeof str == 'string') {
            var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
            if (results && results.length > 3) {
                return new Date(parseInt(results[1], 10), (parseInt(results[2], 10) - 1), parseInt(results[3], 10));
            }
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
            if (results && results.length > 6)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10));
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
            if (results && results.length > 7)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10), parseInt(results[7], 10));
        }
        return null;
    }

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    // exports
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        fixed: toFixed,
        changeToDecimal: changeToDecimal,
        parseDate: parseDate,
    }
}();

Math.add = floatTool.add;// +
Math.subtract = floatTool.subtract;// -
Math.mult = floatTool.multiply;// *
Math.divide = floatTool.divide;//  /
Math.fixed = floatTool.fixed;//保留两位小数
Math.changeToDecimal = floatTool.changeToDecimal;
Math.parseDate = floatTool.parseDate;