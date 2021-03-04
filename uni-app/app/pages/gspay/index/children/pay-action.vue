<template>
  <action
    class="pay-action-wrap"
    @touchmove.native.prevent
    @cancel="cancel"
    v-show="show"
  >
    <div class="pay-action" slot="bottom">
      <header class="pay-head">
        <i class="iconfont icon-quxiao" @click="cancel"></i>
        <span v-if="parameter.isMember">充值更优惠</span>
        <span v-if="!parameter.isMember">办卡并买单</span>
      </header>
      <section class="pay-content">
        <div
          class="pay-block discount-block"
          v-if="enableValuePay || (enableValuePay && canUseMotherValue)"
        >
          <template v-if="pageData">
            <share-discount
              @tap="discountTap"
              :list="pageData.shareList"
              :parameter="pageData.parameter"
            />
            <conflict-discount
              @tap="discountTap"
              :list="pageData.mutexList"
              :parameter="pageData.parameter"
            />
          </template>

          <!--原母卡/储值选择区-->
          <template v-if="false">
            <div
              @click="checkValue(true)"
              v-if="enableValuePay && canUseMotherValue"
              class="panel icon-panel van-hairline&#45;&#45;bottom"
            >
              <div class="left" :class="{ disable: !canUseMotherValue }">
                <i class="iconfont icon-chuzhi"></i>
                <span class="text">母卡</span>
                <span class="val">余额{{ motherValue }}元</span>
                <span class="val tip" v-if="!canUseMotherValue"
                  >(不适用当前油品)</span
                >
                <span class="val tip" v-if="canUseMotherValue && isMutex"
                  >(存在互斥，不适用)</span
                >
              </div>
              <div class="right">
                <span class="price">-{{ isChildCard ? valuePay : 0 }}</span>
                <span class="icon">
                  <i
                    v-if="valueMutex"
                    class="iconfont icon-icon_xuanzhong1"
                    :class="{ checked: isChildCard }"
                  ></i>
                  <i
                    v-if="!valueMutex"
                    class="iconfont icon-fuxuankuang-xuanzhong"
                    :class="{ checked: isChildCard }"
                  ></i>
                </span>
              </div>
            </div>
            <div
              @click="checkValue(false)"
              v-if="enableValuePay"
              class="panel icon-panel van-hairline&#45;&#45;bottom"
            >
              <div class="left">
                <i class="iconfont icon-chuzhi"></i>
                <span class="text">{{
                  currentOilCardName ? currentOilCardName : "储值"
                }}</span>
                <span class="val"
                  >余额{{
                    parameter.discountParameter.memberAvailableValue
                  }}元</span
                >
                <span class="val tip" v-if="isMutex">(存在互斥，不适用)</span>
              </div>
              <div class="right">
                <p
                  v-if="(valueChecked ? valuePay : 0) > 0"
                  style="text-align: right;line-height: 1.6;"
                >
                  <span class="price">-{{ valueChecked ? valuePay : 0 }}</span>
                </p>
                <p
                  v-if="currentGasDiscount && currentGasDiscount.discountDesc"
                  class="desc"
                >
                  {{ currentGasDiscount.discountDesc }}
                </p>
                <span class="icon">
                  <i
                    v-if="valueMutex"
                    class="iconfont icon-icon_xuanzhong1"
                    :class="{ checked: valueChecked }"
                  ></i>
                  <i
                    v-if="!valueMutex"
                    class="iconfont icon-fuxuankuang-xuanzhong"
                    :class="{ checked: valueChecked }"
                  ></i>
                </span>
              </div>
            </div>
          </template>

          <template v-if="!isFreeAddValueRule">
            <value-selector
              v-if="!isMutex && !isChildCard"
              :list="addValueList"
              v-model="addValue"
              @addValueChange="addValueChange"
              ref="val"
            />
            <ValueDetail
              v-if="!isMutex && !isChildCard"
              :pickedItem="addValue"
            />
            <div
              v-if="
                addValueDesc ||
                  (currentGasDiscount &&
                    currentGasDiscount.discount > 0 &&
                    valueChecked)
              "
              class="rest-value"
            >
              <span v-if="addValueDesc" v-html="addValueDesc"></span>
              <span
                v-if="
                  currentGasDiscount &&
                    currentGasDiscount.discount > 0 &&
                    valueChecked
                "
                >共优惠{{ currentGasDiscount.discount }}元储值</span
              >
            </div>
          </template>
          <template v-else>
            <div class="free-block block" :class="isMutex ? 'mutex-block' : ''">
              <p class="title">
                <span>充</span>
                <span>{{ freeBlockData.addValue }}</span>
                <span>元</span>
                <span>立享免单</span>
              </p>
              <p class="sub-title">
                本次免单
                <i>{{ freeBlockData.freeValue }}</i>
                元，余额
                <i>{{ freeBlockData.remainMoney }}</i> 元
              </p>
              <button @click="freeConfirm" class="btn btn-price btn-with-free">
                我要免单
              </button>
            </div>
          </template>
        </div>
        <div class="pay-block" v-if="showPayWaySelector">
          <div
            class="panel"
            @click="payWayShow = !payWayShow"
            style="padding: 15px 10px;"
            v-if="payTypeNames[checkedPayType]"
          >
            <div class="left">支付方式</div>
            <div class="right">
              <span>{{ payTypeNames[checkedPayType] }}支付</span>
              <i class="iconfont icon-xiangyoujiantou"></i>
            </div>
          </div>
        </div>
        <template v-if="!isFreeAddValueRule">
          <div class="pay-block pay-foot">
            <button
              class="btn"
              :class="
                !isMutex && !isChildCard && addValue.guid
                  ? 'btn-old'
                  : 'btn-price'
              "
              @click="confirm"
            >
              {{ btnText }}
            </button>
          </div>

          <div class="pay-block pay-foot">
            <button
              class="btn"
              :class="btnType"
              @click="originConfirm"
              v-if="!isMutex && !isChildCard && addValue.guid"
            >
              直接买单
            </button>
          </div>
        </template>
        <template v-else>
          <div class="pay-block pay-foot pay-foot__with-free">
            <button
              class="btn btn-with-free"
              :class="btnType"
              @click="originConfirm"
              v-if="!isChildCard"
            >
              直接买单
            </button>
          </div>
        </template>
      </section>

      <!--支付方式选择器-->
      <div
        class="pay-way-block"
        :class="payWayShow ? 'pay-way-block__show' : ''"
      >
        <!-- v-show="!((valueChecked||isChildCard)&&finalPayCash===0)" 原payway-selector条件-->
        <payway-selector
          :enableMemberPay="enableMemberPay"
          v-model="checkedPayType"
          :payType="parameter.payType"
          :isMember="parameter.isMember"
          :deviceType="parameter.deviceType"
          @close="payWayShow = false"
          @listChange="listChange"
        />
      </div>

      <author-code ref="authcode" :codelength="6"></author-code>
    </div>
  </action>
