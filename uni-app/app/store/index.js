import Vue from "vue";
import VueX from "vuex";
import * as API from "javascripts/api/gs-api";

Vue.use(VueX);

export default new VueX.Store({
  state: {
	initialData: {},
	parameter: {
	  discountParameter: {},
	  enableDispenser: true,//默认启用油机,即默认隐藏键盘
	},
	gasDiscount: {},
	gunList: [{"guid":"5e833269-bbeb-11e8-9f73-0010185de866","gunName":"1号油枪","gsName":"92号汽油（A站）","goodsItemGuid":"9c4e20ae-b890-11e8-9f73-0010185de866","price":1,"typeGuid":"45569811-b812-11e8-9f73-0010185de866","marketPrice":7,"isOpenChainStoreOilPrice":false,"disable":false,"reason":null,"oilCardName":null,"unit":"升","orders":[]},{"guid":"8d5b1f8e-bbef-11e8-9f73-0010185de866","gunName":"2号油枪","gsName":"95号汽油","goodsItemGuid":"a2df4894-b890-11e8-9f73-0010185de866","price":5,"typeGuid":"45569811-b812-11e8-9f73-0010185de866","marketPrice":8,"isOpenChainStoreOilPrice":false,"disable":false,"reason":null,"oilCardName":null,"unit":"升","orders":[]},{"guid":"ddb646bf-bbef-11e8-9f73-0010185de866","gunName":"3号油枪","gsName":"98号汽油2","goodsItemGuid":"a9312182-b890-11e8-9f73-0010185de866","price":1.1,"typeGuid":"45569811-b812-11e8-9f73-0010185de866","marketPrice":9,"isOpenChainStoreOilPrice":false,"disable":false,"reason":null,"oilCardName":null,"unit":"升","orders":[]},{"guid":"08d78cd1-1bf7-b240-f145-defd32b2b56a","gunName":"7号油枪","gsName":"98号汽油2","goodsItemGuid":"a9312182-b890-11e8-9f73-0010185de866","price":1.1,"typeGuid":"45569811-b812-11e8-9f73-0010185de866","marketPrice":9,"isOpenChainStoreOilPrice":false,"disable":false,"reason":null,"oilCardName":null,"unit":"升","orders":[]},{"guid":"08d7cf8f-6abb-c794-354e-714e8adf7d5c","gunName":"10号油枪","gsName":"001100","goodsItemGuid":"3dc6d8c2-08e8-11e9-a8a2-0010185de866","price":1,"typeGuid":"45569811-b812-11e8-9f73-0010185de866","marketPrice":0,"isOpenChainStoreOilPrice":false,"disable":false,"reason":null,"oilCardName":null,"unit":"","orders":[]}],
	couponList: [[], []],
	money: 0,
	config: {
	  gasGun: {}, // 油枪
	  oilOrderGuid: "",
	},
	isCanUseMotherValue: false,
	currentOilCardName: "",
	childCardGuid: "",
	isSubOilCard: false, // 是否是子油卡
	perLitreText: "",
	mtqqConfig: {}
  },
  mutations: {
	SET_INITIAL_DATA: (state, data) => (state.initialData = data),
	SET_GAS_DISCOUNT: (state, data) => (state.gasDiscount = data),
	SET_PARAMETER: (state, data) => (state.parameter = data),
	SET_GUN_LIST: (state, list) => (state.gunList = list),
	SET_COUPON_LIST: (state, list) => (state.couponList = list),
	SET_MONEY: (state, data) => (state.money = data),
	SET_CONFIG: (state, data) => (state.config = data),
	SET_CAN_USE_MOTHER_VALUE: (state, data) =>
		(state.isCanUseMotherValue = data),
	SET_CURRENT_OIL_CARD_NAME: (state, data) =>
		(state.currentOilCardName = data),
	SET_CHILD_CARD_GUID: (state, data) => (state.childCardGuid = data),
	SET_IS_SUB_OIL_CARD: (state, data) => (state.isSubOilCard = data),
	SET_PERLITRE_TEXT: (state, data) => (state.perLitreText = data),
	SET_MQTT_CONFIG: (state, data) => (state.mtqqConfig = data)
  },
  actions: {
	async get_parameter({commit, state}) {
	  const result = await API.getPayInfo(
		  state.initialData.storeId,
		  state.initialData.goodsItemTypeGuid,
		  state.initialData.oilGunGuid
	  );
	  if (result.success) {
		commit("SET_GUN_LIST", result.data.guns);
		commit("SET_PARAMETER", result.data.parameter);
		commit("SET_MQTT_CONFIG", result.data.mtqqConfig);
	  }
	  return result;
	},

	async get_orders({commit, state}) {
	  let result = await API.getNoPayOrderList(
		  state.initialData.storeId,
	  );
	  if (!result.success) {
		return;
	  }
	  let resultList = result.data.orders;

	  const newGuns = state.gunList.map((it) => {
		const newOrders = resultList.filter(
			(order) => order.oilGunGuid === it.guid
		);
		return {...it, orders: newOrders};
	  });
	  commit("SET_GUN_LIST", newGuns);
	},

	async get_couponList({commit}, data) {
	  const result = await API.getCoupons(data.storeId, data.guid);
	  if (result.success && result.data.coupons) {
		let rl = [];
		for (let i = 0; i < result.data.coupons.length; i++) {
		  let item = result.data.coupons[i];
		  rl.push({
			...item,
			count: 0,
			enableCount: item.number,
			isCheck: false,
			enabled: true,
		  });
		}
		const list = [
		  Array.findAll(rl, (e) => e.couponType === 2),
		  Array.findAll(rl, (e) => e.couponType === 3),
		];
		commit("SET_COUPON_LIST", list);
	  }
	  return result;
	},
  },

  getters: {
	//memberCardAvailableValue: state => state.parameter ? state.parameter.discountParameter.memberAvailableValue : 0,
	// addValueList: state => {
	//   if (!PRODUCTION) return [
	//   {
	//     "guid": "08d76062-4917-946b-84c1-f0afdd76c747", "valueAdd": 1, "maxValueAdd": 1, "giftType": 2, "firstArrivalValue": 1112, "sendCouponDesc": "", "sendGameDesc": "", "totalValuePlusInfo": "送1111.00元",
	//     "addValueRuleInfo": "首次到账1112.00元", "valuePlus": 1111, "firstGiftIntervalDays": 0, "sendValue": 1111, "pointPlus": 0, "intervalDays": 0, "intervalPlus": 0, "intervalCount": 0, "giftMode": 1, "subTitle": "送1111.0元",
	//     "subTitles": ["送1111.0元"], "couponDetailList": [], "isDefault": false, "oilDecreaseList": null, "oilDecreaseDescList": null, "times": 0
	//   },
	//   {
	//     "guid": "08d76062-4917-9b58-1f0f-86ea4a9f819f", "valueAdd": 2, "maxValueAdd": 2, "giftType": 2, "firstArrivalValue": 2224, "sendCouponDesc": "", "sendGameDesc": "", "totalValuePlusInfo": "送2222.00元",
	//     "addValueRuleInfo": "首次到账2224.00元", "valuePlus": 2222, "firstGiftIntervalDays": 0, "sendValue": 2222, "pointPlus": 0, "intervalDays": 0, "intervalPlus": 0, "intervalCount": 0, "giftMode": 1, "subTitle": "送2222.0元",
	//     "subTitles": ["送2222.0元"], "couponDetailList": [], "isDefault": false, "oilDecreaseList": null, "oilDecreaseDescList": null, "times": 0
	//   },
	//   {
	//     "guid": "08d76062-4917-9e00-cc61-8983fedd6589", "valueAdd": 3, "maxValueAdd": 3, "giftType": 2, "firstArrivalValue": 3336, "sendCouponDesc": "", "sendGameDesc": "", "totalValuePlusInfo": "送3333.00元",
	//     "addValueRuleInfo": "首次到账3336.00元", "valuePlus": 3333, "firstGiftIntervalDays": 0, "sendValue": 3333, "pointPlus": 0, "intervalDays": 0, "intervalPlus": 0, "intervalCount": 0, "giftMode": 1, "subTitle": "送3333.0元",
	//     "subTitles": ["送3333.0元"], "couponDetailList": [], "isDefault": false, "oilDecreaseList": null, "oilDecreaseDescList": null, "times": 0
	//   },
	//   {
	//     "guid": "08d76062-4917-9e00-cc61-8983fedd6579", "valueAdd": 3, "maxValueAdd": 3, "giftType": 2, "firstArrivalValue": 3336, "sendCouponDesc": "", "sendGameDesc": "", "totalValuePlusInfo": "送3333.00元",
	//     "addValueRuleInfo": "首次到账3336.00元", "valuePlus": 3333, "firstGiftIntervalDays": 0, "sendValue": 3333, "pointPlus": 0, "intervalDays": 0, "intervalPlus": 0, "intervalCount": 0, "giftMode": 1, "subTitle": "送3333.0元",
	//     "subTitles": ["送3333.0元"], "couponDetailList": [], "isDefault": false, "oilDecreaseList": null, "oilDecreaseDescList": null, "times": 0
	//   }
	// ];
	//   if (!state.parameter.addValue) return [];
	//   const result = [];
	//   let totalPay = 0;
	//   if (state.gasDiscount) {
	// 	totalPay = state.gasDiscount.remainMoney;
	//   }
	//   else {
	// 	const payCash = 0;// this.result.payCash
	// 	let valpay = Math.min(
	// 		payCash,
	// 		state.parameter.discountParameter.memberAvailableValue
	// 	);
	// 	totalPay = Math.subtract(payCash, valpay);
	//   }
	//   state.parameter.addValue.forEach(e => {
	// 	if (e.giftType === 6) {
	// 	  if (this.money >= e.valueAdd) {
	// 		result.push(e);
	// 		return;
	// 	  }
	// 	}
	// 	if (totalPay === 0 || e.valueAdd * 1 < totalPay) {
	// 	}
	// 	else {
	// 	  result.push(e);
	// 	}
	//   });
	//   return result;
	// }
  },
});
