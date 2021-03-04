/**
 * Created by TY-xie on 2017/10/13.
 */
import axios from 'axios'
axios.interceptors.response.use((response) => {
  if(response.status===300) {
	window.location.href = 'https://h5.yunhuiyuan.cn/429.html'
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});
import ss from 'libs/setStorage'
import {getParams} from 'libs/libs'
import hashcode from 'libs/stringToHashCode.js'
// let baseURL = PRODUCTION ? window.location.origin : 'http://m.yunhuiyuan.cn/'// window.location.origin
let baseURL = window.location.origin

export default function (url, data, options = {}) {
  // region 防重复提交
  let pendingKey = hashcode(url + JSON.stringify(data)) // 转换为hash
  pushPendingKey(pendingKey)
  if (ss.getItem(pendingKey)) {
	console.log('重复操作key:', pendingKey)
	return Promise.resolve({success: false, resultCode: 500, message: '请不要重复操作'})
  } else {
	ss.setItem(pendingKey, 'pending')
  }
  // endregion

  let reqData = getReqestData(data, url)
  let config = getRequestConfig()
  if (!options && !options.method) {
	config.method = options.method
  }
  config.data = reqData.reqData
  if (data && data.params) {
	config.params = data.params
  }
  config.url = reqData.url
  return new Promise((resolve, reject) => {
	axios(config)
		.then(res => {
		  ss.removeItem(pendingKey)
		  resolve(res.data)
		})
		.catch(err => {
		  ss.removeItem(pendingKey)
		  reject(err)
		})
  })
}

// 返回一个axios配置对象中的默认data对象
function getReqestData(data, url) {
  let reqData
  if (data instanceof Array) {
	reqData = []
  } else {
	reqData = {}
  }
  for (let i in data) {
	if (i === 'params') continue
	reqData[i] = data[i]
  }
  if (reqData.hasOwnProperty('guid')) {
	url = url + '/' + reqData.guid
	delete reqData.guid
  }
  let c = '?'
  if (/\?/.test(url)) {
	c = '&'
  }
  if (reqData.hasOwnProperty('pageIndex')) {
	url = url + c + 'pageIndex=' + reqData.pageIndex
	delete reqData.pageIndex
	c = '&'
  }
  if (reqData.hasOwnProperty('pageSize')) {
	url = url + c + 'pageSize=' + reqData.pageSize
	delete reqData.pageSize
  }
  return {reqData, url}
}

// 返回一个axios的配置对象
function getRequestConfig() {
  let params = getParams()
  params.code = params.code || params.auth_code
  let config = {
	baseURL,
	params: {},
	data: {},
	timeout: 50000,
	method: 'POST',
	headers: {
	  'X-Requested-With': 'XMLHttpRequest',
	},
  }
  return config
}

// 相同的请求在storage中进行标记,防止重复请求.
function pushPendingKey(pendingKey) {
  let pendingKeys = ss.getItem('pendingKeys') || []
  pendingKeys.push(pendingKey)
  ss.setItem('pendingKeys', pendingKeys)
}
