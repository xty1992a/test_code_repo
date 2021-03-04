/**
 * Created by TY-xie on 2017/10/17.
 */
import request from 'api/request'

export default {
  methods: {
    loadData(url, data, load = true, options = {}) {
      if (data.params) {
        if (!data.params.bid) {
          data.params.bid = this.bid || ''
        }
      } else {
        if (!/bid/.test(url)) {
          data.params = {bid: this.bid}
        }
      }
      return new Promise((resolve, reject) => {
        if (load) {
          let msg = ''
          if (typeof load === 'string') {
            msg = load
          }
          this._loading(msg)
        }
        request(url, data, options)
            .then(res => {
              load && this._unLoading()
              if (res.resultCode === 500) {
                if (res.message === '请不要重复操作') {
                  this._toast('请不要重复操作')
                  return reject(res)
                }
              }
              if (res.success === true) { // 该值有可能为字符串
                resolve(res)
              } else {
                console.log('loadData call request then res.success != true')
                this._toast(res.message)
                reject(res)
              }
            })
            .catch(err => {
              console.log('err', err)
              load && this._unLoading()
              this._toast('系统繁忙,请稍后重试')
              reject()
            })
      })
    }
    ,
  }
}
