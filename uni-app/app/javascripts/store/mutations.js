import * as types from './mutation_types'
import {findCartIndex} from 'libs/sku'

const mutations = {
  [types.SET_BID] (state, bid) {
	state.bid = bid
  },
  [types.SET_MODE] (state, mode) {
	state.mode = mode
  },
  [types.SET_HEADDATA] (state, data) {
	state.headData = data
  },
  [types.SET_USERPOSITION] (state, position) {
	state.userPosition = position
  },
  [types.SET_FLOATAD] (state, floatAd) {
	state.floatAd = floatAd
  },
  [types.SET_CATEGORYMODE] (state, mode) {
	state.categoryMode = mode
  },
  [types.SET_SKU] (state, sku) {
	state.sku = sku
  },
  [types.SET_ISSHARE] (state, isShare) {
	state.isShare = isShare
  },
  [types.SET_ADDRESSLIST] (state, addressList) {
	state.addressList = addressList
  },
  [types.SET_SHAREGOODS] (state, goods) {
	console.log(goods, 'will setsharegoods')
	state.shareGoods = goods
  },
  [types.SET_GROUPSPLICE] (state, groupSplice) {
	state.groupSplice = groupSplice
  },
  [types.SET_BASEGOODSDETAIL] (state, baseGoodsDetail) {
	state.baseGoodsDetail = baseGoodsDetail
  },
  [types.SET_AVAILABLEPOINT] (state, availablePoint) {
	state.availablePoint = availablePoint
  },
  [types.SET_SHOPCART] (state, goods) {
	setShopCart(state, goods, false)
  },

  [types.SET_SHOPCARTNUMBER] (state, goods) {
	setShopCart(state, goods, true)
  },
  [types.REPLACE_SHOPCART] (state, carts) {
	// 请求购物车接口,直接覆盖购物车列表
	state.shopcart = carts || []
  },
  [types.DELETE_CARTITEMS] (state, carts) {
	// 删除符合传入数组的购物车项
	carts.forEach(goods => {
	  let index = findCartIndex(state.shopcart, goods)
	  if (index >= 0) {
		state.shopcart.splice(index, 1)
	  }
	})
  },
  [types.SET_SKU_INVENTORY] (state, goods) {
	state.sku && state.sku.skuList && state.sku.skuList.forEach(item => {
	  if (item.skuGuid === goods.skuGuid) {
		item.inventoryNumber -= goods.count
	  }
	})
  },
  [types.SET_SUBMITORDERINFO](state, submitOrderInfo) {
	state.submitOrderInfo = submitOrderInfo
  },
  'SET_SUBMIT_ORDER_PARAMS' (state, params) {
	state.submitOrderParams = params
  },
  'SET_SUBMIT_GOODS_ITEMS' (state, list) {
    state.submitGoodsItems = list
  },
  [types.SET_LANDINGPAGE] (state, landingPage) {
	state.landingPage = landingPage
  },
  [types.SET_CURRENTPAGE] (state, currentPage) {
	state.currentPage = currentPage
  },
  [types.SET_SDKCONFIG] (state, sdkConfig) {
	state.sdkConfig = sdkConfig
  },
  [types.SET_HOMEGOODSLIST] (state, {index, list}) {
	state.homeGoodsList.index = index
	state.homeGoodsList.list = list
  },
  [types.SET_MAIN2INFO] (state, payload) {
	console.log(payload)
	state.main2Info = {...payload}
  },
}

export default mutations

function setShopCart(state, goods, isReplace) {
  // 检测购物车中是否已包含该商品
  if (state.shopcart.length) { // 购物车不为空
	let index = findCartIndex(state.shopcart, goods)
	if (index >= 0) {
	  // 购物车中有该商品
	  let newCount = 0
	  if (isReplace) {
		newCount = +goods.count
	  } else {
		newCount = +state.shopcart[index].count + +goods.count
	  }
	  if (goods.isExistSku) {
		state.shopcart[index].specs = goods.specs
	  }
	  state.shopcart[index].count = newCount
	} else {
	  // 购物车中没有该商品
	  state.shopcart.push(goods)
	}
  } else { // 购物车为空
	state.shopcart.push(goods)
  }
}
