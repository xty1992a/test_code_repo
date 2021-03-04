require("./math.js");
import _ from "javascripts/modules/dialog.js";
import {submitPay, reportCancelPayment} from "javascripts/api/gs-api.js";
// import upayRegisterService from "../../../Upay/Index/modules/upayRegisterSerivce";

const upayRegisterService = {
  register() {}
}

export class Pay {
	constructor(initData, parameter) {
		this.data = initData;
		this.parameter = parameter;
		this.payParameter = {};
	}

	async submit(
		gasDiscount,
		payType,
		totalCash,
		nodiscount,
		meno,
		result,
		addValueInfo,
		enableValuePay,
		authcode = "",
		isChildCard = false,
		childCardGuid,
		oilPrice,
		isSubOilCard,
		totalGas,
		oilOrderGuid
	) {
		var addValueRuleGuid = "";
		let totalPaid = totalCash;
		let addValue = 0;
		console.log("submint", addValueInfo);
		if (addValueInfo && JSON.stringify(addValueInfo) != "{}") {
			addValueRuleGuid = addValueInfo.guid;
			if (addValueInfo.giftType === 6) {
				let times = Math.subtract(1, addValueInfo.freeOrder.discount || 0);
				times = Math.add(times, addValueInfo.freeOrder.times);
				addValue = Math.mult(times, result.payCash);
				totalPaid = Math.mult(addValueInfo.freeOrder.times, result.payCash);
			}
			else if (addValueInfo.giftType === 7) {
				let dynamicRecharge = addValueInfo.dynamicRecharge;
				let add = Math.mult(
					Math.floor(
						Math.divide(result.payCash, dynamicRecharge.rechargeDiff)
					) + 1,
					dynamicRecharge.rechargeDiff
				); //充值金额

				let send =
					dynamicRecharge.giftType === 1
						? Math.mult(add, dynamicRecharge.giftValue)
						: dynamicRecharge.giftValue; //赠送金额

				addValue = Math.add(send, add);
				totalPaid = add;
			}
			else {
				addValue =
					addValueInfo.valueAdd +
					(addValueInfo.firstGiftIntervalDays > 0 ? 0 : addValueInfo.valuePlus);
				totalPaid = addValueInfo.valueAdd;
			}
		}
		var memberPayValue = 0;
		var payCash = result.payCash;
		if (payCash === 0) {
			console.log("其他支付方式已经抵扣完了");
			payType = 4;
		}
		if (this.parameter.isMember) {
			if (JSON.stringify(addValueInfo) != "{}") {
				if (!gasDiscount) {
					//有会员充值的情况下
					memberPayValue = payCash;
				}
				else {
					memberPayValue = gasDiscount.realValue;
				}
				payCash = 0;
			}
			else if (enableValuePay) {
				//储值支付的时候
				var memberAvailableValue = this.parameter.discountParameter
					.memberAvailableValue;
				if (!gasDiscount) {
					if (result.payCash <= memberAvailableValue) {
						memberPayValue = result.payCash;
						payCash = 0;
					}
					else {
						memberPayValue = memberAvailableValue;
						payCash = Math.subtract(result.payCash, memberAvailableValue);
					}
				}
				else {
					memberPayValue = gasDiscount.realValue;
					payCash = gasDiscount.remainMoney;
				}
				if (payCash === 0) {
					payType = 4;
				}
			}
			else if (isChildCard) {
				var avaValue = 0;
				if (
					this.parameter.childCardInfo.limitValue >
					this.parameter.childCardInfo.motherAvailableValue
				) {
					avaValue = this.parameter.childCardInfo.motherAvailableValue;
				}
				else {
					avaValue = this.parameter.childCardInfo.limitValue;
				}
				if (result.payCash <= avaValue) {
					memberPayValue = result.payCash;
					payCash = 0;
					payType = 4;
				}
				else {
					memberPayValue = avaValue;
					payCash = Math.subtract(result.payCash, avaValue);
				}
				if (
					memberPayValue > this.parameter.childCardInfo.motherAvailableValue
				) {
					_._toast("母卡储值不足");
					return;
				}
			}
		}
		if (payType === 0) {
			_._toast("未选择支付方式");
			return;
		}
		let gasDisocuntNumber = enableValuePay
			? (gasDiscount || {discount: 0}).discount
			: 0;
		let gasDiscountDetails = enableValuePay
			? (gasDiscount || {gasDiscountDetailList: null}).gasDiscountDetailList
			: null;

		var data = {
			totalCash: totalCash,
			nodiscount: nodiscount,
			storeGuid: this.data.storeId,
			activityGuid: this.parameter.activity.guid,
			uPayDiscount: result.activity.money,
			couponDiscount: result.coupon.money,
			pointDiscount: result.point.money,
			coupons: result.coupon.coupons,
			payCash: payCash,
			payType: payType,
			meno: meno,
			paidCash: payType === 16 ? payCash : 0,
			paidCard: payType === 32 ? payCash : 0,
			memberValue: memberPayValue,
			memberDiscountUpayCash: result.discount.money,
			userAccount: this.data.account,
			addValueRuleGuid: addValueRuleGuid,
			goodsItemGuid: result.goodsItemGuid,
			authorCode: authcode,
			staffGuid: this.data.staffId,
			isChildCard: isChildCard,
			childCardGuid: childCardGuid,
			price: oilPrice,
			gasDiscount: gasDisocuntNumber,
			addValue: addValue,
			addValueGiftType: (addValueInfo || {giftType: -1}).giftType,
			gasDiscountDetails: gasDiscountDetails,
			totalPaid: totalPaid,
			printUserAccount: this.data.printUserAccount,
			typeGuid: result.typeGuid,
			gunGuid: result.gunGuid,
			isSubOilCard: isSubOilCard,
			number: totalGas,
			ruleGuid: this.parameter.discountParameter.ruleGuid,
			oilOrderGuid
		};
		data.params = {};
		//散客充值逻辑
		if (addValue > 0 && !this.parameter.isMember) {
			let newData = JSON.parse(JSON.stringify(data));
			newData.memberValue = newData.payCash;
			newData.payCash = 0;
			upayRegisterService.register(
				newData,
				this.parameter.register,
				1,
				newData.storeId,
				addValueInfo,
				async res => {
					if (!res) {
						console.log(res, "无需继续支付");
						return;
					}
					await this.pay(newData);
				}
			);
		}
		else {
			await this.pay(data);
		}
	}

