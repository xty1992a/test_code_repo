import request from "./gs-request";

export const chooseOilCardType = (data) =>
	request(
		{
			url: "/GsPay/ChooseOilCardType",
			data,
		},
		true
	);

export const getPayInfo = (chainStoreGuid, goodsItemTypeGuid, oilGunGuid) =>
	request(
		{
			url: "/GsPay/GetPayInfo",
			data: {
				params: {
					chainStoreGuid,
					goodsItemTypeGuid,
					oilGunGuid,
				},
			},
		},
		true
	);

export const getNoPayOrderList = (chainStoreGuid) =>
	request(
		{
			url: "/GsPay/GetNoPayOrderList",
			data: {
				params: {storeGuid: chainStoreGuid},
			},
		},
		false
	);

export const getCoupons = (chainStoreGuid, goodsItemGuid) =>
	request(
		{
			url: "/GsPay/GetCoupons",
			data: {
				params: {
					chainStoreGuid,
					goodsItemGuid,
				},
			},
		},
		false
	);

export const submitPay = (data) => {
	let url = "/GsPay/Submit";
	if (data.addValueRuleGuid) {
		url = `${url}?type=ValueAndConsume`;
	}
	console.warn(data, "data submit");
	return request(
		{
			url: url,
			data: data,
		},
		true
	);
};

export const checkAuthorCode = (authorCode, storeGuid) =>
	request({
		url: "/GsPay/CheckAuthorCode",
		data: {
			params: {
				authorCode,
				storeGuid,
			},
		},
	});

export const getMemberGroups = (storeGuid) =>
	request({
		url: "/GsPay/GetMemberGroups",
		data: {
			params: {
				storeGuid,
			},
		},
	});

export const getRegisterUrl = (staffGuid, organizationGuid) =>
	request({
		url: "/GsPay/GetRegisterUrl",
		data: {
			params: {
				staffGuid,
				organizationGuid,
			},
		},
	});

export const getMemberDiscount = (chainStoreGuid, goodsItemGuid, totalCash) =>
	request(
		{
			url: "/GsPay/GetGsMemberDiscount",
			data: {
				params: {
					chainStoreGuid,
					goodsItemGuid,
					totalCash,
				},
			},
		},
		false
	);

export const getGsActivity = (chainStoreGuid, goodsItemGuid) =>
	request(
		{
			url: "/GsPay/GetGsActivity",
			data: {
				params: {
					chainStoreGuid,
					goodsItemGuid,
				},
			},
		},
		false
	);

export const getOilCardInfo = (goodsItemTypeGuid, storeGuid) =>
	request({
		url: "/GsPay/GetOilCardInfo",
		data: {
			goodsItemTypeGuid,
			storeGuid,
		},
	});

export const chooseOilType = (data) =>
	request({url: "/GsPay/ChooseOilType", data});
export const getOilStatistics = (data) =>
	request({url: "/ChildCard/GetOilCardStatistics", data});
export const getOilConsume = (data) =>
	request({url: "/ChildCard/GetConsumePage", data}, false);
export const getOilRecharge = (data) =>
	request({url: "/ChildCard/GetAddValuePage", data}, false);

export const reportFailOrder = (businessTradeNo, extInfo) =>
	request(
		{
			url: `/UPay/FailOrderFeedback?orderNo=${businessTradeNo}&extInfo=${extInfo}`,
			data: {},
		},
		false
	);

export const calculateGasDiscount = (data) =>
	request({url: "/GsPay/CalculateGasDiscount", data});

export const getChainStoreOilPrice = (chainStoreGuid) =>
	request({
		url: "/GsPay/GetChainStoreOilPrices",
		data: {
			params: {
				chainStoreGuid,
			},
		},
	});

export const getDistance = (
	storeLatitude,
	storeLongitude,
	localLat,
	localLon
) =>
	request({
		url: "/GsPay/GetDistance",
		data: {
			params: {
				storeLatitude,
				storeLongitude,
				localLat,
				localLon,
			},
		},
	});

export const reportCancelPayment = (orderNo, ext) =>
	request({
		url: "/GsPay/ReportCancelPayment",
		data: {
			params: {
				orderNo: orderNo,
				ext: ext,
			},
		},
	});

export const calculateGasOptimalDiscount = (data) =>
	request({url: "/GsPay/calculateGasOptimalDiscount", data});
