/**
 * Created by TY-xie on 2018/8/27.
 */
import request from './gs-request'
import {getParams} from 'libs/libs'

export const login = (data) => request({url: '/Business/BindByCardAction', data}, false)
export const getFields = () => request({url: '', data: {}}, true)
/*this._loading()
 axios({
 method: 'post',
 url: UPLOADSINGLEIMAGE_URL,
 data: formData,
 header: {'Content-Type': 'multipart/form-data'}
 }).then(res => {
 this._unLoading()
 if (res.data.success) {
 this.$emit('done', res.data.filePath)
 } else {
 this._toast(res.data.message || '后端操作失败!')
 }
 }).catch(err => {
 this._unLoading()
 console.log('cropActionDone', err)
 this._toast('请求异常!')
 })*/
export const uploadImage = data => request({
    url: '/Common/UploadSingleImage', data, head: {'Content-Type': 'multipart/form-data'},
})
// http://bkchina.m.yunhuiyuan.cn/Member/Sign?bid=e02cbb7b-a9e7-e311-a603-90b11c47e695
export const signIn = () => request({url: `/Member/Sign`, data: {}}, true)
// https://bkchina.m.yunhuiyuan.cn/Member/GetCheckCode?bid=e02cbb7b-a9e7-e311-a603-90b11c47e695
export const getVerifyCode = data => request({url: '/Member/GetCheckCode', data}, true)
//https://bkchina.m.yunhuiyuan.cn/Member/ReceivePointTaskPoint?taskIdentify=1
export const getPoint = (data) => request({url: '/Member/ReceivePointTaskPoint', data})
export const saveField = (data) => request({url: '/Member/CompleteInfo', data})
// 连续签到领奖
export const getCouponAward = (data) => request({url: '/Member/SignSendCoupon', data})

export const getMemberCode = () => request({url: '/Member/GetMemberCode', data: {}})

