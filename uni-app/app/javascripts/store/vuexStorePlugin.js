import ss from 'libs/setStorage'

let mutationType2state = new Map([
  ['SET_BID', 'bid'],
  ['SET_FLOATAD', 'floatAd'],
  ['SET_MODE', 'mode'],
  ['SET_CATEGORYMODE', 'categoryMode'],
  ['SET_SKU', 'sku'],
  ['SET_SKU_INVENTORY', 'sku'],
  ['SET_USERPOSITION', 'userPosition'],
  ['SET_GROUPSPLICE', 'groupSplice'],
  ['REPLACE_SHOPCART', 'shopcart'],
  ['DELETE_CARTITEMS', 'shopcart'],
  ['SET_SHOPCART', 'shopcart'],
  ['SET_HEADDATA', 'headData'],
  ['SET_SHOPCARTNUMBER', 'shopcart'],
  ['SET_SUBMITORDERINFO', 'submitOrderInfo'],
  ['SET_HOMEGOODSLIST', 'homeGoodsList'],
  ['SET_MAIN2INFO', 'main2Info'],
  ['SET_SHAREGOODS', 'shareGoods'],
])

const vuexStorePlugin = store => {
  // 订阅vuex每一次提交行为
  store.subscribe((mutation, state) => {
	let type = mutationType2state.get(mutation.type)
	let key = state.bid + type
	ss.setItem(key, state[type])
  })
}
export default vuexStorePlugin
