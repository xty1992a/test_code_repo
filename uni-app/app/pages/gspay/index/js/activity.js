require('./math');
// require('../../../../store');
if (!Array.prototype.find) {
  Array.prototype.find = function (fn) {
	for (var i = 0; i < this.length; i++) {
	  var x = this[i];
	  if (fn(x, i, this)) {
		return x;
	  }
	}
  };
}

const copy = o => JSON.parse(JSON.stringify(o));

const cashTacticType = {
  CashNormal: 0,
  CashPerFullSubduction: 1,
  CashRandomSubduction: 2,
  CashRandomSubductionPercent: 4,
  CashSubduction: 3,
  PerLitreDiscount: 6
};

class CashTactic {
  acceptCash(activityGuid, money, totalGas) {
	return 0;
  }

  display() {
	return '原价';
  }
}

//原价策略
class CashNormal extends CashTactic {
  constructor(body) {
	super();
  }

  acceptCash(activityGuid, money, totalGas) {
	return money;
  }

  display() {
	return '原价';
  }
}

//每满减策略
class CashPerFullSubduction extends CashTactic {
  constructor(body) {
	body = body.CashPerFullSubduction;
	super();
	this.fullNumber = body.FullNumber;
	this.subNumber = body.SubNumber;
	this.maxSubNumber = body.MaxSubNumber;
  }

  acceptCash(activityGuid, money, totalGas) {
  let count = Math.floor(Math.divide(money, this.fullNumber));
	var cash = count * this.subNumber;
	if (this.maxSubNumber > 0 && cash > this.maxSubNumber) {
	  return Math.fixed(Math.subtract(money, this.maxSubNumber), 2);
	}
	return Math.fixed(Math.subtract(money, cash), 2);
  }

  display() {
	if (this.maxSubNumber > 0) {
	  return `每满${this.fullNumber}元减${this.subNumber}元,最高可减${this.maxSubNumber}元`;
	}
	else {
	  return `每满${this.fullNumber}元减${this.subNumber}元`;
	}
  }
}

//随机减策略
class CashRandomSubduction extends CashTactic {
  constructor(body) {
	super();
	body = body.CashRandomSubduction;
	this.maxNumberm = body.MaxNumber;
	this.minNumber = body.MinNumber;
	this.fullNumber = body.FullNumber;
  }

  //根据金额产生一个一天内不变的随机值
  genarateRandomValue(activityGuid, money) {
	//TODO:保证相同活动，相同openId，相同金额，一天产生的金额只有一个
	var day = new Date().toISOString().substring(0, 10).replace('-', '').replace('-', '');
	var key = 'radom_' + day + '_' + activityGuid + '_' + money;
	var ran;
	if (localStorage.getItem(key)) {
	  ran = localStorage.getItem(key) * 1;
	}
	else {
	  ran = Math.random();
	  localStorage.setItem(key, ran);
	}
	return Math.fixed(ran, 2);
  }

  acceptCash(activityGuid, money, totalGas) {
	if (money < this.fullNumber) {
	  return money;
	}
	else {
	  let random = this.genarateRandomValue(activityGuid, money);
	  let discountRandom = Math.fixed(Math.mult(random, Math.subtract(this.maxNumberm, this.minNumber)), 2);
	  let discountCash = Math.add(this.minNumber, discountRandom); //优惠金额
	  return Math.fixed(Math.subtract(money, discountCash), 2);
	}
  }

  display() {
	return `满${this.fullNumber}元随机减最高${this.maxNumberm}元`;
  }
}

//区间满减策略
class CashRandomSubductionPercent extends CashTactic {
  constructor(body) {
	super();
	body = body.CashRandomSubductionPercent;
	this.sections = [];
	this.fullNumber = body.FullNumber;
	for (var s of body.Sections.Section) {
	  this.sections.push({
		start: s.Start,
		end: s.End,
		percent: s.Percent,
	  });
	}

  }

  //获取区间的随机值
  generateRandomValue(activityGuid, money) {
	//TODO:保证当天数据唯一性
	var day = new Date().toISOString().substring(0, 10).replace('-', '').replace('-', '');
	var key = 'radom_' + day + '_' + activityGuid + '_' + money;
	var key2 = 'radom_' + day + '_' + activityGuid + '_2_' + money;
	var ran;
	if (localStorage.getItem(key)) {
	  ran = +localStorage.getItem(key);
	}
	else {
	  ran = Math.fixed(Math.random(), 2);
	  localStorage.setItem(key, ran);
	}
	// let ran = Math.random();//产生一个0-1的随机数
	let end = 0;
	let value = 0;
	var sections = this.sections;
	for (var e of sections) {
	  end = Math.add(end, Math.divide(e.percent, 100));
	  if (ran < end) {
		var sectionRandomValue;
		if (localStorage.getItem(key2)) {
		  sectionRandomValue = +localStorage.getItem(key2);
		}
		else {
		  sectionRandomValue = Math.fixed(Math.random(), 2);
		  localStorage.setItem(key2, sectionRandomValue);
		}
		// let sectionRandomValue = Math.random(); //0-1的区间
		let sectionDiscountRandom = Math.mult(sectionRandomValue, Math.subtract(e.end, e.start));
		let sectionDiscountCash = Math.add(e.start, sectionDiscountRandom);
		value = Math.divide(Math.subtract(sectionDiscountCash, sections[0].start),
			Math.subtract(sections[sections.length - 1].end, sections[0].start));
		//换算成相对全部区间的0~1的随机数
		break;
	  }
	}
	return value;
  }

