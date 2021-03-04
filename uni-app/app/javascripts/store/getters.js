export const sku = state => state.sku
export const bid = state => state.bid
export const mode = state => state.mode
export const categoryMode = state => state.categoryMode
export const isShare = state => state.isShare
export const shareGoods = state => state.shareGoods
export const floatAd = state => state.floatAd
export const shopcart = state => state.shopcart
export const groupSplice = state => state.groupSplice
export const addressList = state => state.addressList
export const userPosition = state => state.userPosition
export const availablePoint = state => state.availablePoint
export const baseGoodsDetail = state => state.baseGoodsDetail
export const totalCount = (state) => {
  let num = Array.isArray(state.shopcart) ? state.shopcart.reduce((prev, goods) => prev + parseInt(goods.count), 0) : ''
  return num || '0'
}