	async pay(data) {
		var res = await submitPay(data);
		if (!res.success) {
			_._toast(res.message);
			return;
		}
		if (!res.data.success) {
			_._toast(res.data.message);
			return;
		}
		var pt = res.data.payType;
		var rd = res.data;

		if (pt == 2 && rd.isFinished) {
			window.location.href = rd.redirectUrl;
			return;
		}

		switch (pt) {
			case 1: //支付宝 直接跳转
				this.alipay(rd.data, rd.redirectUrl, rd.businessTradeNo);
				break;
			case 2: //微信支付
				this.wechatPay(rd.data, rd.redirectUrl, rd.businessTradeNo);
				break;
			case 3: //储值支付
				if (rd.redirectUrl) {
					window.location.href = rd.redirectUrl;
				}
				break;
			case 4:
				let url = rd.data;
				url =
					url.indexOf("?") > 0
						? `${url}&redirectUrl=${encodeURIComponent(rd.redirectUrl)}`
						: `${url}?redirectUrl=${encodeURIComponent(rd.redirectUrl)}`;
				window.location.href = url;
				break;
			default:
		}
	}

	alipay(tradeNo, url, businessTradeNo) {
		if (tradeNo.indexOf("http") === 0) {
			window.location.href = tradeNo;
			return;
		}
		window.AlipayJSBridge.call(
			"tradePay",
			{
				tradeNO: tradeNo
			},
			function (result) {
				let networkErrorCodes = ["8000", "6004"];
				if (result.resultCode === "9000") {
					window.location.href = url;
				}
				else if (networkErrorCodes.find(x => x === result.resultCode)) {
					_._toast("支付失败(" + result.resultCode + ")");
				}
				else {
					_._toast("支付取消(" + result.resultCode + ")");
					//支付取消,上报服务器
					reportCancelPayment(businessTradeNo, result.resultCode);
				}
			}
		);
	}

	// 调用微信JS api 支付
	wechatPay(wxParameter, data, businessTradeNo) {
		this.payParameter.wx = {
			wxParameter: wxParameter,
			data: data,
			businessTradeNo: businessTradeNo
		};
		return this.onWxBridgeReady();
	}

	onWxBridgeReady() {
		var wxParameter = this.payParameter.wx.wxParameter;
		var data = this.payParameter.wx.data;
		let businessTradeNo = this.payParameter.wx.businessTradeNo;
		WeixinJSBridge.invoke("getBrandWCPayRequest", wxParameter, function (res) {
			if (res.err_msg === "get_brand_wcpay_request:ok") {
				window.location.href = data;
			}
			else {
				let errmsg;
				if (res.err_msg === "get_brand_wcpay_request:fail") {
					//支付取消,上报服务器
					reportCancelPayment(businessTradeNo, res.err_msg);
					errmsg = "支付失败";
				}
				else if (res.err_msg === "get_brand_wcpay_request:cancel") {
					errmsg = "支付取消";
				}
				else {
					errmsg = "支付失败,信息：" + res.err_msg;
				}
				_._toast(errmsg);
			}
		});
	}
}
