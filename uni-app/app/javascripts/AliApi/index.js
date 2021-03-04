import request from '../api/request.js'
const AliConfig = {
	getExtUrl: '/Common/GetUploadParam'
}
import axios from 'axios'
import { getParams } from "libs/libs";
axios.interceptors.response.use((response) => {
  if(response.status===300) {
	window.location.href = 'https://h5.yunhuiyuan.cn/429.html'
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});
const bid = getParams()['bid']

export const getExtData = (mime) => {
	return new Promise((resolve, reject) => {
		axios({
			url: AliConfig.getExtUrl,
			params: { ext: mime || 'png', bid },
			data: { ext: mime || 'png' },
			method: 'POST'
		}).then((res) => {
			if (res.data.status !== 0) {
				resolve({
					success: false,
					message: res.data.message || '请求配置参数失败'
				})
			} else {
				resolve({
					success: true,
					res: res.data.data,
					data: res.data.data
				})
			}
		}).catch(err => {
			resolve({
				success: false,
				message: '请求失败'
			})
		})
	})
}

export const getFormData = (file, data) => {
	let form = new FormData()
	form.append('OSSAccessKeyId', data.accessid)
	form.append('key', data.key)
	form.append('signature', data.signature)
	form.append('policy', data.policy)
	form.append('file', file, data.key)
	form.append('success_action_status', 200)
	return form
}

export const upLoadToAli = config => {
	return new Promise((resolve, reject) => {
		axios({
			url: config.url,
			data: config.data,
			method: 'POST',
			header: { 'Content-Type': 'multipart/form-data' }
		}).then((res) => {
			resolve({
				success: true
			})
		}).catch(err => {
			resolve({
				success: false,
				message: '请求失败!'
			})
		})
	})
}
