<template>
  <div class="upay">
    <header class="head" v-if="!parameter.isMember">
<!--      <x-notice-->
<!--              :text="[-->
<!--          parameter.parameter ? parameter.parameter.guidingWord : '开卡享优惠',-->
<!--        ]"-->
<!--              color="#FF721F,#FFE4BC"-->
<!--      ></x-notice>-->
      <div class="link-btn" @click="reidrectToRegister">免费开卡</div>
    </header>
    <header
            class="head"
            v-if="
        parameter.isMember &&
        parameter.parameter &&
        parameter.parameter.advertise
      "
    >
<!--      <x-notice-->
<!--              @goto="goto"-->
<!--              :text="[parameter.parameter.advertise]"-->
<!--              color="#FF721F,#FFE4BC"-->
<!--      ></x-notice>-->
    </header>
    <section class="content">
      <h3 class="account-name">
        {{ initialData.staffName }} ({{ initialData.staffAccount }})
      </h3>
      <div
              v-if="initialData"
              class="block gas-gun"
              @click="showGasPicker"
              :class="status.gasShow ? 'gas-gun-active' : ''"
      >
        <div class="panel" style="line-height: 48px;">
          <div class="left">油品</div>
          <div class="right">
            <template v-if="config.gasGun.guid">
              <b>{{ config.gasGun.gunName }}</b>
              <b>{{ config.gasGun.gsName }}</b>
            </template>
            <span v-else style="color: #999;">请选择</span>
          </div>
        </div>
        <close-panel :open="config.gasGun &&
              config.gasGun.guid &&
              !(config.gasGun.price === 0 || config.gasGun.price === 1)" :staticHeight="40" style="margin-top: -10px;">
          <div
                  class="panel close"
                  style="align-items: baseline;"
          >
            <p class="text val" v-if="config.gasGun.price > 0">
              <span
              >￥{{ config.gasGun.price }}/{{
                  config.gasGun.unit || "升"
                }}</span
              >
              <span
                      v-if="config.gasGun.marketPrice > config.gasGun.price"
                      class="del-line"
              >￥{{ config.gasGun.marketPrice }}/{{
                  config.gasGun.unit || "升"
                }}</span
              >
            </p>
            <p class="text val" v-if="totalGas > 0">
              共计: {{ totalGas }}{{ config.gasGun.unit || "升" }}
            </p>
          </div>
        </close-panel>
      </div>
      <div class="block total" :class="{ active: keyboardTarget === 'money' }">
        <div class="panel" @click="callKeyboard('money')">
          <div class="left">
            <span class="text">买单金额</span>
          </div>
          <div class="right">
            <span
                    class="text price large"
                    style="color: #333; line-height: 1.2;"
            >{{ money }}</span
            >
            <span class="cursor"></span>
          </div>
        </div>
      </div>
      <div v-if="meno || menoTip" class="leave-word">
        <i class="iconfont icon-icon07"></i>
        <input v-model="meno" type="text" :placeholder="menoTip"/>
        <i class="line"></i>
      </div>
    </section>

    <footer class="foot" v-show="parameter.enableDispenser">
      <button @click="confirmPay" class="confirm-btn btn">确认买单</button>
    </footer>

    <gasgun-action
            v-if="(initialData&&!initialData.oilGunGuid)"
            @confirm="selectOrderConfirm"
            :options="gslist"
            v-model="config.gasGun"
            :show="status.gasShow"
            @show="setShow"
    />
    <!--            :show.sync="status.gasShow"-->
    <confirm-action
            :show.sync="distanceShow"
            :disType="disType"
            :disMessage="disMessage"
            :distance="distance"
            :gsStoreName="initialData.storeName"
            @confirm="load"
    />
    <number-keyboard
            ref="keyboard"
            @confirm="confirmPay"
            :initValue.sync="keyboardInitVal"
            v-show="!parameter.enableDispenser"
            @input="numberInput"
    />

    <!--    <PayAction-->
    <!--            :money="+money"-->
    <!--            :meno="getMeno"-->
    <!--            :nodiscount="+nodiscount"-->
    <!--            :show.sync="status.payShow"-->
    <!--            :totalGas="+totalGas"-->
    <!--            :unit="config.gasGun.unit || '升'"-->
<!--    />-->
  </div>
</template>