</template>

<script>
import ConflictDiscount from "./conflict-discount.vue";
import ShareDiscount from "./share-discount.vue";

import PaywaySelector from "./payway-selector.vue";
import ValueSelector from "./value-selector.vue";
import ValueDetail from "./ValueDetail";
// import ConflictDiscount from "./conflict-discount.vue";
import Action from "../../../../components/action";
import AuthorCode from "./authcode.vue";
import { checkAuthorCode, calculateGasDiscount } from "../../../../javascripts/api/gs-api";
import "../js/math";
import { Pay } from "../js/submit";
export default {
  name: "pay-action",
  props: {
    pageData: Object,
    show: {
      type: Boolean
    },
    parameter: {
      type: Object,
      default: {}
    },
    result: {
      type: Object,
      default: {}
    },
    money: {
      type: Number,
      default: 0
    },
    nodiscount: {
      type: Number,
      default: 0
    },
    initData: {
      type: Object,
      default: {}
    },
    meno: {
      type: String,
      default: ""
    },
    checkedMutex: {
      type: Number,
      default: -1
    },
    childCardGuid: {
      type: String
    },
    canUseMotherValue: {
      type: Boolean,
      default: false
    },
    oilPrice: {
      type: Number,
      require: true
    },
    gasDiscount: {
      type: Object,
      default: null
    },
    isSubOilCard: {
      type: Boolean,
      default: false
    },
    currentOilCardName: {
      type: String,
      default: ""
    }
  },
  components: {
    AuthorCode,
    Action,
    ValueSelector,
    ValueDetail,
    ConflictDiscount,
    ShareDiscount,
    PaywaySelector
  },
  data() {
    return {
      addValue: {},
      valuePay: 0,
      valueChecked: false,
      checkedPayType: 0,
      enableMemberPay: true,
      isChildCard: false,
      payWayShow: false,
      addValueGsDiscount: null,
      calcFail: false,
      showPayWaySelector: false
    };
  },
  created() {
    setTimeout(() => {
      this.$refs.authcode.setCheckFun(async code => {
        var result = await checkAuthorCode(code, this.initData.storeId);
        console.log("检查验证码", code, result);
        if (result.success) {
          return true;
        } else {
          return false;
        }
      });
    }, 100);
  },
  methods: {
    discountTap(item) {
      console.log(item);
    },
    cancel() {
      this.payWayShow = false;
      this.$emit("update:show", false);
    },
    checkValue(flag) {
      console.log("flag", flag);
      if (this.isMutex) {
        return;
      }
      if (flag) {
        if (!this.canUseMotherValue) {
          this.isChildCard = false;
          return;
        }
        this.isChildCard = !this.isChildCard;
        if (this.isChildCard) {
          this.addValueChange({});
          this.valueChecked = false;
        }
      } else {
        this.valueChecked = !this.valueChecked;
        if (this.valueChecked) {
          this.isChildCard = false;
        }
        if (this.valueChecked && this.addValueList.length) {
          this.addValueChange(this.addValueList[0]);
        }
      }
    },
    confirm() {
      if (this.calcFail) {
        this.$dialog._toast("每升减优惠计算错误");
        return;
      }

      if (!this.finalPayType) {
        this.$dialog._toast("请选择支付方式");
        return;
      }

      if (this.finalPayType === 16 || this.finalPayType === 32) {
        var tips = `${this.finalPayType === 16 ? "现金" : "银行卡"}支付${
          this.finalPayCash
        }元`;
        this.$refs.authcode.showCode(tips).then(code => {
          var pay = new Pay(this.initData, this.parameter);
          pay.submit(
            this.currentGasDiscount,
            this.finalPayType,
            this.money,
            this.nodiscount,
            this.meno,
            this.result,
            this.addValue,
            this.valueChecked,
            code,
            this.isChildCard,
            this.childCardGuid,
            this.oilPrice,
            this.isSubOilCard
          );
        });
        return;
      }
      var pay = new Pay(this.initData, this.parameter);
      pay.submit(
        this.currentGasDiscount,
        this.finalPayType,
        this.money,
        this.nodiscount,
        this.meno,
        this.result,
        this.addValue,
        this.valueChecked,
        "",
        this.isChildCard,
        this.childCardGuid,
        this.oilPrice,
        this.isSubOilCard
      );
    },
    async originConfirm() {
      await this.addValueChange({});
      this.confirm();
    },
    async freeConfirm() {
      if (this.isMutex) {
        return;
      }
      await this.addValueChange(this.addValueList[0]);
      this.confirm();
    },
    async addValueChange(item) {
      this.addValue = item;
      if (JSON.stringify(item) == "{}") {
        this.addValueGsDiscount = null;
      } else {
        let result = await calculateGasDiscount({
          goodsItemGuid: this.result.goodsItemGuid,
          addRuleGuid: item.guid,
          payCash: this.result.payCash,
          price: this.result.price, //价格
          uPayDiscount: this.result.activity.money,
          memberDiscount: this.result.discount.money,
          couponDiscount: this.result.coupon.money,
          pointDiscount: this.result.point.money,
          deductStaffGuids: this.initData.staffId,
          totalCash: this.money,
          oilCardMemberGuid: this.isChildCard ? "" : this.childCardGuid,
          isSubOilCard: this.isSubOilCard
        });
        console.log("result", result);
        if (result.success) {
          this.calcFail = false;
          this.addValueGsDiscount = result.data;
        } else {
          this.calcFail = true;
          this.$dialog._toast(result.message);
          return;
        }
      }
      this.updateValuePay(this.valuePayChecked);
    },
    updateValuePay(now) {
      console.log("addvaluepay", now);
      if (now > 0) {
        if (this.isChildCard || !this.currentGasDiscount) {
          var avaValue = this.isChildCard
            ? this.parameter.childCardInfo.limitValue
            : this.parameter.discountParameter.memberAvailableValue;
          this.valuePay =
            this.result.payCash < avaValue ? this.result.payCash : avaValue;
        } else {
          this.valuePay = this.currentGasDiscount.realValue;
        }
      } else {
        this.valuePay = 0;
        this.addValue = {};
        this.addValueGsDiscount = null;
      }
    },
    listChange(list) {
      this.showPayWaySelector = list.filter(x => x.enabled).length > 1;
      console.log("listchange", this.showPayWaySelector, list);
    }
  },
  computed: {
    finalPayType() {
      if (this.valueChecked && this.finalPayCash === 0) {
        return 4;
      }
      if (this.isChildCard && this.finalPayCash === 0) {
        return 4;
      }
      console.warn(this.addValue, "final");
      if (JSON.stringify(this.addValue) !== "{}") {
        return 4;
      }
      return this.checkedPayType;
    },
    enableValuePay() {
      if (!this.parameter) {
        return false;
      }
      return (this.parameter.payType & 4) !== 0;
    },
    valueMutex() {
      return this.parameter && (this.parameter.payMutex & 16) !== 0;
    },
    finalPayCash() {
      //最终支付金额
      if (JSON.stringify(this.addValue) != "{}") {
        return this.addValue.valueAdd;
      } else {
        if (!this.valueChecked && !this.isChildCard) {
          return this.result.payCash;
        }
        if (this.isChildCard) {
          return Number(this.result.payCash) - Number(this.valuePay);
        }
        return (
          this.currentGasDiscount || {
            remainMoney: Math.subtract(this.result.payCash, this.valuePay)
          }
        ).remainMoney;
      }
    },
    addValueList() {
      if (!this.parameter.addValue) {
        return [];
      }
      var result = [];
      let totalPay = 0;
      if (this.gasDiscount) {
        totalPay = this.gasDiscount.remainMoney;
      } else {
        let valpay = Math.min(
          this.result.payCash,
          this.parameter.discountParameter.memberAvailableValue
        );
        totalPay = Math.subtract(this.result.payCash, valpay);
      }
      this.parameter.addValue.forEach(e => {
        if (e.giftType === 6) {
          console.log(e, "充值规则");
          if (this.money >= e.valueAdd) {
            result.push(e);
            return;
          }
        }
        if (totalPay === 0 || e.valueAdd * 1 < totalPay) {
          console.log(e, totalPay, "filter", this.result, this.valuePay);
        } else {
          result.push(e);
        }
      });
      return result;
    },
    payTypeDisplay() {
      if (!this.checkedPayType) {
        return "确认";
      }
      if (this.valueChecked && this.finalPayCash === 0) {
        return "储值";
      }
      if (this.isChildCard && this.finalPayCash === 0) {
        return "母卡";
      }
      let map = {
        1: "支付宝",
        2: "微信",
        16: "现金",
        32: "银行卡",
        1024: "分期"
      };
      return map[this.checkedPayType];
    },
    isMutex() {
      return this.checkedMutex >= 0 && (this.parameter.payMutex & 16) !== 0;
    },
    valuePayChecked() {
      var c = 0;
      if (this.isChildCard) {
        c = c + 1;
      }
      if (this.valueChecked) {
        c = c + 2;
      }
      return c;
    },
    motherValue() {
      if (
        this.parameter.childCardInfo.limitValue >
        this.parameter.childCardInfo.motherAvailableValue
      ) {
        return this.parameter.childCardInfo.motherAvailableValue;
      } else {
        return this.parameter.childCardInfo.limitValue;
      }
    },
    btnType() {
      return "btn-price";
    },
    currentGasDiscount() {
      console.log(this.addValueGsDiscount, this.gasDiscount);
      return this.addValueGsDiscount || this.gasDiscount;
    },
    addValueDesc() {
      console.log("addvaluedesc", this.addValue, this.addValueGsDiscount);
      if (JSON.stringify(this.addValue) === "{}") {
        return null;
      }
      if (this.addValueGsDiscount) {
        return `买单后余额<i style="color: #ff9801;padding: 0 3px;">${this.addValueGsDiscount.remainValue}</i>元`;
      }
      return null;
    },
    payTypeNames() {
      return {
        1: "支付宝",
        2: "微信",
        16: "现金",
        32: "银行卡",
        1024: "分期"
      };
    },
    btnText() {
      if (!this.isMutex && !this.isChildCard && this.addValue.guid) {
        return `充值${this.addValue.valueAdd}元并买单`;
      } else {
        return `${this.payTypeDisplay}支付${
          this.finalPayCash === 0 ? this.valuePay : this.finalPayCash
        }元`;
      }
    },
    isFreeAddValueRule() {
      if (!this.addValueList || !this.addValueList.length) {
        return false;
      }
      if (!this.parameter.addValue || !this.parameter.addValue.length) {
        return false;
      }
      return this.parameter.addValue[0].giftType === 6;
    },
    freeBlockData() {
      if (!this.parameter.addValue || !this.parameter.addValue.length) {
        return {};
      }
      var addValue = this.parameter.addValue[0];
      var avaValue = this.parameter.discountParameter.memberAvailableValue;
      var addValuePay = Math.mult(addValue.times, this.result.payCash);
      return {
        addValue: addValuePay,
        remainMoney: this.addValueGsDiscount
          ? this.addValueGsDiscount.remainValue
          : Math.add(addValuePay, avaValue),
        freeValue: this.result.payCash
      };
    }
  },
  watch: {
    show(now) {
      setTimeout(() => {
        console.log("null");
        this.$refs.val && this.$refs.val.refresh();
        this.addValueGsDiscount = null;
        this.updateValuePay(this.valuePayChecked);
      }, 20);
      if (now) {
        if (!this.valueMutex) {
          this.valueChecked = true;
          this.isChildCard = false;
          if (this.valueChecked && this.addValueList.length) {
            this.addValueChange(this.addValueList[0]);
          }
        }
      } else {
        this.valueChecked = false;
      }
    },
    valuePayChecked(now) {
      this.addValueGsDiscount = null;
      this.updateValuePay(now);
    },
    addValue(now) {
      if (JSON.stringify(now) != "{}") {
        if (!this.isChildCard) {
          this.valueChecked = true;
          this.isChildCard = false;
        }
        if (!this.isFreeAddValueRule) {
          this.enableMemberPay = false;
        }
      } else {
        this.enableMemberPay = true;
      }
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.pay-action {
  background-color: #fff;
  max-height: 80vh;
  padding-bottom: 70px;
  border-radius: 15px 15px 0 0;

  .pay-block {
    background-color: #fff;
    border-radius: 4px;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  .panel {
    padding: 10px;

    .text {
      line-height: 1;
    }

    .left {
      &.disable {
        .val {
          color: #e0e0e0;
        }
      }

      .tip {
        font-size: small;
      }
    }

    .right {
      .checked {
        color: #fe9700;
      }
      .desc {
        font-size: 12px;
        color: #f00;
      }
    }
  }

  .icon-panel {
    .right {
      position: relative;
      padding-right: 30px;
    }
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
    }
  }

  .pay-content {
    padding: 10px;

    .free-block {
      button {
        width: 310px;
      }
    }

    .rest-value {
      padding: 12px 10px 0 10px;
      font-size: 12px;
    }

    .pay-foot__with-free {
      width: 310px;
      margin: 0 auto;
      .btn {
        background: #ff8800;
        border: 1px solid #ff8800;
      }
    }

    .btn {
      width: 100%;
      height: 44px;
      border-radius: 4px;
      font-size: 16px;
    }

    .btn-price {
      background-color: #ff8800;
      color: #fff;
    }
    .btn-with-free {
      width: 310px;
      background-color: #07c160;
      color: #fff;
    }

    .btn-old {
      color: #fff;
      background-color: #07c160;
      border: 1px solid #07c160;
    }

    .btn-success {
      background-color: #28d274;
      color: #fff;
    }
  }

  .pay-way-block {
    border-radius: 15px 0 0;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    transform: translate3d(100%, 0, 0);
    transition: 0.3s;

    &.pay-way-block__show {
      transform: translate3d(0, 0, 0);
    }
  }

  .icon-chuzhi {
    color: #f87338;
  }

  .block {
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    overflow: hidden;
  }
}
</style>

<style lang="less" rel="stylesheet/less">
.pay-action {
  .pay-head {
    padding: 14px 10px;
    text-align: center;
    position: relative;

    .iconfont {
      position: absolute;
      left: 10px;
      top: 15px;
    }
  }

  .discount-block {
    .panel {
      margin: 0 -10px;
      line-height: 36px;
      height: 36px;
    }
  }

  .free-block {
    padding: 16px 0 15px;
    text-align: center;
    position: relative;

    &:before {
      content: "推荐";
      width: 60px;
      display: block;
      background-color: #30be54;
      color: #fff;
      font-size: 12px;
      position: absolute;
      left: 0;
      top: 0;
      line-height: 20px;
      transform: rotate(-45deg) translate3d(-16px, -8px, 0);
    }

    .title {
      font-size: 21px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .sub-title {
      font-size: 12px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 14px;

      i {
        color: #ff6400;
      }
    }

    &.mutex-block {
      opacity: 0.4;
    }
  }
}
</style>