  acceptCash(activityGuid, money, totalGas) {
	if (money < this.fullNumber) {
	  return money;
	}
	var randomValue = this.generateRandomValue(activityGuid, money);
	var discountRandomPart = Math.fixed(Math.mult(randomValue,
		Math.subtract(this.sections[this.sections.length - 1].end, this.sections[0].start)),
		2);
	var discountCash = Math.add(this.sections[0].start, discountRandomPart);//优惠金额
	return Math.fixed(Math.subtract(money, discountCash), 2);
  }

  display() {
	let lastIndex = this.sections.length - 1;
	return `满${this.fullNumber}元随机减${this.sections[0].start}~${this.sections[lastIndex].end}元`;
  }
}

class CashSubduction extends CashTactic {
  constructor(body) {
	super();
	body = body.CashSubduction;
	var leve = body.LevelSections.LevelSection;
	this.levelSections = [];
	if (leve.length === undefined) {
	  this.levelSections.push({
		fullNumber: leve.FullNumber,
		subNumber: leve.SubNumber,
	  });
	}
	else {
	  for (var s of leve) {
		if (s) {
		  this.levelSections.push({
			fullNumber: s.FullNumber,
			subNumber: s.SubNumber,
		  });
		}
	  }
	}
  }

  acceptCash(activityGuid, money, totalGas) {
	var levelSection = this.levelSections.sort(function (a, b) {
	  return b.fullNumber - a.fullNumber;
	}).find(t => t.fullNumber <= money);
	if (!levelSection) {
	  return money;
	}
	var discountCash = levelSection.subNumber;//优惠金额
	return Math.subtract(money, discountCash);
  }

  display() {
	var str = '';
	for (var LevelSection of this.levelSections) {
	  str += `,满${LevelSection.fullNumber}减${LevelSection.subNumber}`;
	}
	return str.length > 0 ? str.substring(1) : str;
  }
}

//满金额每升减
class PerLitreSubduction extends CashTactic {
  constructor(body) {
	super();
	body = body.CashPerLitreDiscount;
	var leve = body.LevelSections.LevelSection;
	this.levelSections = [];
	if (leve.length === undefined) {
	  this.levelSections.push({
		fullNumber: leve.FullNumber,
		subNumber: leve.SubNumber,
	  });
	}
	else {
	  for (var s of leve) {
		if (s) {
		  this.levelSections.push({
			fullNumber: s.FullNumber,
			subNumber: s.SubNumber,
		  });
		}
	  }
	}
  }

  acceptCash(activityGuid, money, totalGas) {
	var levelSectionsCopy = copy(this.levelSections);
	var levelSection = levelSectionsCopy.sort(function (a, b) {
	  return b.fullNumber - a.fullNumber;
	}).find(t => t.fullNumber <= money);
	if (!levelSection) {
	  return money;
	}
	this.selectSection = levelSection;
	var discountCash = Math.changeToDecimal(Math.mult(totalGas, +levelSection.subNumber), 2);//优惠金额
	return discountCash >= money ? 0 : Math.fixed(Math.subtract(money, discountCash), 2);
  }

  display() {
	if (!this.selectSection) {
	  this.selectSection = this.levelSections[0];
	}
	console.log('this.selectSection--', this.selectSection);
	console.log('this.levelSections[0]--', this.levelSections);
	var str = `满${this.selectSection.fullNumber}每升优惠${this.selectSection.subNumber}`;
	return str;
  }

  description() {
	var str = '';
	for (var LevelSection of this.levelSections) {
	  str += `,满${LevelSection.fullNumber}每升优惠${LevelSection.subNumber}`;
	}
	return str.length > 0 ? str.substring(1) : str;
  }
}

export class CashContext {
  constructor(body, type) {
	body = JSON.parse(body);
	switch (type) {
	  case cashTacticType.CashNormal:
		this.cashSuper = new CashNormal(body);
		break;
	  case cashTacticType.CashPerFullSubduction:
		this.cashSuper = new CashPerFullSubduction(body);
		break;
	  case cashTacticType.CashRandomSubduction:
		this.cashSuper = new CashRandomSubduction(body);
		break;
	  case cashTacticType.CashRandomSubductionPercent:
		this.cashSuper = new CashRandomSubductionPercent(body);
		break;
	  case cashTacticType.CashSubduction:
		this.cashSuper = new CashSubduction(body);
		break;
	  case +cashTacticType.PerLitreDiscount:
		this.cashSuper = new PerLitreSubduction(body);
		break;
	  default:
	}
  }

  static create(body, type) {
	return new CashContext(body, type);
  }

  getResult(activityGuid, money, totalGas) {
	return {
	  money: this.cashSuper.acceptCash(activityGuid, money, totalGas),
	  title: this.display()
	};
  }

  display() {
	return this.cashSuper.display();
  }

  description() {
	return this.cashSuper.description();
  }
}
