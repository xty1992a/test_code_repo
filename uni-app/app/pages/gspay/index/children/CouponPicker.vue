<template>
  <!--<transition name="side">-->
  <Action @cancel="close" v-show="show" position="bottom">
    <div class="coupon-action" slot="bottom">
      <header class="coupon-head action-head">
        <div class="menu-item" :class="{active:menuIndex===0}" @click="checkMenu(0)">代金券</div>
        <div class="menu-item" :class="{active:menuIndex===1}" @click="checkMenu(1)">折扣券</div>
      </header>
      <section class="coupon-content">
        <p class="tips">代金券与折扣券不能同时享用
          <button class="auto-pick" @click="autoPick">
            使用推荐优惠
          </button>
        </p>
        <transition-group :name="transitionName">
          <coupon-list :list="list[0]"
                       :show="menuIndex===0"
                       v-show="menuIndex===0"
                       key="checkbox"
                       type="checkbox"
                       @change="djqChange"></coupon-list>
          <coupon-list :list="list[1]"
                       :show="menuIndex===1"
                       v-show="menuIndex===1"
                       key="radio"
                       type="radio"
                       @change="zkqChange"></coupon-list>
        </transition-group>
      </section>
      <footer class="coupon-foot">
        <p class="text">选择 <span class="price">{{selectCount}}</span>张 {{menuIndex === 0 ? '代金券' : '折扣券'}}，最高可抵扣 <span class="price">{{selectDiscount}}</span></p>
        <button @click="confirm">确定</button>
      </footer>
    </div>
  </Action>
  <!--</transition>-->
</template>

