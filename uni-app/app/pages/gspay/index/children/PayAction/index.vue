<template>
  <action v-show="show" @cancel="cancel">
    <div class="pay-action" slot="bottom">
      <header class="pay-action_head">
        <span>买单金额：</span><span class="pay-price">{{ money.toFixed(2)}}</span>
        <i class="iconfont icon-quxiao" @click="cancel"></i>
      </header>
      <section class="pay-action_body">
<!--        <Scroll ref="scroll" style="max-height: 40vh;">-->
          <div class="slide">
            <div class="save-text"
                 v-show="
                 money>
              0 &&
              config.gasGun.price !== 0 &&
              config.gasGun.price !== 1 &&
              Number(getSaveCount) > 0
              "
              >
              <label class="save-detail">
                总优惠
                <span class="save-count">{{ getSaveCount }}</span>元
                <span>/</span>{{unit}}
              </label>
            </div>
            <div class="pay-action_discount">
              <share-discount style="margin-bottom: 0px;" @tap="shareTap" :list="shareList" :parameter="parameter" />
              <div v-if="!valueMutex">
                <div class="pay-action_discount">
                  <div class="block discount-block"
                       v-if="enableValuePay || (enableValuePay && isCanUseMotherValue)">
                    <div @click="checkValue(true)"
                         v-if="enableValuePay && isCanUseMotherValue"
                         class="panel icon-panel">
                      <div class="left" :class="{ disable: !isCanUseMotherValue }">
                        <i class="iconfont icon-zizhumaidanyinhangqiazhifu" style="color:#f87338;"></i>
                        <span class="text">母卡</span>
                        <span class="val">余额{{ motherValue }}元</span>
                        <span class="val tip" v-if="!isCanUseMotherValue">(不适用当前油品)</span>
                      </div>
                      <div class="right">
                        <span class="price">-{{ isChildCard ? valuePay : 0 }}</span>
                        <span class="icon">
                          <i class="iconfont icon-fuxuankuang-xuanzhong"
                             :class="{ checked: isChildCard }"></i>
                        </span>
                      </div>
                    </div>
                    <div @click="checkValue(false)"
                         v-if="enableValuePay"
                         class="panel icon-panel">
                      <div class="left">
                        <i class="iconfont icon-chuzhi" style="color:#f87338;"></i>
                        <span class="text">{{ currentOilCardName ? currentOilCardName : "储值" }}</span>
                        <span class="val">
                          余额{{
                          parameter.discountParameter.memberAvailableValue
                          }}元
                        </span>
                      </div>
                      <div class="right">
                        <p v-if="(valueChecked ? valuePay : 0) > 0"
                           style="text-align: right;line-height: 1.6;">
                          <span class="val">-</span>
                          <span class="price">
                            {{
                            valueChecked ? valuePay : 0
                            }}
                          </span>
                        </p>
                        <span class="icon">
                          <i class="iconfont icon-fuxuankuang-xuanzhong"
                             :class="{ checked: valueChecked }"></i>
                        </span>
                      </div>
                    </div>
                    <div @click="checkValue(false)"
                         v-if="enableValuePay&&currentGasDiscount && currentGasDiscount.discountDesc"
                         class="panel icon-panel"
                         style="min-height: 0px;">
                      <div class="left">
                      </div>
                      <div class="right" style="padding-right: 5px;min-height: 0px;">
                        <p class="desc">{{ currentGasDiscount.discountDesc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="!isFreeAddValueRule">
                  <div class="pay-action_add-value">
                    <div class="value-slide">
                      <ValueSelector v-if="!isMutex && !isChildCard"
                                     :list="addValueList"
                                     @addValueChange="addValueChange"
                                     v-model="addValue"
                                     ref="val" />
                    </div>
                    <ValueDetail v-if="!isMutex && !isChildCard" :pickedItem="addValue" />
                    <p class="pay-action_add-value_tip" v-if="addValueGsDiscount">
                      充值后自动买单，买单后余额
                      <span class="text-yellow">{{ addValueGsDiscount.remainValue }}</span>元
                    </p>
                  </div>
                </template>
                <template v-if="isFreeAddValueRule && freeBlockData.addValue > 0">
                  <div class="free-box">
                    <div class="free-block block" :class="freeBlockClass" @click="checkfb">
                      <p class="title">
                        <span>充</span>
                        <span class="title-text">{{ freeBlockData.addValue }}</span>
                        <span>元</span>
                        <span v-if="freeBlockData.type === 1">立享免单</span>
                        <span v-if="freeBlockData.type === 2">
                          立享
                          <span class="title-text">{{ freeBlockData.discount }}</span>折
                        </span>
                        <span v-if="freeBlockData.type === 3">
                          送
                          <span class="title-text">{{ freeBlockData.send }}</span>
                          元
                        </span>
                      </p>
                      <p class="sub-title">
                        <span v-if="freeBlockData.type === 3">本次消费</span>
                        <span v-if="freeBlockData.type === 2">本次优惠</span>
                        <span v-if="freeBlockData.type === 1">本次免单</span>
                        <span v-if="freeBlockData.type !== 1">
                          <i>{{ freeBlockData.money }}</i>
                          元，余额
                        </span>
                        <span v-else>，余额</span>
                        <i>{{ freeBlockData.remainMoney }}</i>元
                      </p>
                      <i class="sub-icon iconfont icon-xuanzhong1"></i>
                    </div>
                  </div>
                </template>
              </div>
              <conflict-discount style="margin-bottom: 0px;" @tap="mutexTap" :list="mutexList" :parameter="parameter" />
              <div v-if="valueMutex">
                <div class="pay-action_discount">
                  <div class="block discount-block"
                       v-if="enableValuePay || (enableValuePay && isCanUseMotherValue)">
                    <div @click="checkValue(true)"
                         v-if="enableValuePay && isCanUseMotherValue"
                         class="panel icon-panel">
                      <div class="left" :class="{ disable: !isCanUseMotherValue }">
                        <i class="iconfont icon-zizhumaidanyinhangqiazhifu" style="color:#f87338;"></i>
                        <span class="text">母卡</span>
                        <span class="val">余额{{ motherValue }}元</span>
                        <span class="val tip" v-if="!isCanUseMotherValue">(不适用当前油品)</span>
                      </div>
                      <div class="right">
                        <span class="price">-{{ isChildCard ? valuePay : 0 }}</span>
                        <span class="icon">
                          <i class="iconfont icon-icon_xuanzhong1"
                             :class="{ checked: isChildCard }"></i>
                        </span>
                      </div>
                    </div>
                    <div @click="checkValue(false)"
                         v-if="enableValuePay"
                         class="panel icon-panel">
                      <div class="left">
                        <i class="iconfont icon-chuzhi" style="color:#f87338;"></i>
                        <span class="text">{{ currentOilCardName ? currentOilCardName : "储值" }}</span>
                        <span class="val">
                          余额{{
                          parameter.discountParameter.memberAvailableValue
                          }}元
                        </span>
                      </div>
                      <div class="right">
                        <p v-if="(valueChecked ? valuePay : 0) > 0" style="text-align: right;line-height: 1.6;">
                          <span class="val">-</span>
                          <span class="price">
                            {{ valueChecked ? valuePay : 0 }}
                          </span>
                        </p>
                        <span class="icon">
                          <i class="iconfont icon-icon_xuanzhong1" :class="{ checked: valueChecked }"></i>
                        </span>
                      </div>
                    </div>
                    <div @click="checkValue(false)"
                         v-if="enableValuePay&& currentGasDiscount && currentGasDiscount.discountDesc"
                         class="panel icon-panel"
                         style="min-height: 0px;">
                      <div class="left"></div>
                      <div class="right" style="padding-right: 5px;min-height: 0px;">
                        <p class="desc">{{ currentGasDiscount.discountDesc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="!isFreeAddValueRule">
                  <div class="pay-action_add-value">
                    <div class="value-slide">
                      <ValueSelector v-if="!isMutex && !isChildCard"
                                     :list="addValueList"
                                     @addValueChange="addValueChange"
                                     v-model="addValue"
                                     ref="val" />
                    </div>
                    <ValueDetail v-if="!isMutex && !isChildCard" :pickedItem="addValue" />
                    <p class="pay-action_add-value_tip" v-if="addValueGsDiscount">
                      充值后自动买单，买单后余额
                      <span class="text-yellow">{{ addValueGsDiscount.remainValue }}</span>元
                    </p>
                  </div>
                </template>
                <template v-if="isFreeAddValueRule && freeBlockData.addValue > 0">
                  <div class="free-box">
                    <div class="free-block block" :class="freeBlockClass" @click="checkfb">
                      <p class="title">
                        <span>充</span>
                        <span class="title-text">{{ freeBlockData.addValue }}</span>
                        <span>元</span>
                        <span v-if="freeBlockData.type === 1">立享免单</span>
                        <span v-if="freeBlockData.type === 2">
                          立享
                          <span class="title-text">{{ freeBlockData.discount }}</span>折
                        </span>
                        <span v-if="freeBlockData.type === 3">
                          送
                          <span class="title-text">{{ freeBlockData.send }}</span>
                          元
                        </span>
                      </p>
                      <p class="sub-title">
                        <span v-if="freeBlockData.type === 3">本次消费</span>
                        <span v-if="freeBlockData.type === 2">本次优惠</span>
                        <span v-if="freeBlockData.type === 1">本次免单</span>
                        <span v-if="freeBlockData.type !== 1">
                          <i>{{ freeBlockData.money }}</i>
                          元，余额
                        </span>
                        <span v-else>，余额</span>
                        <i>{{ freeBlockData.remainMoney }}</i>元
                      </p>
                      <i class="sub-icon iconfont icon-xuanzhong1"></i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
<!--        </Scroll>-->
      </section>
      <footer class="pay-action_foot">
        <div class="rest-value" v-if="finalPayCash > 0">
          <p class="rest-value_label">还需支付</p>
          <p class="rest-value_price">{{ needPay }}</p>
        </div>
        <div class="btn-wrap" @click="submit">
          <button>
            <svg-icon :icon="payTypeIcon" v-if="payTypeIcon" />
            <span>{{ payButName }}</span>
          </button>
        </div>
      </footer>
      <div class="pay-type-switch" @click="payTypeState.show = true" ref="switch" v-if="(finalPayCash > 0) && (payTypeState.props.options.length > 1)">切换支付方式</div>
<!--      <PopMenu v-model="payTypeState.show" v-bind="payTypeState.props" @click="pickPayType" />-->
      <CouponPicker :show.sync="couponState.show"
                    v-if="parameter"
                    :discountParameter="parameter.discountParameter"
                    :allowMuti="parameter.discountParameter.isAllowMultiCoupon"
                    @confirm="couponConfirm"
                    ref="coupon" />
      <author-code ref="authcode" :codelength="6"></author-code>
    </div>
  </action>
</template>

<script>
  // import Scroll from "@/components/scroll";
  // import * as BodyLocker from "javascripts/utils/lockBody";
  import AuthorCode from "../authcode.vue";
  import "../../js/math";
  import { Pay } from "../../js/submit";
  import payactionService from "../../js/payactionService";
  import PopMenu from "../../../../../components/PopMenu";
  import ConflictDiscount from "../conflict-discount.vue";
  import ShareDiscount from "../share-discount.vue";
  import CouponPicker from "../CouponPicker";
  import Action from "../../../../../components/action";
  import ValueSelector from "../value-selector.vue";
  import ValueDetail from "../ValueDetail";
  import { mapGetters, mapState } from "vuex";
  import { CalulatorContext } from "../../js/calculator";
  import { CashContext } from "../../js/activity";
  import { checkAuthorCode, calculateGasDiscount, calculateGasOptimalDiscount } from "../../../../../javascripts/api/gs-api";

  const sleep = time => new Promise(r => setTimeout(r, time));
  const paytypes = {
    ali: 1,
    wecaht: 2,
    value: 4,
    point: 8,
    cash: 16,
    bankcard: 32,
    coupon: 64,
    best: 512,
    credit: 1024
  };
  const paymutexs = {
    activity: 1,
    coupon: 2,
    discount: 4,
    point: 8,
    value: 16
  };
  const discountTypes = ["discount", "activity", "coupon", "point"];
  const WIDTH = 375//document.documentElement.clientWidth;

  export default {
    name: "pay-action",
    props: {
      show: Boolean,
      money: Number,
      nodiscount: Number,
      meno: String,
      totalGas: Number,
      unit: String
    },
    components: {
      Action,
      // Scroll,
      PopMenu,
      ConflictDiscount,
      ShareDiscount,
      ValueSelector,
      ValueDetail,
      CouponPicker,
      AuthorCode
    },
    data() {
      return {
        addValue: {},
        restValue: 100,
        payTypeState: {
          svg: ""
        },
        couponState: {
          show: false
        },
        shareList: [],
        mutexList: [],
        result: {
          payCash: 0
        },
        couponSelector: {},
        cashContext: null,
        valueChecked: false,
        isChildCard: false,
        gasDiscount: null,
        addValueGsDiscount: null,
        calcFail: false,
        calcMsg: "",
        valuePay: 0,
        enableMemberPay: true,
        checkedPayType: 0,
        fbclassCheck: false
      };
    },
    created() {
      setTimeout(() => {
        this.$refs.authcode.setCheckFun(async code => {
          var result = await checkAuthorCode(code, this.initialData.storeId);
          console.log("检查验证码", code, result);
          return result.success;
        });
      }, 100);
    },
    methods: {
      refresh() {
        console.log(this.$refs["scroll"]);
        this.$refs["scroll"].refresh();
      },
      cancel() {
        this.$emit("update:show", false);
      },

      async onShow(now) {
        try {
          this.fbclassCheck = false;
          this.initPayTypeState();
          this.couponSelector = this.$refs.coupon;
          this.couponSelector.clearSelect();
          this.initMutex();
          this.initSelect();
          var calculateResult = await this.calculate();
          if (!calculateResult) {
            this.calc(true);
            if (this.isDefaultSubmit()) {
              this.defaultSubmit();
              return;
            }
            await this.culateGasDiscount();
            this.initValue(true);
          }
        } catch (e) {
          console.log(e, "<<<<<<<<<<<<<<<");
        }
      },
      //初始化支付方式
      initPayTypeState() {
        let data = {
          show: false,
          name: "未选择支付方式",
          value: "",
          payType: 0,
          props: {
            left: WIDTH / 2 - (60 / 37.5) * window.rem + "px",
            bottom: "45px",
            options: []
          }
        };
        let option = {};
        if (
          (this.hasPayType(paytypes.wecaht) && this.parameter.deviceType === 1) ||
          !PRODUCTION
        ) {
          option = {
            name: "微信支付",
            key: "wechat",
            svg: "wechat",
            iconColor: "#43B136",
            value: paytypes.wecaht
          };
          data.props.options.push(option);
        }
        if (
          (this.hasPayType(paytypes.ali) && this.parameter.deviceType === 2) ||
          !PRODUCTION
        ) {
          option = {
            name: "支付宝支付",
            key: "alipay",
            svg: "alipay",
            iconColor: "#00A0EE",
            value: paytypes.ali
          };
          data.props.options.push(option);
        }
        if (
          (this.hasPayType(paytypes.cash) &&
            this.enableMemberPay &&
            this.parameter.isMember) ||
          !PRODUCTION
        ) {
          option = {
            name: "现金支付",
            key: "currency",
            iconColor: "#FFBA00",
            svg: "cash",
            value: paytypes.cash
          };
          data.props.options.push(option);
        }
        if (
          (this.hasPayType(paytypes.bankcard) &&
            this.enableMemberPay &&
            this.parameter.isMember) ||
          !PRODUCTION
        ) {
          option = {
            name: "银行卡支付",
            key: "card",
            iconColor: "#FFA921",
            svg: "bank_card",
            value: paytypes.bankcard
          };
          data.props.options.push(option);
        }
        if (
          (this.hasPayType(paytypes.credit) && this.parameter.isMember) ||
          !PRODUCTION
        ) {
          option = {
            name: "分期支付",
            key: "creditPay",
            iconColor: "#F79E28",
            svg: "fenqi",
            value: paytypes.credit
          };
          data.props.options.push(option);
        }
        if (data.props.options.length > 0) {
          data.name = data.props.options[0].name;
          data.value = data.props.options[0].key;
          data.payType = data.props.options[0].value;
          data.svg = data.props.options[0].svg;
        }
        this.payTypeState = data;
      },

      //支付方式选择
      pickPayType(item) {
        console.log(item);
        this.payTypeState.show = false;
        this.payTypeState.name = item.name;
        this.payTypeState.value = item.key;
        this.$set(this.payTypeState, "svg", item.svg);
        this.payTypeState.payType = item.value;
      },

      //切换充值规则
      async addValueChange(item) {
        this.addValue = item;
        if (JSON.stringify(item) === "{}") {
          this.addValueGsDiscount = null;
        }
        else {
          let result = await calculateGasDiscount({
            goodsItemGuid: this.result.goodsItemGuid,
            addRuleGuid: item.guid,
            payCash: this.result.payCash,
            price: this.result.price, //价格
            uPayDiscount: this.result.activity.money,
            memberDiscount: this.result.discount.money,
            couponDiscount: this.result.coupon.money,
            pointDiscount: this.result.point.money,
            deductStaffGuids: this.initialData.staffId,
            totalCash: this.money,
            oilCardMemberGuid: this.isChildCard ? "" : this.childCardGuid,
            isSubOilCard: this.isSubOilCard
          });
          console.log("addValueChange_result", result);
          if (result.success) {
            this.calcFail = false;
            this.addValueGsDiscount = result.data;
          }
          else {
            this.calcFail = true;
            this.calcMsg = result.message;
            this.$dialog._toast(result.message);
            return;
          }
        }
        this.updateValuePay(this.valuePayChecked);
      },

      //优惠券手动选择
      async couponConfirm() {
        this.calc(false);
        await this.culateGasDiscount();
        this.initValue(false);
      },

      //组件弹出,计算优惠和支付
      initMutex() {
        this.mutexList = [];
        this.shareList = [];
        var parameter = this.parameter;
        if (parameter.discountParameter.discountType === 0 || parameter.discountParameter.discountType === 3) {
          if (
            parameter.discountParameter.memberDiscount !== 1 &&
            parameter.isMember
          ) {
            let item = {
              type: 0,
              text: `${parameter.memberGroupName}优惠`,
              checked: false,
              iconColor: "#309eff",
              icon: "icon-hui",
              result: {
                money: 0
              }
            };
            this.hasMutex(paymutexs.discount)
              ? this.mutexList.push(item)
              : this.shareList.push(item);
          }
        }
        else if (parameter.discountParameter.discountType === 1 || parameter.discountParameter.discountType === 2) {
          if (
            parameter.discountParameter.perLitreDiscount !== 0 &&
            parameter.isMember
          ) {
            // by yaol
            let item = {
              type: 0,
              text: `${parameter.memberGroupName}优惠`,
              checked: false,
              iconColor: "#309eff",
              icon: "icon-hui",
              result: {
                money: 0
              }
            };
            this.hasMutex(paymutexs.discount)
              ? this.mutexList.push(item)
              : this.shareList.push(item);
          }
        }

        //活动
        if (parameter.activity.type !== 0) {
          this.cashContext = CashContext.create(
            parameter.activity.body,
            parameter.activity.type
          );
          let item = {
            type: 1,
            text: this.cashContext.display(),
            description: parameter.activity.type === 6 ? this.cashContext.description() : "",
            checked: false,
            icon: "icon-jian",
            iconColor: "#fe9700",
            result: {
              money: 0
            }
          };
          this.hasMutex(paymutexs.activity)
            ? this.mutexList.push(item)
            : this.shareList.push(item);
        }
        if (this.hasPayType(paytypes.coupon) && parameter.isMember) {
          let item = {
            type: 2,
            text: "优惠券",
            checked: false,
            iconColor: "#FE845E",
            icon: "icon-zizhumaidanquan",
            result: {
              money: 0,
              count: 0,
              coupons: "",
              total: 0
            }
          };
          this.hasMutex(paymutexs.coupon)
            ? this.mutexList.push(item)
            : this.shareList.push(item);
        }
        if (this.hasPayType(paytypes.point) && parameter.isMember) {
          let item = {
            type: 3,
            text: "积分",
            iconColor: "#FF7541",
            icon: "icon-zizhumaidanjifen",
            checked: false,
            point: parameter.discountParameter.memberAvailablePoint,
            result: {
              money: 0
            }
          };
          this.hasMutex(paymutexs.point)
            ? this.mutexList.push(item)
            : this.shareList.push(item);
        }
      },

      //初始化优惠互斥/共享数组check选项
      initSelect() {
        this.mutexList.forEach(e => {
          e.checked = false;
        });
        if (this.money > 0) {
          this.shareList.forEach(e => {
            e.checked = true;
          });
        }
        else {
          this.shareList.forEach(e => {
            e.checked = false;
          });
        }
      },

      //是否自动三方支付
      isDefaultSubmit() {
        if (
          !payactionService.shouldShowPayAction({
            deviceType: this.parameter.deviceType,
            isMember: this.parameter.isMember,
            payType: this.parameter.payType,
            memberAvailableValue: this.parameter.discountParameter
              .memberAvailableValue,
            addValueList: this.parameter.addValue,
            valueMode: this.parameter.valueMode,
            result: this.result,
            isCanUseMotherValue: this.isCanUseMotherValue,
            money: this.money
          })
        ) {
          return true;
        }
        return false;
      },

      //自动支付
      defaultSubmit() {
        var pay = new Pay(this.initialData, this.parameter);
        pay.submit(
          null,
          this.getDefaultPayType(),
          this.money,
          this.nodiscount,
          this.getMeno,
          this.result,
          {},
          false,
          "",
          false,
          null,
          this.config.gasGun.price,
          this.isSubOilCard,
          this.totalGas,
          this.config.oilOrderGuid
        );
      },

      //获取默认支付方式
      getDefaultPayType() {
        return payactionService.currentPayTypeValue;
      },

      //计算储值,now是否需要重新选择储值
      initValue(now) {
        //免单勾选了的情况下,不用进行储值计算了
        if (this.fbclassCheck) {
          return;
        }
        this.addValueGsDiscount = null;
        this.addValue = {};
        if (now) {
          console.log("this.valueMutex-", this.valueMutex);
          if (!this.valueMutex) {
            this.valueChecked = true;
            this.isChildCard = false;
          }
        }
        console.log("this.valueChecked-", this.valueChecked);
        setTimeout(() => {
          this.$refs.val && this.$refs.val.refresh();
          this.updateValuePay(this.valuePayChecked);
        }, 20);
      },

      //最优策略
      async calculate() {
        var resultList = [];
        var mutexList = [...this.mutexList];
        var calculatorContextList = [];
        if (this.enableValuePay && this.valueMutex) {
          mutexList.push({ text: "储值", type: 4, result: { money: 0 } });
          this.clearValue();
          this.fbclassCheck = false;
        }
        console.log('mutexList----', mutexList);
        if (mutexList.length < 1) return false;
        for (var i = 0; i < mutexList.length; i++) {
          var params = {
            mutex: [],
            share: [],
            config: {
              activity: this.parameter.activity,
              discountParameter: this.parameter.discountParameter
            }
          };
          for (var j = 0; j < 4; j++) {
            params.mutex.push({
              checked: mutexList[i].type === j
            });
            params.share.push({
              checked: this.shareChecked(j)
            });
          }
          var calculatorContext = new CalulatorContext();
          var result = calculatorContext.calc(
            this.money * 1,
            this.nodiscount * 1,
            this.totalGas * 1,
            params,
            {
              wxcoupon: this.couponSelector,
              autoSelect: true
            }
          );
          resultList.push({ ...result, type: mutexList[i].type });
          console.log("resultList-->", resultList);
          calculatorContextList.push({ type: mutexList[i].type, context: calculatorContext });
        }
        var resultPush = [];
        var resultPush_NoPayCash = [];
        //筛选出还需要储值支付的项
        for (var i = 0; i < resultList.length; i++) {
          if (resultList[i].payCash === 0) {
            resultPush_NoPayCash.push(resultList[i]);
          }
          if (resultList[i].payCash > 0) {
            resultPush.push(resultList[i]);
          }
        }

        //存在payCash为0的情况,不用调用后端接口,直接比较该list
        var resultPushData = null;
        if (resultPush_NoPayCash.length > 0) {
          resultPushData = this.compareFirstTypeDiscount(resultPush_NoPayCash);
        }
        //没有payCash为0的情况,调用后端接口,计算出每一个互斥结果各自还需要多少储值
        else if (resultPush.length > 0) {
          resultPushData = await this.calculateGasListDiscount(resultPush);
        }
        if (resultPushData === null) return false;
        this.calulatorContext = calculatorContextList.find(x => x.type === resultPushData.type).context;
        this.createOptimalDiscount(resultPushData);
        //如果储值互斥,且最优解释储值  其实已经调用过接口处理了,不用管
        //如果储值不互斥,那最优解中就没有储值项,但是储值支付开启了,所以需要处理储值
        if (this.enableValuePay && !this.valueMutex) {
          await this.culateGasDiscount();
          this.initValue(true);
        }
        return true;
      },
      //存在payCash为0的情况,不用调用后端接口,直接比较该list,并取出优先级最高的
      compareFirstTypeDiscount(resultPush) {
        var typeList = resultPush.sort(function (a, b) {
          return a.type - b.type;
        });
        return typeList[0];
      },

      //没有payCash为0的情况,计算出每一个互斥结果各自还需要多少储值
      async calculateGasListDiscount(resultPush) {
        //能是有惠油吧折扣,调用后端接口
        if (this.enableGsDiscount()) {
          var discountData = [];
          resultPush.forEach(x => {
            discountData.push({
              goodsItemGuid: this.config.gasGun.goodsItemGuid,
              addRuleGuid: null,
              payCash: x.payCash,
              price: this.config.gasGun.price, //价格
              uPayDiscount: x.activity.money,
              memberDiscount: x.discount.money,
              couponDiscount: x.coupon.money,
              pointDiscount: x.point.money,
              deductStaffGuids: this.initialData.staffId,
              totalCash: this.money,
              oilCardMemberGuid: this.childCardGuid,
              isSubOilCard: this.isSubOilCard,
              type: x.type
            });
          });
          let res = await calculateGasOptimalDiscount(discountData);
          console.log('calculateGasOptimalDiscount  res====>>', res);
          if (res.success) {
            var successResultList = res.data.resultList;
            var finalResultList = [];
            for (var i = 0; i < successResultList.length; i++) {
              var data = resultPush.find(x => x.type === successResultList[i].type);
              if (data) {
                let finalPayCash = 0;
                if (data.type === 4) {
                  finalPayCash = Math.subtract(data.payCash, successResultList[i].realValue);
                }
                else {
                  finalPayCash = data.payCash;
                }
                finalResultList.push({ ...data, discountData: successResultList[i], finalPayCash: finalPayCash });
              }
            }
            console.log('finalResultList--->', finalResultList);
            var finalPayList = finalResultList.sort(function (a, b) {
              return a.finalPayCash - b.finalPayCash;
            });
            var finalPayListResult = finalPayList.filter(x => x.finalPayCash === finalPayList[0].finalPayCash);
            if (finalPayListResult.length === 1) {
              return finalPayListResult[0];
            }
            var valuePayList = finalPayListResult.sort(function (a, b) {
              return a.discountData.realValue - b.discountData.realValue;
            });
            var valuePayListResult = valuePayList.filter(x => x.realValue === valuePayList[0].realValue);
            if (valuePayListResult.length === 1) {
              return valuePayListResult[0];
            }
            return this.compareFirstTypeDiscount(valuePayListResult);
          }
        }
        else {
          var payList = resultPush.sort(function (a, b) {
            return a.payCash - b.payCash;
          });
          var payListResult = payList.filter(x => x.payCash === payList[0].payCash);
          if (payListResult.length === 1) {
            return payListResult[0];
          }
          return this.compareFirstTypeDiscount(payList);
          ;
        }
        return null;
      },
      createOptimalDiscount(result) {
        console.log('createOptimalDiscount----', result);
        this.shareList.forEach(e => {
          e.result = result[discountTypes[e.type]];
        });
        this.mutexList.forEach(e => {
          e.result = result[discountTypes[e.type]];
        });
        var mutexItem = this.mutexList.find(x => x.type === result.type);
        if (mutexItem) {
          mutexItem.checked = true;
        }
        if (result.type === 4) {
          this.valueChecked = true;
        }
        this.result = result;
        this.result.goodsItemGuid = this.config.gasGun.goodsItemGuid;
        this.result.typeGuid = this.config.gasGun.typeGuid;
        this.result.gunGuid = this.config.gasGun.guid;
        this.result.price = this.config.gasGun.price;
        var pointResult = result.point;
        if (
          pointResult &&
          pointResult.checkResult &&
          !pointResult.checkResult.success
        ) {
          var mutexPointItem = this.mutexList.find(x => x.type === 3);
          var sharePointItem = this.shareList.find(x => x.type === 3);
          if (mutexPointItem) {
            mutexPointItem.checked = false;
          }
          if (sharePointItem) {
            sharePointItem.checked = false;
          }
        }
        if (result.discountData) {
          this.gasDiscount = result.discountData;
        }
        else {
          this.gasDiscount = null;
        }
      },

      //除储值之外的各种优惠计算,autoSelect:优惠券是否自动选择
      calc(autoSelect) {
        var params = {
          mutex: [],
          share: [],
          config: {
            activity: this.parameter.activity,
            discountParameter: this.parameter.discountParameter
          }
        };
        for (var i = 0; i < 4; i++) {
          params.mutex.push({
            checked: this.mutextChecked(i)
          });
          params.share.push({
            checked: this.shareChecked(i)
          });
        }
        this.calulatorContext = new CalulatorContext();
        var result = this.calulatorContext.calc(
          this.money * 1,
          this.nodiscount * 1,
          this.totalGas * 1,
          params,
          {
            wxcoupon: this.couponSelector,
            autoSelect: autoSelect
          }
        );
        console.log("calc_result-->", result);
        this.shareList.forEach(e => {
          e.result = result[discountTypes[e.type]];
        });
        this.mutexList.forEach(e => {
          e.result = result[discountTypes[e.type]];
        });
        this.result = result;
        this.result.goodsItemGuid = this.config.gasGun.goodsItemGuid;
        this.result.typeGuid = this.config.gasGun.typeGuid;
        this.result.gunGuid = this.config.gasGun.guid;
        this.result.price = this.config.gasGun.price;
        var pointResult = result.point;
        if (
          pointResult &&
          pointResult.checkResult &&
          !pointResult.checkResult.success
        ) {
          var mutexPointItem = this.mutexList.find(x => x.type === 3);
          var sharePointItem = this.shareList.find(x => x.type === 3);
          if (mutexPointItem) {
            mutexPointItem.checked = false;
          }
          if (sharePointItem) {
            sharePointItem.checked = false;
          }
        }
      },

      //互斥优惠变动
      mutextChecked(type) {
        var item = this.mutexList.find(x => x.type === type);
        if (!item) {
          return false;
        }
        return item.checked;
      },

      //共享优惠变动
      shareChecked(type) {
        var item = this.shareList.find(x => x.type === type);
        if (!item) {
          return false;
        }
        return item.checked;
      },

      //互斥优惠手动勾选
      async mutexTap(item) {
        item.checked = !item.checked;
        this.mutexList.forEach((v, i, arr) => {
          if (item.checked && v.type !== item.type) {
            v.checked = false;
          }
        });
        //处理已经勾选的子卡和储值
        if (this.valueMutex) {
          this.clearValue();
          this.fbclassCheck = false;
        }
        await this.selectChange(item);
      },

      //清除储值的勾选
      clearValue() {
        this.valueChecked = false;
        this.isChildCard = false;
      },

      //共享优惠手动勾选
      async shareTap(item) {
        item.checked = !item.checked;
        await this.selectChange(item);
      },

      //优惠手动勾选,重新计算优惠和储值
      async selectChange(item) {
        if (item.type === 2) {
          if (!item.checked) {
            this.calc(false);
            await this.culateGasDiscount();
            this.initValue(true);
            return;
          }
          let mutexHasCoupon = this.mutexList.findIndex(x => x.type === 2);
          if (mutexHasCoupon > -1) {
            this.mutexSwitchCoupon();
          }
          var price = this.calulatorContext.getRemainingMoney(2);
          this.couponSelector.showCoupon(price);
          this.couponState.show = true;
          return;
        }
        var autoSelect = false;
        if (item.type === 0 || item.type === 1) {
          //前两份需要重新选择优惠券
          autoSelect = true;
        }
        this.calc(autoSelect);
        await this.culateGasDiscount();
        this.initValue(false);
      },

      mutexSwitchCoupon() {
        var params = {
          mutex: [],
          share: [],
          config: {
            activity: this.parameter.activity,
            discountParameter: this.parameter.discountParameter
          }
        };
        for (var i = 0; i < 4; i++) {
          params.mutex.push({
            checked: false
          });
          params.share.push({
            checked: this.shareChecked(i)
          });
        }
        this.calulatorContext = new CalulatorContext();
        var result = this.calulatorContext.calc(
          this.money * 1,
          this.nodiscount * 1,
          this.totalGas * 1,
          params,
          {
            wxcoupon: this.couponSelector,
            autoSelect: false
          }
        );
      },

      //是否设置该支付方式
      hasPayType(type) {
        return (this.parameter.payType & type) !== 0;
      },

      //该支付方式是否是互斥
      hasMutex(type) {
        return (this.parameter.payMutex & type) !== 0;
      },

      //储值勾选
      async checkValue(flag) {
        console.log("checkValue_flag", flag);
        if (this.isMutex) {
          //互斥,取消互斥优惠
          let item = this.mutexList.find(e => e.checked === true);
          await this.mutexTap(item);
        }
        //充值免单参数置为fasle
        this.fbclassCheck = false;
        if (flag) {
          //母卡
          if (!this.isCanUseMotherValue) {
            this.isChildCard = false;
            return;
          }
          this.isChildCard = !this.isChildCard;
          if (this.isChildCard) {
            this.addValueChange({});
            this.valueChecked = false;
          }
        }
        else {
          //子卡
          this.valueChecked = !this.valueChecked;
          if (this.valueChecked) {
            this.isChildCard = false;
          }
        }
      },

      //更新储值支付金额
      updateValuePay(now) {
        console.log("addvaluepay", now);
        if (now > 0) {
          if (
            JSON.stringify(this.addValue) !== "{}" &&
            this.addValue.giftType === 6 &&
            !this.fbclassCheck
          ) {
            this.addValue = {};
            this.addValueGsDiscount = null;
          }

          if (this.isChildCard || !this.currentGasDiscount) {
            var avaValue = this.isChildCard
              ? this.motherValue
              : this.parameter.discountParameter.memberAvailableValue;
            this.valuePay = (this.result.payCash < avaValue
              ? +this.result.payCash
              : +avaValue
            ).toFixed(2);
          }
          else {
            this.valuePay = this.currentGasDiscount.realValue;
          }
        }
        else {
          //不勾选储值
          this.valuePay = 0;
          if (!this.fbclassCheck) {
            //不勾选免单
            this.addValue = {};
            this.addValueGsDiscount = null;
          }
        }
      },

      //获取惠油吧折扣
      async culateGasDiscount() {
        //所有金额均被折扣完了,不需要调用接口获取折扣
        if (this.result.payCash === 0) {
          this.gasDiscount = null;
          return;
        }
        if (this.enableGsDiscount()) {
          let result = await calculateGasDiscount({
            goodsItemGuid: this.config.gasGun.goodsItemGuid,
            addRuleGuid: null,
            payCash: this.result.payCash,
            price: this.config.gasGun.price, //价格
            uPayDiscount: this.result.activity.money,
            memberDiscount: this.result.discount.money,
            couponDiscount: this.result.coupon.money,
            pointDiscount: this.result.point.money,
            deductStaffGuids: this.initialData.staffId,
            totalCash: this.money,
            oilCardMemberGuid: this.childCardGuid,
            isSubOilCard: this.isSubOilCard
          });
          if (result.success) {
            this.gasDiscount = result.data;
          }
          else {
            this.gasDiscount = null;
          }
        }
        else {
          this.gasDiscount = null;
        }
      },

      //能否使用惠油吧折扣
      enableGsDiscount() {
        return (
          (this.parameter.payType & 4) > 0 &&
          this.config.gasGun.price > 0 &&
          this.parameter.isMember //通用储值，或者油卡储值已经有子卡的情况
        );
      },

      //点击支付按钮
      async submit() {
        //普通支付,充值规则取选中的充值规则
        let addValue = this.addValue;
        //充值免单支付
        if (this.fbclassCheck) {
          if (this.isMutex) {
            return;
          }
          //充值免单,由于充值规则不赋值,所以需要在这里赋值
          addValue = this.addValueList[0];
        }
        this.confirm(addValue);
      },

      //支付逻辑
      confirm(addValue) {
        //订单提交
        if (this.calcFail) {
          this.$dialog._toast(this.calcMsg);
          return;
        }

        if (this.finalPayType <= 0) {
          this.$dialog._toast("请选择支付方式");
          return;
        }

        if (this.finalPayType === 16 || this.finalPayType === 32) {
          var tips = `${this.finalPayType === 16 ? "现金" : "银行卡"}支付${
            this.finalPayCash
            }元`;
          this.$refs.authcode.showCode(tips).then(code => {
            var pay = new Pay(this.initialData, this.parameter);
            pay.submit(
              this.currentGasDiscount,
              this.finalPayType,
              this.money,
              this.nodiscount,
              this.meno,
              this.result,
              addValue,
              this.valueChecked,
              code,
              this.isChildCard,
              this.childCardGuid,
              this.oilPrice,
              this.isSubOilCard,
              this.totalGas,
              this.config.oilOrderGuid
            );
          });
          return;
        }
        var pay = new Pay(this.initialData, this.parameter);
        pay.submit(
          this.currentGasDiscount,
          this.finalPayType,
          this.money,
          this.nodiscount,
          this.meno,
          this.result,
          addValue,
          this.valueChecked,
          "",
          this.isChildCard,
          this.childCardGuid,
          this.oilPrice,
          this.isSubOilCard,
          this.totalGas,
          this.config.oilOrderGuid
        );
      },

      //勾选充值免单
      async checkfb() {
        if (this.isMutex) {
          let item = this.mutexList.find(e => e.checked === true);
          await this.mutexTap(item);
        }
        if (this.freeBlockData.type === 3) {
          if (JSON.stringify(this.addValue) === "{}") {
            await this.addValueChange(this.addValueList[0]);
          }
          else {
            await this.addValueChange({});
          }
          return;
        }

        this.fbclassCheck = !this.fbclassCheck;
        let addValue = {};
        if (this.fbclassCheck) {
          addValue = this.addValueList[0];
          this.valueChecked = false;
          this.isChildCard = false;
        }
        await this.addValueChange(addValue);
      }
    },
    computed: {
      //...mapGetters(["addValueList"]),
      ...mapState([
        "initialData",
        "parameter",
        "config",
        "currentOilCardName",
        "isCanUseMotherValue",
        "childCardGuid",
        "isSubOilCard"
      ]),
      getSaveCount() {
        //获取每升优惠
        let perDiscount =
          (Number(this.money) - Number(this.result.payCash)) /
          (Number(this.money) / Number(this.config.gasGun.price));
        if (perDiscount > this.config.gasGun.price) {
          perDiscount = this.config.gasGun.price;
        }
        if (this.currentGasDiscount && this.valueChecked) {
          perDiscount += this.currentGasDiscount.discountValue;
        }
        return perDiscount.toFixed(2);
      },

      oilPrice() {
        return this.config.gasGun.price;
      },

      enableValuePay() {
        if (!this.parameter) {
          return false;
        }
        return (this.parameter.payType & 4) !== 0;
      },

      addValueList() {
        if (!this.enableValuePay) {
          return [];
        }
        if (!this.parameter.addValue) {
          return [];
        }
        var result = [];
        let totalPay = 0;
        console.log("gasDiscount", this.gasDiscount);
        if (this.gasDiscount) {
          totalPay = this.gasDiscount.remainMoney;
        }
        else {
          let valpay = Math.min(
            this.result.payCash,
            this.parameter.discountParameter.memberAvailableValue
          );
          totalPay = Math.subtract(this.result.payCash, valpay);
        }
        var payCashRemoveValue = this.result.payCash;
        console.log("pay", totalPay, payCashRemoveValue);

        this.parameter.addValue.forEach(e => {
          if (e.giftType === 6 || e.giftType === 7) {
            if (
              payCashRemoveValue >= e.valueAdd &&
              payCashRemoveValue < e.maxValueAdd
            ) {
              result.push(e);
              return;
            }
            return;
          }
          if (this.money === 0 || e.valueAdd <= payCashRemoveValue) {
            console.log(e, totalPay, "filter", this.result, this.valuePay);
          }
          else {
            result.push(e);
          }
        });
        return result;
      },

      currentGasDiscount() {
        console.log(this.addValueGsDiscount, this.gasDiscount);
        return this.addValueGsDiscount || this.gasDiscount;
      },

      valueMutex() {
        return this.parameter && (this.parameter.payMutex & 16) !== 0;
      },

      isMutex() {
        return this.checkedMutex >= 0 && (this.parameter.payMutex & 16) !== 0;
      },

      checkedMutex() {
        var item = this.mutexList.find(x => x.checked);
        if (item) {
          return item.type;
        }
        return -1;
      },

      motherValue() {
        if (
          this.parameter.childCardInfo.limitValue >
          this.parameter.childCardInfo.motherAvailableValue
        ) {
          return this.parameter.childCardInfo.motherAvailableValue;
        }
        else {
          return this.parameter.childCardInfo.limitValue;
        }
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

      needPay() {
        if (
          !this.isMutex &&
          !this.isChildCard &&
          this.addValue.guid &&
          this.addValue.giftType !== 6 &&
          this.addValue.giftType !== 7
        ) {
          return this.addValue.valueAdd; //选择了充值规则,还需支付金额为充值金额
        }
        else {
          return this.finalPayCash === 0 ? this.valuePay : this.finalPayCash;
        }
      },

      finalPayCash() {
        //最终支付金额
        if (
          JSON.stringify(this.addValue) !== "{}" &&
          this.addValue.giftType !== 6 &&
          this.addValue.giftType !== 7
        ) {
          return this.addValue.valueAdd;
        }
        else {
          if (
            this.fbclassCheck ||
            (JSON.stringify(this.addValue) !== "{}" &&
              this.addValue.giftType === 7)
          ) {
            return this.freeBlockData.addValue;
          }
          if (!this.valueChecked && !this.isChildCard) {
            return this.result.payCash;
          }
          if (this.isChildCard) {
            return Math.subtract(
              Number(this.result.payCash),
              Number(this.valuePay)
            );
          }
          return (
            this.currentGasDiscount || {
              remainMoney: Math.subtract(this.result.payCash, this.valuePay)
            }
          ).remainMoney;
        }
      },

      isFreeAddValueRule() {
        if (!this.addValueList || !this.addValueList.length) {
          return false;
        }
        if (!this.parameter.addValue || !this.parameter.addValue.length) {
          return false;
        }
        return (
          this.parameter.addValue[0].giftType === 6 ||
          this.parameter.addValue[0].giftType === 7
        );
      },

      payButName() {
        if (this.finalPayCash > 0) {
          return this.payTypeState.name;
        }
        return "立即支付";
      },

      payTypeIcon() {
        if (this.finalPayCash > 0) {
          return this.payTypeState.svg || "";
        }
        return "";
      },

      freeBlockData() {
        try {
          if (!this.addValueList || !this.addValueList.length) {
            return {};
          }
          var addValue = this.addValueList[0];
          var avaValue = this.parameter.discountParameter.memberAvailableValue;
          var payCashRemoveValue = this.result.payCash;
          if (addValue.giftType === 6) {
            var addValuePay = Math.mult(
              addValue.freeOrder.times,
              this.result.payCash
            );
            let discount = addValue.freeOrder.discount;
            let subMoney = 0; //扣除的金额
            let type = 1;
            if (discount) {
              let proMoney = Math.fixed(
                Math.mult(payCashRemoveValue, Math.subtract(1, discount)),
                2
              ); //优惠的金额
              subMoney = Math.subtract(payCashRemoveValue, proMoney);
              type = 2;
            }
            return {
              addValue: addValuePay,
              remainMoney: this.addValueGsDiscount
                ? this.addValueGsDiscount.remainValue
                : Math.subtract(Math.add(addValuePay, avaValue), subMoney),
              freeValue: Math.subtract(this.result.payCash, subMoney),
              discount: discount ? Math.mult(10, discount) : null,
              money:
                type === 1
                  ? 0
                  : Math.fixed(
                    Math.mult(payCashRemoveValue, Math.subtract(1, discount)),
                    2
                  ),
              type
            };
          }
          else {
            let dynamicRecharge = addValue.dynamicRecharge;
            let add = Math.mult(
              Math.floor(
                Math.divide(payCashRemoveValue, dynamicRecharge.rechargeDiff)
              ) + 1,
              dynamicRecharge.rechargeDiff
            ); //充值金额

            let send =
              dynamicRecharge.giftType === 1
                ? Math.mult(add, dynamicRecharge.giftValue)
                : dynamicRecharge.giftValue; //赠送金额

            let remain = Math.subtract(
              Math.add(Math.add(add, avaValue), send),
              payCashRemoveValue
            );

            return {
              addValue: add,
              remainMoney: this.addValueGsDiscount
                ? this.addValueGsDiscount.remainValue
                : remain,
              send: send,
              discount: null,
              money: this.result.payCash,
              type: 3
            };
          }
        } catch (e) {
          console.log(e, "12312");
        }
      },

      freeBlockClass() {
        let fbclass = "";
        if (this.fbclassCheck || this.addValue.giftType === 7) {
          fbclass += " block-check";
        }
        return fbclass;
      },

      finalPayType() {
        if (this.valueChecked && this.finalPayCash === 0) {
          return 4;
        }
        if (this.isChildCard && this.finalPayCash === 0) {
          return 4;
        }

        if (
          JSON.stringify(this.addValue) !== "{}" &&
          this.payTypeState.payType > 0
        ) {
          return 4;
        }
        return this.payTypeState.payType;
      }
    },
    watch: {
      async show(now) {
        if (now) {
          this.$nextTick(() => {
            this.onShow(now);
          });
          await sleep(500);
          this.refresh();
        }
        // now ? BodyLocker.lockBody() : BodyLocker.unlockBody();
      },

      valuePayChecked(now) {
        this.updateValuePay(now);
      },

      addValue(now) {
        if (JSON.stringify(now) !== "{}") {
          if (now.giftType == 6) {
            this.valueChecked = false;
            this.isChildCard = false;
          }
          else {
            if (!this.isChildCard) {
              this.valueChecked = true;
              this.isChildCard = false;
            }
          }

          // if (!this.isFreeAddValueRule) {
          this.enableMemberPay = false;
          this.initPayTypeState();
          // }
        }
        else {
          this.enableMemberPay = true;
          this.initPayTypeState();
        }
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../../styles/variable";

  .pay-action {
    border-radius: 10px 10px 0 0;
    background-color: #fff;
    /*padding:0 0 80px;*/
    /*overflow: auto;*/
    /*-webkit-overflow-scrolling: touch;*/
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .pay-action_head

  {
    text-align: center;
    padding: 14px;
    .pay-price

  {
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    .fz(42px);
    &:before

  {
    content: "￥";
    font-size: 12px;
    display: inline-block;
    transform: translateY(-3px);
  }

  }

  .iconfont {
    float: right;
    margin-left: -1em;
    font-size: 20px;
  }

  }

  .pay-action_body {
    .panel

  {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
    font-size: 14px;
    .left

  {
    &.disable

  {
    .val

  {
    color: #e0e0e0;
  }

  }

  width: 70%; > * {
    display: inline;
    vertical-align: middle;
    line-height: 1.5;
  }

  }

  .right {
    .checked

  {
    color: #fe9700;
  }

  .desc {
    font-size: 12px;
    color: #f00;
  }

  }
  }

  .icon-panel {
    .right

  {
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

  .save-text {
    padding: 10px;
    font-size: 0.373333rem;
    color: #ff7541;
    text-align: center;
  }

  .save-count {
    // color: #f00;
    padding-right: 3px;
  }

  .save-detail {
    background-color: #ffefe9;
    padding: 3px;
  }

  }

  .pay-action_foot {
    height: 60px;
    padding: 0 16px;
    background-color: #fff;
    /*box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);*/
    display: flex;
    align-items: center;
  }

  .pay-action_discount {
    .discount-block

  {
    padding: 0 5px 0 10px;
  }

  }

  .pay-action_add-value {
    padding: 0 10px;
    .value-slide

  {
    padding-right: 20px;
    position: relative;
    overflow: hidden;
  }

  .pay-action_add-value_tip {
    font-size: 13px;
    line-height: 2;
  }

  }

  .pay-type-switch {
    padding: 20px;
    color: #999;
    text-align: center;
    .iconfont

  {
    font-size: 10px;
  }

  }

  .rest-value {
    color: #333;
    width: 110px;
    .rest-value_label

  {
    font-size: 12px;
    line-height: 2;
  }

  .rest-value_price {
    font-size: 21px;
    font-weight: bold;
    white-space: nowrap;
    &:before

  {
    content: "￥";
    font-size: 14px;
    display: inline-block;
    transform: translateY(-3px);
  }

  }
  }

  .btn-wrap {
    width: 240px;
    flex: 1;
    button

  {
    background-color: #fe9700;
    border-radius: 5px;
    height: 50px;
    color: #fff;
    font-size: 16px;
    width: 100%;
    svg, span

  {
    display: inline-block;
    vertical-align: middle;
  }

  }
  }

  .free-box {
    padding: 10px 15px 10px 10px;
  }

  .free-block {
    padding: 10px 10px 10px 10px;
    text-align: center;
    position: relative;
    background-color: #f7f7f7;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    &:before

  {
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
    margin-bottom: 10px;
    .title-text

  {
    color: #ff6400;
  }

  }

  .sub-title {
    font-size: 12px;
    color: #666;
    line-height: 1.6;
    i

  {
    color: #ff6400;
  }

  }

  .sub-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #d8d8d8;
  }

  &.mutex-block {
    opacity: 0.4;
  }

  &.block-check {
    border: 1px solid #fe9700;
    background-color: #fff6eb;
    .sub-icon

  {
    color: #fe9700;
  }

  }
  }
  }
</style>
