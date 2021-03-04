import {getParams} from 'libs/libs'
const params = getParams()

const state = {
  sku: {},
  bid: params.bid,
  mode: '',
  shopcart: [],
  isShare: false,       // 当前用户是否是通过分享链接进入
  shareGoods: null,
  addressList: [],    // 用户收货地址
  groupSplice: {},
  categoryMode: '',
  availablePoint: 0,
  userPosition: null,   // 用户地理坐标
  baseGoodsDetail: {},
  submitOrderInfo: {},
  submitOrderParams: null,
  submitGoodsItems: [],
  floatAd: {isShow: false, list: []},
  landingPage: '',
  headData: null,   // 首页头部信息
  currentPage: '',
  sdkConfig: '',
  homeGoodsList: {
    index: 1,
    list: [],
  },  // 首页列表信息
  main2Info: {
    category: [],
    coupons: [],
    groupSplices: [],
    tradePoint: [],
  },
}
export default state
