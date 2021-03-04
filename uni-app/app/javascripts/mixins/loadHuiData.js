/**
 * Created by TY-xie on 2017/10/17.
 */
import request from 'api/request'
export default {
  methods: {
    loadHuiData(url, data, load = true, toast = true) {
      if (data.params) {
        if (!data.params.tongChengHuiId) {
          data.params.tongChengHuiId = this.tongChengHuiId || ''
        }
      } else {
        if (!/tongChengHuiId/.test(url)) {
          data.params = {tongChengHuiId: this.tongChengHuiId}
        }
      }
      return new Promise((resolve, reject) => {
        load && this._loading()
        request(url, data)
            .then(res => {
              load && this._unLoading()
              if (res.resultCode === 500) {
                if (res.message === '请不要重复操作') {
                  toast && this._toast('请不要重复操作')
                  return reject(res)
                }
              }
              if (res.success === true) { // 该值有可能为字符串
                resolve(res)
              } else {
                toast && this._toast(res.message)
                reject(res)
              }
            })
            .catch(err => {
              console.log('err', err)
              load && this._unLoading()
              toast && this._toast('请求异常!')
              reject()
            })
      })
    },
  }
}