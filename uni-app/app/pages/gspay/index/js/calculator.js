require('./math.js');
var { CashContext } = require('./activity.js');
import pointService from './pointService.js';

class Calulator {
  constructor(params) {
    this.money = 0;
    this.params = params;
    this.result = { money: 0 };
  }

  setNext(calc) {
    this.next = calc;
  }

  getDiscount() {
    return this.result.money;
  }

  getResult() {
    return this.result;
  }

  getRemainingMoney() {
    return this.remainingMoney;
  }

  handle(remainingMoney) {
    if (remainingMoney !== undefined) {
      this.remainingMoney = remainingMoney;
    }
    if (!!this.params && this.calc) {
      this.calc(this.result.money);
    }
    if (this.next) {
      var nextMoney = Math.subtract(this.remainingMoney, this.result.money);
      nextMoney = nextMoney > 0 ? nextMoney : 0;
      this.next.handle(nextMoney);
    }
  }
}

// 计算会员折扣
class DiscountCalulator extends Calulator {
  constructor(params, totalGas) {
    super(params);
    this.memberDiscount = this.params.config.discountParameter.memberDiscount * 1;
    this.discountType = this.params.config.discountParameter.discountType * 1;
    this.perLitreDiscount = this.params.config.discountParameter.perLitreDiscount * 1;
    this.checked = params.mutex[0].checked || params.share[0].checked;
    this.totalGas = totalGas;
  }

  calc() {
    console.log('计算会员折扣', this.memberDiscount, this.checked, this.remainingMoney);
    if (this.checked) {
      if (this.discountType === 0 || this.discountType === 3) {//按折扣计算
        var rate = Math.subtract(1, this.memberDiscount);
        this.result.money = Math.fixed(Math.mult(this.remainingMoney, rate), 2);
      }
      else if (this.discountType === 2 || this.discountType === 1) {//按每升优惠金额计算
        this.result.money = Math.fixed(Math.mult(this.totalGas, this.perLitreDiscount), 2);
      }
    }
  }
}

// 优惠活动
class ActivityCalulator extends Calulator {
  constructor(params, totalGas) {
    super(params);
    this.cashContext = CashContext.create(params.config.activity.body, params.config.activity.type);
    this.checked = params.mutex[1].checked || params.share[1].checked;
    this.totalGas = totalGas;
  }

  calc() {
    if (this.checked) {
      var result = this.cashContext.getResult(this.params.config.activity.guid, this.remainingMoney, this.totalGas);
      this.result.money = Math.subtract(this.remainingMoney, result.money);
      this.result.title = result.title;
    }
  }
}

class CouponCalulator extends Calulator {
  constructor(params, ext) {
    super(params);
    this.checked = params.mutex[2].checked || params.share[2].checked;
    this.wxcoupon = ext.wxcoupon;
    this.autoSelect = ext.autoSelect;
    this.parameter = params.config.discountParameter;
  }

  calc() {
    this.wxcoupon.createList();
    if (this.checked) {
      if (this.autoSelect) {
        this.wxcoupon.autoSelect(this.remainingMoney, this.parameter);
        console.log('自动选择。。。。。。。。。。。。。。。。。。。。。。。。。。。。。');
      }
      else {
      }
      var result = this.wxcoupon.getResult(this.parameter);
      console.log('卡券选择结果：' + JSON.stringify(result));
      this.result = result;
    }
    else {
      this.wxcoupon.clear();
      this.wxcoupon.filter(this.remainingMoney);
      this.result.total = this.wxcoupon.getTotalCount();
      this.result.count = 0;
    }
  }
}

class PointCalulator extends Calulator {
  constructor(params, nodiscount) {
    super(params);
    this.checked = params.mutex[3].checked || params.share[3].checked;
    this.availablePoint = params.config.discountParameter.memberAvailablePoint;
    this.pointPerYuan = params.config.discountParameter.pointPerYuan;
    this.maxRate = params.config.discountParameter.paidMoneyMaxRate;
    this.nodiscount = nodiscount;
    this.canPaidPointForMemberPoint = params.config.discountParameter.canPaidPointForMemberPoint;
    this.canPaidPointForConsumeValue = params.config.discountParameter.canPaidPointForConsumeValue;
  }

  //preChainResultMoney,上一个业务计算的结果金额
  calc(preChainResultMoney) {
    let checkMoney = Math.add(this.remainingMoney, preChainResultMoney);
    let checkResult = pointService.checkCanUsePoint(checkMoney, {
      memberAvailablePoint: this.availablePoint,
      canPaidPointForMemberPoint: this.canPaidPointForMemberPoint,
      canPaidPointForConsumeValue: this.canPaidPointForConsumeValue
    });
    this.result.checkResult = checkResult;
    if (this.checked && checkResult.success) {
      var memberAvailableYuan = Math.divide(this.availablePoint, this.pointPerYuan) * 1;
      var consumemoney = Math.add(this.remainingMoney, this.nodiscount);
      var orderMaxYuan = Math.mult(consumemoney, this.maxRate) * 1;
      var consumeyuan = 0;
      var resultyuan = 0;
      if (memberAvailableYuan < orderMaxYuan) {
        resultyuan = Math.floor(memberAvailableYuan * 100) / 100;
        consumeyuan = Math.changeToDecimal(resultyuan, 2) * 1;
      }
      else {
        resultyuan = Math.floor(orderMaxYuan * 100) / 100;
        consumeyuan = Math.changeToDecimal(resultyuan, 2) * 1;
      }
      var consumePoint = Math.changeToDecimal(Math.mult(consumeyuan, this.pointPerYuan), 2) * 1;
      this.result.money = consumeyuan;
      this.result.point = consumePoint;
    }
  }
}

export class CalulatorContext {
  buildCalulatorChain() {
    this.discountCalc = new DiscountCalulator(this.params, this.totalGas);
    this.activityCalc = new ActivityCalulator(this.params, this.totalGas);
    this.pointCalc = new PointCalulator(this.params, this.nodiscount);
    this.couponCalc = new CouponCalulator(this.params, this.ext);

    this.map = {
      0: this.discountCalc,
      1: this.activityCalc,
      2: this.couponCalc,
      3: this.pointCalc,
    };

    this.discountCalc.setNext(this.activityCalc);
    this.activityCalc.setNext(this.couponCalc);
    this.couponCalc.setNext(this.pointCalc);
  }

  calc(price, nodiscount, totalGas, params, ext) {
    this.price = price;
    this.nodiscount = nodiscount;
    this.totalGas = totalGas;
    this.params = params;
    this.ext = ext;
    this.buildCalulatorChain();
    var money = (nodiscount * 1 >= price * 1) ? 0 : Math.subtract(price, nodiscount);
    this.discountCalc.handle(money);
    return {
      discount: this.discountCalc.getResult(),
      activity: this.activityCalc.getResult(),
      point: this.pointCalc.getResult(),
      coupon: this.couponCalc.getResult(),
      payCash: this.getPayCash(),
    };
  }

  getRemainingMoney(i) {
    var temp = Math.subtract(this.price, this.nodiscount);
    while (i >= 0) {
      temp = Math.subtract(temp, this.map[i].result.money);
      i--;
    }
    return temp;
  }

  getPayCash() {
    var i = 0;
    var temp = this.price;
    while (this.map[i]) {
      temp = Math.subtract(temp, this.map[i].result.money);
      i++;
    }
    if (temp < 0) {
      temp = 0;
    }
    return temp;
  }
}