<script>
  const paytypes = {
	ali: 1,
	wecaht: 2,
	value: 4,
	point: 8,
	cash: 16,
	bankcard: 32,
	coupon: 64,
	best: 512,
	credit: 1024,
  };

  import GlobalFunction from "../../../javascripts/mixins/globalFunction.js";
  import calc from "../../../javascripts/libs/calc";
  import ClosePanel from "../../../components/close-panel";
  import Btn from "../../../components/btn";
  import GasgunAction from "./children/gasgun-action.vue";
  import PayAction from "./children/PayAction";
  import NumberKeyboard from "./children/keyboard.vue";
  import GetUserPosition from "../../../javascripts/mixins/getUserPosition";
  import ConfirmAction from "./children/confirm-action.vue";
  import getClient from "./js/mqtt";
  import {
	getRegisterUrl,
	getMemberDiscount,
	getGsActivity,
	getOilCardInfo,
	getDistance,
  } from "../../../javascripts/api/gs-api";
  import {getParams} from "../../../javascripts/libs/libs";
  import {mapState, mapGetters} from "vuex";

  export default {
	name: "gs-pay",
	components: {
	  ClosePanel,
	  NumberKeyboard,
	  Btn,
	  PayAction,
	  GasgunAction,
	  ConfirmAction,
	},
	mixins: [GlobalFunction, GetUserPosition],
	data() {
	  return {
		status: {
		  gasShow: false,
		  payShow: false,
		},
		number: 0,
		money: 0,
		nodiscount: 0,
		keyboardInitVal: "0",
		keyboardTarget: "",
		couponSelector: {},
		result: {
		  payCash: 0,
		},
		meno: "",
		childCardGuid: "",
		currentOilCardName: "",
		memberCardAvailableValue: 0,
		mutexList: [],
		shareList: [],
		localLat: "",
		localLon: "",
		distanceShow: false,
		disType: 0,
		disMessage: "",
		distance: 0,
	  };
	},
	async created() {
	  const data = {
		"staffId": "1b4a86ba-3fef-11e9-9b0d-20040fed9860", "storeId": "092a7168-6fcc-e211-81c9-90b11c47e696", "organizationGuid": "668cf346-a627-e411-a604-90b11c47e695", "account": "0228001", "oilGunGuid": null,
		"goodsItemTypeGuid": "45569811-b812-11e8-9f73-0010185de866", "printUserAccount": null, "oilGunInfo": null, "money": 0, "timestamp": 0, "staffName": "12348888", "staffAccount": "80808080", "storeLatitude": 30.656008,
		"storeLongitude": 104.078946, "distanceLimit": false, "storeName": "汇海百货"
	  };
	  this.$store.commit("SET_INITIAL_DATA", data);

	  if (this.initialData.distanceLimit) {
		await this.getPosition(); //定位
	  }
	  else {
		await this.load();
	  }
	},
	methods: {

	  setShow(v) {
	    console.log('set show', v)
		this.status.gasShow = v;
	  },

	  async load() {
		await this.loadParameter();
		if (this.initialData.oilGunGuid && !this.parameter.enableDispenser) {
		  this.config.gasGun = this.initialData.oilGunInfo;
		  await this.selectGs();
		  if (this.initialData.money) {
			this.money = this.initialData.money;
		  }
		}
		else {
		  this.status.gasShow = true;
		}

		if (this.parameter.enableDispenser) {
		  this.listenMqtt(this.mtqqConfig);
		}

		// this.mockPick();
	  },
	  async listenMqtt(mtqqConfig) {
		let client = getClient(mtqqConfig.servers, mtqqConfig.clientId);

		let topic = mtqqConfig.topic;

		client.on('connect', e => {
		  client.subscribe(topic, {qos: 2}, (err) => {
			if (err) {
			  console.log("client error:", err);
			}
		  });
		});
		client.on('reconnect', function () {
		  console.log('client reconnect');
		});
		client.on('message', (msgTopic, message) => {
		  console.log("on message", msgTopic, message);
		  if (topic !== msgTopic) {
			return;
		  }
		  this.$store.dispatch("get_orders");
		});
	  },
	  async showGasPicker() {
		this.status.gasShow = true;
		if (this.parameter.enableDispenser) {
		  this.money = 0;
		  this.config.gasGun = {};
		  this.$store.commit("SET_CONFIG", this.config);
		}
	  },
	  async getPosition() {
		this.$dialog._loading();
		if (!this.initialData.storeLatitude || !this.initialData.storeLongitude) {
		  this.disType = 2;
		  this.disMessage = "门店没有标记位置：油站没有标记位置，请联系商家设置";
		  this.distanceShow = true;
		  this.$dialog._unLoading();
		  return;
		}
		let pos = null;
		try {
		  pos = await this.getUserPosition(); //允许并成功
		  console.log("pos", pos);
		  let {lat, lng} = pos;
		  this.localLat = lat;
		  this.localLon = lng;
		} catch (err) {
		  console.log(err, "error or reject");
		  this.disType = 2;
		  let message =
			  err.errMsg || "获取定位失败，无法买单，请检查定位设置并重试";
		  if (
			  message === "getLocation:cancel" ||
			  message === "getLocation:fail"
		  ) {
			message = "获取定位失败，无法买单，请开启定位功能并重试";
		  }
		  if (message === "getLocation:timeout") {
			message = "获取定位超时，请重新打开页面";
		  }
		  this.disMessage = message;
		  this.distanceShow = true;
		  this.$dialog._unLoading();
		  return;
		}
		await this.getStoreDistance();
	  },
	  async getStoreDistance() {
		let result = await getDistance(
			this.initialData.storeLatitude,
			this.initialData.storeLongitude,
			this.localLat,
			this.localLon
		);
		console.log("getStoreDistance=", result);
		this.distance = result.data.distance;
		if (this.distance < 0) {
		  this.distanceShow = true;
		  this.disType = 2;
		  this.disMessage = "获取定位失败，无法买单，请检查定位设置并重试";
		  this.$dialog._unLoading();
		}
		else if (this.distance > 200) {
		  this.distanceShow = true;
		  this.disType = 2;
		  this.disMessage = "当前位置距离油站过远，无法买单，请到油站内买单";
		  this.$dialog._unLoading();
		}
		else {
		  this.distanceShow = false;
		  await this.load();
		}
	  },
	  mockPick() {
		if (PRODUCTION) return;
		this.status.gasShow = false;
		this.config.gasGun = this.gslist[0];
		this.money = "500";
		this.confirmPay();
	  },

	  isShowGasGun() {
		if (this.initialData && !this.initialData.oilGunGuid) {
		  this.status.gasShow = true;
		}
	  },

	  goto() {
		if (this.parameter.parameter.advertiseAction === "") return;
		let action = JSON.parse(this.parameter.parameter.advertiseAction);
		if (action.type === 0) {
		  var params = getParams();
		  if (this.parameter.valueMode === 1) {
			window.location.href = `/Pay/MemberAddValue?storeGuid=${
				this.initialData.storeId
			}&staffGuid=${this.initialData.staffId}&bid=${
				params.bid
			}&callbackUrl=${encodeURIComponent(window.location.href)}`;
			return;
		  }
		  var url =
			  "/GsPay/ChooseOilType?bid=" +
			  params.bid +
			  "&callbackUrl=" +
			  encodeURIComponent(window.location.href) +
			  "&storeGuid=" +
			  this.initialData.storeId +
			  "&staffGuid=" +
			  this.initialData.staffId;
		  window.location.href = url;
		}
		else {
		  window.location.href = action.url;
		}
	  },

	  async loadParameter() {
		const result = await this.$store.dispatch("get_parameter");

		console.log(result, "<-----result");
		if (!result.success) return;

		if (
			(!result.data.guns || result.data.guns.length < 1) &&
			result.data.message
		) {
		  let url = `/Common/Error?err_msg=${result.data.message}`;
		  window.location.href = url;
		  return;
		}
		this.memberCardAvailableValue = this.parameter.discountParameter.memberAvailableValue;
	  },

	  async loadGsActivity() {
		let result = await getGsActivity(
			this.initialData.storeId,
			this.config.gasGun.goodsItemGuid
		);
		if (result.success) {
		  this.$store.commit("SET_PARAMETER", {
			...this.parameter,
			activity: result.data,
		  });
		}
		return result;
	  },

	  numberInput(val) {
		if (this.keyboardTarget === "money") {
		  this.nodiscount = "";
		}
		else {
		  if (this.money * 1 < val) {
			this.$refs.keyboard.reset(this.nodiscount);
			return;
		  }
		}
		if (this.keyboardTarget) {
		  this[this.keyboardTarget] = val;
		}
	  },

	  callKeyboard(key) {
		if (this.parameter.enableDispenser) {
		  return;
		}

		if (this.config.gasGun && this.config.gasGun.guid) {
		  this.$refs.keyboard.reset(this[key]);
		  this.keyboardTarget = key;
		  return;
		}
		this.$dialog._toast("请先选择油枪/油品！");
	  },

	  callPayAction() {
		this.status.payShow = true;
	  },

	  async selectGs() {
		console.log(this.config, "this.config");
		this.$store.commit("SET_CONFIG", this.config);
		this.keyboardTarget = "";
		if (!this.initialData.money) {
		  this.callKeyboard("money");
		}
		this.selectChildCard();
	  },

	  async selectOrderConfirm(result) {
		if (!this.parameter.enableDispenser) {
		  this.selectGs();
		  return;
		}

		if (!result.success) {
		  return;
		}
		console.log(result, 2222);
		this.config.oilOrderGuid = result.value.oilOrderGuid;
		this.$store.commit("SET_CONFIG", this.config);
		this.money = result.value.price;
		this.selectChildCard();
	  },

	  async selectChildCard() {
		this.$store.commit("SET_IS_SUB_OIL_CARD", false);
		let valueMode = this.parameter.valueMode;
		if (
			!this.config.gasGun.typeGuid ||
			(this.parameter.payType & paytypes.value) === 0
		) {
		  this.$store.commit("SET_CHILD_CARD_GUID", "");
		  this.$store.commit("SET_PARAMETER", {
			...this.parameter,
			discountParameter: {
			  ...(this.parameter.discountParameter || {}),
			  memberAvailableValue: 0,
			},
		  });
		  this.$store.commit("SET_CAN_USE_MOTHER_VALUE", false);
		  return;
		}

		if (valueMode === 0) {
		  if (this.parameter.isMember) {
			this.$store.commit(
				"SET_CURRENT_OIL_CARD_NAME",
				this.parameter.memberGroupName
			);
		  }
		  else {
			this.$store.commit(
				"SET_CURRENT_OIL_CARD_NAME",
				this.config.gasGun.oilCardName
			);
		  }

		  var result = await getOilCardInfo(
			  this.config.gasGun.typeGuid,
			  this.initialData.storeId
		  );
		  if (!result.success) {
			this.$dialog._toast(result.message);
			return;
		  }
		  this.$store.commit("SET_PARAMETER", {
			...this.parameter,
			register: result.data.register,
			addValue: result.data.addValueRules,
		  });
		}

		let isCanUseMotherValue =
			this.parameter.childCardInfo && //有母卡的情况下，如果消费项目对上了，或者是通用储值模式，可以使用母卡支付
			(this.parameter.motherGoodsItemTypeGuid ===
				this.config.gasGun.typeGuid ||
				valueMode === 1);
		this.$store.commit("SET_CAN_USE_MOTHER_VALUE", isCanUseMotherValue);
		if (
			this.parameter.goodsItemTypeGuid === this.config.gasGun.typeGuid ||
			valueMode === 1 //通用储值模式或者消费项目匹配上了，可以使用自己的储值
		) {
		  this.$store.commit("SET_PARAMETER", {
			...this.parameter,
			discountParameter: {
			  ...(this.parameter.discountParameter || {}),
			  memberAvailableValue: this.memberCardAvailableValue,
			},
		  });
		  this.$store.commit("SET_CHILD_CARD_GUID", "");
		  return;
		}

		if (this.parameter.childCardList && valueMode === 0) {
		  this.$store.commit("SET_IS_SUB_OIL_CARD", true);
		  //只用特殊储值模式才能使用子卡支付
		  let childCard = this.parameter.childCardList.find(
			  (t) => t.goodsItemTypeGuid === this.config.gasGun.typeGuid
		  );
		  this.$store.commit(
			  "SET_CURRENT_OIL_CARD_NAME",
			  this.config.gasGun.oilCardName
		  );
		  if (childCard) {
			this.$store.commit("SET_CHILD_CARD_GUID", childCard.guid);
			this.$store.commit("SET_PARAMETER", {
			  ...this.parameter,
			  discountParameter: {
				...(this.parameter.discountParameter || {}),
				memberAvailableValue: childCard.availableValue,
			  },
			});
			this.$store.commit(
				"SET_CURRENT_OIL_CARD_NAME",
				childCard.memberGroupName
			);
			return;
		  }
		}

		this.$store.commit("SET_CHILD_CARD_GUID", "");
		this.$store.commit("SET_PARAMETER", {
		  ...this.parameter,
		  discountParameter: {
			...(this.parameter.discountParameter || {}),
			memberAvailableValue: 0,
		  },
		});
	  },

	  async confirmPay() {
		if (!this.money || this.money * 1 <= 0) {
		  this.$dialog._toast("请先输入买单金额！");
		  return;
		}
		const task = [];
		const getCoupon = () =>
			this.$store.dispatch("get_couponList", {
			  storeId: this.initialData.storeId,
			  guid: this.config.gasGun.goodsItemGuid,
			});
		if (this.config.gasGun.goodsItemGuid && this.parameter.isMember) {
		  task.push(getCoupon);
		  task.push(this.getDisCount);
		}
		task.push(this.loadGsActivity);
		this.$dialog._loading();
		let reqData = await this.requestAll(task);
		console.log("reqData", reqData);
		if (!reqData.success) {
		  this.$dialog._unLoading();
		  this.$dialog._toast(reqData.data);
		  return;
		}
		let errData = reqData.data.filter((x) => x).find((x) => !x.success);
		if (errData) {
		  this.$dialog._unLoading();
		  this.$dialog._toast(errData.message);
		  return;
		}
		this.$dialog._unLoading();
		this.$store.commit("SET_MONEY", this.money);
		this.status.payShow = true;
	  },

	  requestAll(task) {
		return Promise.all(task.map((t) => t()))
			.then((res) => Promise.resolve({success: true, data: res}))
			.catch((err) => Promise.resolve({success: false, data: err}));
	  },

	  async reidrectToRegister() {
		// working on
		let callbackUrl = encodeURIComponent(window.location.href);
		let goodsItemTypeGuid = this.initialData.goodsItemTypeGuid; //油类
		if (this.initialData.oilGunInfo && this.initialData.oilGunInfo.typeGuid) {
		  goodsItemTypeGuid = this.initialData.oilGunInfo.typeGuid; //油枪
		}
		window.location.href = `/GsPay/ChooseOilCardType?staffGuid=${this.initialData.staffId}&storeGuid=${this.initialData.storeId}&goodsItemTypeGuid=${goodsItemTypeGuid}&callbackurl=${callbackUrl}`;
		return;
		if (this.initialData.organizationGuid) {
		  var result = await getRegisterUrl(
			  this.initialData.staffId,
			  this.initialData.organizationGuid
		  );
		  window.location.href = result.data;
		}
	  },
	  async getDisCount() {
		let result = await getMemberDiscount(
			this.initialData.storeId,
			this.config.gasGun.goodsItemGuid,
			this.money
		);
		if (result.success) {
		  //更新parameter中的参数
		  this.$store.commit("SET_PARAMETER", {
			...this.parameter,
			discountParameter: {
			  ...(this.parameter.discountParameter || {}),
			  memberDiscount: result.data.memberDiscount,
			  discountType: result.data.discountType,
			  perLitreDiscount: result.data.perLitreDiscount,
			  ruleGuid: result.data.ruleGuid,
			},
		  });
		}
		return result;
	  },
	},
	computed: {
	  menoTip() {
		if (
			!this.parameter ||
			!this.parameter.parameter ||
			!this.parameter.parameter.memoTip
		) {
		  return "添加备注信息";
		}
		return this.parameter.parameter.memoTip;
	  },

	  totalGas() {
		let gun = this.config.gasGun;
		if (!gun || gun == {} || gun.price === 0 || !this.money) {
		  return 0;
		}
		var r = calc.toDecimal(calc.divide(this.money, gun.price));
		return r;
	  },

	  getMeno() {
		let menoStr = "";
		if (this.config.gasGun.gunName) {
		  menoStr = `[${this.config.gasGun.gunName}]`;
		}
		menoStr = menoStr + this.meno;
		return menoStr;
	  },
	  // vuex提供的帮助函数,实际上就是将vuex里的字段映射为本组件的属性
	  // 同名的,可以用数组
	  ...mapState([
		"initialData",
		"parameter",
		"gasDiscount",
		"config",
		"isSubOilCard",
		"mtqqConfig"
	  ]),
	  // 要在本页面使用其他别名,使用对象形式
	  ...mapState({
		gslist: "gunList",
	  }),
	},
	watch: {},
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../styles/variable";

  .x-toast .center {
    z-index: 100;
  }

  html,
  body {
    width: 100%;
  }

  .locked-body {
    overflow: hidden;
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
  }

  .upay {
    min-height: 100vh;
    background-color: #eee;
    padding-bottom: 300px;
    position: relative;

    * {
      line-height: inherit;
    }

    .del-line {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }

    .iconfont {
      color: @grayC;
    }

    .f15;

    .head {
      height: 40px;
      overflow: hidden;
      background-color: #ffe4bc;
      padding-top: 4px;

      .link-btn {
        .br;
        padding: 7px 10px;
        background-color: #fe9700;
        color: #fff;
        position: absolute;
        right: 10px;
        top: 7px;
      }
    }

    .content {
      padding: 10px;
    }

    .foot {
      padding: 10px 15px;

      .btn {
        width: 100%;
        background-color: #fe9700;
        border-color: #fe9700;
        color: #fff;
        .f16;
        .br;
      }
    }

    .btn {
      padding: 13px 15px;
      background-color: #fff;
      border: 1px solid #e5e5e5;
      position: relative;

      &:active {
        &:before {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .confirm-btn {
      background-color: #ffbd47;
      color: #fff;
      border-color: #ffbd47;
    }

    .account-name {
      text-align: center;
      line-height: 1.5;
      padding: 5px 0 15px;
      color: #999;
    }

    .gas-gun {
      .sub {
        .f14;
        color: @grayC;
      }

      .close {
        .text {
          text-align: right;
          line-height: 1;
        }
      }

      .up {
        transform: rotateZ(90deg);
      }

      .down {
        transform: rotateZ(90deg);
      }

      &.gas-gun-active {
        border-color: #ff9f1b;
        position: relative;
        z-index: 21;
      }

      .panel {
        b {
          font-weight: 500;
        }
      }

      .close {
        font-size: 13px;
      }
    }

    .total {
      position: relative;

      &:after {
        content: "";
        position: absolute;
        bottom: 5px;
        right: 5px;
        top: 5px;
        border-left: 1px solid #ff9700;
        opacity: 0;
      }

      &.active {
        &:after {
          opacity: 1;
          animation: blink 1s linear infinite;
        }
      }
    }

    .avoid {
      overflow: hidden;
    }

    .tip {
      .f14;
      margin-bottom: 10px;
    }

    .leave-word {
      display: flex;
      position: relative;
      align-items: center;

      .iconfont {
        margin-right: -1em;
        margin-top: -4px;
      }

      .line {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        border-bottom: 1px solid #ff9700;
        transform: scaleX(0);
        transition: 0.2s;
      }

      input {
        padding: 0 10px 0 1.5em;
        background-color: transparent;
        border: none;
        height: 44px;
        flex: 1;

        &:focus {
          & + .line {
            transform: scaleX(1);
          }
        }
      }
    }

    .insurance {
      height: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
      }

      .img {
        display: inline-block;
        height: 20px;
        width: 64px;
        background-image: url(/static/insurance.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    .gs-block {
      .panel {
        height: 55px;
      }
    }

    .block {
      .br;
      padding: 0 10px;
      background-color: #fff;
      margin-bottom: 10px;
      border: 1px solid transparent;

      &.active {
        border-color: #ff9f1b;
        position: relative;
      }

      .block-title {
        font-weight: 600;
      }
    }

    .panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .close {
      overflow: hidden;
      padding: 14px 0;
    }

    .text {
      line-height: 48px;
      .f15;
    }

    .price {
      color: #ff9f1b;

      &:before {
        content: "￥";
        .f12;
      }

      &.large {
        .fz(62px);
      }
    }

    .gray {
      color: @grayC;
    }

    .val {
      color: #ff9f1b;
    }
  }
</style>

<style lang="less">
  @import "../../../styles/variable";

  .action {
    position: fixed !important;

    .bottom {
      background-color: transparent !important;
    }
  }

  .van-notice-bar {
    background-color: #ffe4bc;
    color: #ff721f;
    .f16;
  }

  .van-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
<style lang="less">
  @keyframes blink {
    0% {
      opacity: 0;
    }
    49% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  .text-yellow {
    color: #ff9700;
  }

  .action-head {
    display: flex;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 8px 8px 0 0;

    .iconfont {
      position: absolute;
      right: 10px;
    }
  }

  [class*="van-hairline"] {
    position: relative;
  }

  [class*="van-hairline"]::after {
    content: " ";
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    border: 0 solid #ebedf0;
  }

  .van-hairline--top::after {
    border-top-width: 1px; /*px*/
  }

  .van-hairline--left::after {
    border-left-width: 1px; /*px*/
  }

  .van-hairline--right::after {
    border-right-width: 1px; /*px*/
  }

  .van-hairline--bottom::after {
    border-bottom-width: 1px; /*px*/
  }

  .van-hairline--top-bottom::after {
    border-width: 1px 0; /*px*/
  }

  .van-hairline--surround::after {
    border-width: 1px; /*px*/
  }
</style>