<script>
  import Action from '../../../../components/action';
  import CouponList from "./coupon-list.vue";
  import {getCoupons} from "../../../../javascripts/api/gs-api";
  import {mapState} from 'vuex';

  const copy = o => JSON.parse(JSON.stringify(o));

  require("../js/math");
  Array.findAll = (arr, callback) => {
	var result = [];
	arr.forEach(e => {
	  if (callback(e)) {
		result.push(e);
	  }
	});
	return result;
  };
  export default {
	name: "coupon-picker",
	props: {
	  value: {
		type: String
	  },
	  allowMuti: {
		type: Boolean,
		default: false
	  },
	  discountParameter: {
		type: Object,
		default: {}
	  },
	  show: Boolean
	},
	components: {CouponList, Action},
	data() {
	  return {
		menuIndex: 0,
		transitionName: "left",
		djqSelect: [],
		zkqSelect: [],
		money: 0,
		list: [[], []]
	  };
	},
	created() {
	},
	methods: {
	  checkMenu(index) {
		this.menuIndex = index;
		this.list[0].forEach(it => {
		  it.count = 0;
		  it.disabled = it.enableCount <= 0;
		  it.isCheck = false;
		});

		this.list[1].forEach(it => {
		  it.count = 0;
		  it.disabled = it.enableCount <= 0;
		  it.isCheck = false;
		});
	  },
	  close() {
		this.$emit("update:show", false);

	  },
	  confirm() {
		this.close();
		this.$emit("confirm");
	  },
	  check(id) {
		this.$emit("input", id);
	  },
	  zkqChange(item) {
		this.list[1].forEach(item => {
		  item.isCheck = false;
		});
		let index = this.list[1].findIndex(it => it.couponSendGuid === item.couponSendGuid);
		this.list[1].splice(index, 1, item);
	  },
	  djqChange(item) {
		let index = this.list[0].findIndex(it => it.couponSendGuid === item.couponSendGuid);
		this.list[0].splice(index, 1, item);
		this.updateDjqListStatus();
	  },
	  autoSelect(money, parameter) {
		this.list = copy(this.couponList);
		this.reset();
		this.filter(money);
		let curList = this.list[0].filter(item => item.enabled && !item.disabled);
		let cashone = curList[0];
		console.log('cashone', cashone);
		console.log('自动勾选，金额卡券选择结果过滤', money);
		//勾选代金券
		let cashoneMoney = 0;
		if (cashone) {
		  this.djqSelect = copy(curList);
		  this.autoSelectByDjq(this.djqSelect);
		  cashoneMoney = this.getOptimalDiscount(parameter, this.djqSelect);
		}
		//选择折扣券
		let disone = this.list[1].find(d => d.enabled);
		console.log('disone', disone);
		let disoneMoney = 0;
		if (disone) {
		  this.zkqSelect = copy(this.list[1]);
		  this.autoSelectByZkq(this.zkqSelect);
		  disoneMoney = this.getOptimalDiscount(parameter, this.zkqSelect);
		}
		//比较两者谁折扣的金额大,选择大的
		if ((+cashoneMoney >= +disoneMoney) && cashone) {
		  // this.list[0].splice(0, 1, this.djqSelect[0]);
		  this.autoSelectByDjq(curList);
		  this.menuIndex = 0;
		}
		if ((+cashoneMoney < +disoneMoney) && disone) {
		  // this.list[1].splice(1, 1, this.zkqSelect[0]);
		  this.autoSelectByZkq(this.list[1]);
		  this.menuIndex = 1;
		}
	  },
	  autoPick() {
		this.list = copy(this.couponList);
		this.reset();
		this.filter(this.money);
		if (this.menuIndex === 0) {
		  let curList = this.list[0].filter(item => item.enabled && !item.disabled);
		  this.autoSelectByDjq(curList);
		}
		else {
		  this.autoSelectByZkq(this.list[1]);
		}
	  },
	  autoSelectByDjq(curList) {
		this.menuIndex = 0;
		if (this.allowMuti) {
		  let orderMaxYuan = Math.mult(
			  this.money,
			  this.discountParameter.couponConsumeMaxRate
		  );
		  let curDiscount = 0;
		  let minValueSum = 0;
		  for (let i = 0; i < curList.length; i++) {
			let item = curList[i];
			let enableDiscountMoney = Math.subtract(orderMaxYuan, curDiscount);
			let enableMinValue = Math.subtract(this.money, minValueSum);
			if (enableMinValue < 0) {
			  enableMinValue = 0;
			}
			if (enableDiscountMoney === 0) {
			  break;
			}
			let minConsumeValueCount = 0;

			if (item.minConsumeValue === 0) {
			  minConsumeValueCount = item.number;
			}
			else {
			  minConsumeValueCount = Math.floor(enableMinValue / item.minConsumeValue);
			  if (minConsumeValueCount > item.number) {
				minConsumeValueCount = item.number;
			  }
			}
			let moneyMaxCount = Math.ceil(enableDiscountMoney / item.couponValue);
			let enableCount = Math.min(minConsumeValueCount, moneyMaxCount);
			minValueSum = Math.add(minValueSum, Math.mult(enableCount, item.minConsumeValue));
			curDiscount = Math.add(curDiscount, Math.mult(enableCount, item.couponValue));
			if (curDiscount > orderMaxYuan) {
			  curDiscount = orderMaxYuan;
			}
			if (enableCount > 0) {
			  item.isCheck = true;
			  item.count = enableCount;
			  console.log('item', item, minValueSum, minConsumeValueCount, moneyMaxCount, enableDiscountMoney, orderMaxYuan);
			}
		  }
		}
		else {
		  curList.forEach(item => {
			item.disabled = true;
		  });
		  curList[0].isCheck = true;
		  curList[0].count = 1;
		  curList[0].disabled = false;
		}
	  },
	  autoSelectByZkq(list) {
		let disone = list.find(d => d.enabled);
		this.menuIndex = 1;
		if (disone) {
		  disone.isCheck = true;
		  disone.count = 1;
		}
	  },
	  getResult(parameter) {
		let selectedCoupons = this.getSelectedCoupons();
		let curList = this.list[this.menuIndex] || [];
		let count = curList.filter(e => e.enabled && e.isCheck).reduce((total, item) => {
		  return item.count + total;
		}, 0);
		return {
		  money: this.getDiscount(parameter),
		  count: count,
		  coupons: selectedCoupons,
		  total: this.getTotalCount()
		};
	  },
	  async loadCoupons(storeId, guid) {
		return;
		let result = await getCoupons(storeId, guid);
		// by yaol
		// if (result.success) {
		if (result.success && result.data.coupons) {
		  let rl = [];
		  for (let i = 0; i < result.data.coupons.length; i++) {
			let item = result.data.coupons[i];
			rl.push({...item, count: 0, enableCount: item.number, isCheck: false, enabled: true});
		  }
		  this.list = [
			Array.findAll(rl, e => e.couponType === 2),
			Array.findAll(rl, e => e.couponType === 3)
		  ];
		}
	  },
	  clear() {
		this.list[0].forEach(e => {
		  e.disabled = false;
		});
		this.list[1].forEach(e => {
		  e.disabled = false;
		});
		this.checkedCoupon = [];
	  },
	  reset() {

		this.list[0].forEach(item => {
		  item.isCheck = false;
		  item.disabled = false;
		  item.count = 0;
		});
		this.list[1].forEach(item => {
		  item.isCheck = false;
		  item.disabled = false;
		  item.count = 0;
		});
	  },
	  filter(money) {
		this.money = money;
		this.list[0].forEach(e => {
		  e.enabled = !e.minConsumeValue || (e.minConsumeValue <= this.money);
		});
		this.list[1].forEach(e => {
		  e.enabled = !e.minConsumeValue || (e.minConsumeValue <= this.money);
		});
	  },
	  showCoupon(money) {
		//this.show = true;
		this.money = money;
		this.reset();
		this.filter(money);
	  },
	  clearSelect() {
		this.djqSelect = [];
		this.zkqSelect = [];
	  },
	  getDiscount(parameter) {
		let curList = this.list[this.menuIndex] || [];
		let checkedCoupons = curList.filter(it => it.isCheck);
		if (!checkedCoupons.length) {
		  return 0;
		}
		let discount = 0;
		if (this.menuIndex === 0) {
		  let orderMaxYuan = Math.mult(
			  this.money,
			  parameter.couponConsumeMaxRate
		  );
		  checkedCoupons.forEach(item => {
			console.log('item1111', item);
			discount += Math.mult(item.couponValue, item.count);
		  });
		  if (discount > orderMaxYuan) {
			discount = orderMaxYuan;
		  }
		  discount = Math.changeToDecimal(discount, 2);
		}
		else if (this.menuIndex === 1) {
		  let item = checkedCoupons[0];
		  let rate = Math.subtract(1, item.couponValue);
		  console.log('rate....', rate, this.money);
		  discount = Math.changeToDecimal(Math.mult(rate, this.money), 2);
		}
		return discount;
	  },
	  getOptimalDiscount(parameter, curList) {
		let checkedCoupons = curList.filter(it => it.isCheck);
		if (!checkedCoupons.length) {
		  return 0;
		}
		let discount = 0;
		if (this.menuIndex === 0) {
		  let orderMaxYuan = Math.mult(
			  this.money,
			  parameter.couponConsumeMaxRate
		  );
		  checkedCoupons.forEach(item => {
			console.log('item1111', item);
			discount += Math.mult(item.couponValue, item.count);
		  });
		  if (discount > orderMaxYuan) {
			discount = orderMaxYuan;
		  }
		  discount = Math.changeToDecimal(discount, 2);
		}
		else if (this.menuIndex === 1) {
		  let item = checkedCoupons[0];
		  let rate = Math.subtract(1, item.couponValue);
		  console.log('rate....', rate, this.money);
		  discount = Math.changeToDecimal(Math.mult(rate, this.money), 2);
		}
		return discount;
	  },
	  getSelectedCoupons() {
		let curList = this.list[this.menuIndex];
		let checkedCoupons = curList.filter(it => it.isCheck);
		if (!checkedCoupons.length) {
		  return "";
		}
		return JSON.stringify(checkedCoupons.map(it => ({
		  couponSendNoteGuid: it.couponSendGuid,
		  number: it.count
		})));
	  },
	  getTotalCount() {
		let total = 0;
		this.list[0].filter(x => x.enabled).forEach(item => {
		  total += item.number;
		});
		this.list[1].filter(x => x.enabled).forEach(item => {
		  total += item.number;
		});
		return total;
	  },
	  updateDjqListStatus() {
		let list = this.list[0];
		let checkedCoupons = list.filter(x => x.isCheck);
		if (!checkedCoupons.length) {
		  list.forEach(it => it.disabled = false);
		}
		if (!this.allowMuti) {//只允许一张
		  let isChecked = checkedCoupons.length === 1;
		  list.forEach(it => {
			it.disabled = isChecked;
			it.enableCount = 1;
		  });
		  if (isChecked) {
			checkedCoupons[0].disabled = false;
		  }
		  return;
		}
		let currentMoney = Math.subtract(this.money, this.getCheckedMinValueSum(checkedCoupons));
		console.log('currentMoney', currentMoney);
		if (currentMoney < 0) {
		  currentMoney = 0;
		}
		list.forEach(it => {
		  let enableCount = 0;
		  if (!it.minConsumeValue) {
			enableCount = it.number - it.count;
		  }
		  else {
			enableCount = Math.floor(currentMoney / it.minConsumeValue);
		  }
		  if (enableCount > (it.number - it.count)) {
			enableCount = it.number - it.count;
		  }
		  it.enableCount = enableCount + it.count;
		  if (!it.isCheck) {
			it.disabled = it.enableCount <= 0;
		  }
		  if (it.count === 0) {
			it.isCheck = false;
		  }
		});
		return list;
	  },
	  getCheckedMinValueSum(checkedCoupons) {
		if (!checkedCoupons || !checkedCoupons.length) {
		  return 0;
		}
		let sumValue = 0;
		checkedCoupons.forEach(item => {
		  sumValue += Math.mult(item.minConsumeValue, item.count);
		});
		return sumValue;
	  },
	  createList() {
		if (this.list[0].length < 1 && this.list[1].length < 1) {
		  this.list = copy(this.couponList);
		}
	  }
	},
	computed: {
	  selectCount() {
		console.log('this.list[this.menuIndex]--', this.list[this.menuIndex]);
		return this.list[this.menuIndex].filter(item => item.enabled && item.isCheck).reduce((total, item) => {
		  return item.count + total;
		}, 0);
	  },
	  selectDiscount() {
		if (this.menuIndex === 0) {
		  let orderMaxYuan = Math.mult(
			  this.money,
			  this.discountParameter.couponConsumeMaxRate
		  );
		  let discount = 0;
		  this.list[this.menuIndex].filter(item => item.isCheck).forEach(item => {
			discount += Math.mult(item.couponValue, item.count);
		  });
		  if (discount > orderMaxYuan) {
			discount = orderMaxYuan;
		  }
		  discount = Math.changeToDecimal(discount, 2);
		  return discount;
		}
		else {
		  let checkedItem = this.list[1].find(x => x.isCheck);
		  if (!checkedItem) {
			return 0;
		  }
		  let rate = Math.subtract(1, checkedItem.couponValue);
		  return Math.changeToDecimal(Math.mult(rate, this.money), 2);
		}
	  },
	  ...mapState([
		'couponList'
	  ])
	},
	watch: {
	  menuIndex(now, old) {
		if (now > old) {
		  this.transitionName = "left";
		}
		if (now < old) {
		  this.transitionName = "right";
		}
	  },
	  checkedCoupon(now) {
	  },
	  show(now) {
		// if (now) {
		//   document.body.style.height = "100%";
		//   this.list = copy(this.couponList);
		//   this.reset();
		//   this.filter(this.money);
		// }
		// else {
		//   document.body.style.height = "auto";
		// }
	  },
	}
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../styles/variable";

  .coupon-action {
    background-color: #fff;
    border-radius: 8px 8px 0 0;
    position: relative;
    height: 450px;

    display: flex;
    flex-direction: column;

    .coupon-head {
      .menu-item {
        line-height: 47px;
        text-align: center;
        flex: 1;
        border-bottom: 1px solid transparent;

        &.active {
          border-bottom-color: #ff9800;
        }
      }
    }

    .coupon-content {
      overflow: hidden;
      position: relative;
      /*height: 340px;*/
      flex: 1;
      padding-top: 36px;
      background-color: #f7f7f7;

      .tips {
        position: absolute;
        text-align: center;
        line-height: 36px;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
      }
    }

    .coupon-foot {
      position: relative;
      .shadow;

      .text {
        padding-left: 10px;
        .f12;
      }

      button {
        height: 48px;
        background-color: #ff9800;
        color: #fff;
        padding: 0 38px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  .left-enter,
  .side-enter,
  .side-leave-to,
  .right-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .left-enter-active,
  .side-enter-active,
  .side-leave-active,
  .left-leave-active {
    transition: 0.3s;
    position: absolute;
  }

  .right-enter,
  .left-leave-to {
    transform: translate3d(-100%, 0, 0);
  }

  .right-enter-active,
  .right-leave-active {
    transition: 0.3s;
    position: absolute;
  }

  .auto-pick {
    color: #fe9700;
    background-color: #fafafa;
    border: 0.026667rem solid #fe9700;
    padding: 0 0.2em;
    position: absolute;
    right: 0.266667rem;
    top: 0.2rem;
    font-size: 12px;
    line-height: 24px;
  }
</style>
