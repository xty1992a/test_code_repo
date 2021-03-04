import * as types from './mutation_types'
import {
  getParameters,
  getTemplate,
  getGoodsList
} from 'api/pages/shop'
export const getAddressList = ({commit, state}) => {

}

export const getOrderParams = async ({commit}, guid) => {
  let res = await getParameters(guid)
  if (res.success) {
	commit('SET_SUBMIT_ORDER_PARAMS', res.data)
  }
}

export const getShopTemplate = async ({commit}) => {
  let res = await getTemplate()
  if (res.success) {
	commit(types.SET_MODE, res.data.mallTemplateSetting)
	commit(types.SET_CATEGORYMODE, res.data.mallTypeTemplateSetting)
  }
}
