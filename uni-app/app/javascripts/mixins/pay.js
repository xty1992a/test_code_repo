import request from "api/request";

export default {
  methods: {
    /**
     * 支付
     * errType: 3:微信支付失败/取消,4:光大支付宝支付失败
     * successType: 1: 微信支付成功 2: 光大支付宝支付成功 3: 非第三方支付成功 4:提交订单成功，支付失败
     * @param url
     * @param data
     */
    pay(url, data, supportXY = false) {
      this._loading();
      return new Promise((resolve, reject) => {
        request(url, data)
          .then(res => {
            console.log("-----------", res, res.resultCode);
            this._unLoading();
            if (res.resultCode === 500) {
              if (res.message === "请不要重复操作") {
                reject({
                  success: false,
                  msg: res.message
                });
                return;
              }
            }
            if (!res.success) {
              reject({
                success: false,
                msg: res.message
              });
              return;
            }
            if (res.payType == 2 && res.isFinished) {
              resolve({
                success: true,
                data: res
              });
              return;
            }
            var payType = res.payType;
            switch (payType) {
              case 1: //支付宝 直接跳转
                alipay(res.data, res, supportXY)
                  .then(result => resolve(result))
                  .catch(error => reject(error));
                break;
              case 2: //微信支付
                wechatPay(res.data, res)
                  .then(result => resolve(result))
                  .catch(error => reject(error));
                break;
              case 3: //储值支付
                resolve({
                  success: true,
                  data: res
                });
                break;
              default:
                resolve({
                  success: false,
                  msg: res.message
                });
            }
          })
          .catch(err => {
            // 请求失败跟请求返回500，说明下单没成功；支付失败说明下单已经成功。两者需要区别对待
            this._unLoading();
            console.log("catch", err);
            if (
              err.resultCode &&
              err.resultCode === 500 &&
              err.msg === "请不要重复操作"
            ) {
              // request里面检测到重复请求，返回的reject
              reject({ success: false, msg: err.msg });
              // 重复提交订单，当作什么都没发生
            } else if (err.resultCode && err.resultCode === 500) {
              // request请求返回了500，返回的reject
              // 提交订单服务器端校验不通过
              reject({ success: false, msg: err.msg });
            } else if (err.type && err.type === 3 && err.msg === "支付取消") {
              // then里面调起微信支付，之后返回的reject
              // 取消支付，什么都不提示
              reject({ success: false, msg: "支付取消" });
            } else if (err.type && err.type === 3) {
              // then里面调起微信支付，之后返回的reject
              // 微信支付失败
              reject({ success: false, msg: err.msg });
            } else if (err.type && err.type === 4) {
              // then里面调起光大支付宝支付，之后返回的reject
              // 光大支付宝支付失败
              reject({ success: false, msg: err.msg });
            } else {
              // request里面请求失败
              // 提交订单请求异常
              reject({ success: false, msg: err.msg || "请求失败！" });
            }
          });
      });
    }
  }
};

export const pay = res => {
  if (res.resultCode === 500) {
    if (res.message === "请不要重复操作") {
      return Promise.reject({
        success: false,
        msg: res.message
      });
    }
  }
  if (!res.success) {
    return Promise.reject({
      success: false,
      msg: res.message
    });
  }
  if (res.payType === 2 && res.isFinished) {
    return Promise.resolve({
      success: true,
      data: res
    });
  }
  switch (res.payType) {
    case 1: //支付宝 直接跳转
      return alipay(res.data, res, false);
    case 2: //微信支付
      return wechatPay(res.data, res);
    case 3: //储值支付
      return Promise.resolve({
        success: true,
        data: res
      });
  }
  return Promise.resolve({
    success: false,
    msg: res.message
  });
};

// 调用微信JS api 支付
var payParameter = {};
function wechatPay(wxParameter, data) {
  payParameter.wx = {
    wxParameter: wxParameter,
    data: data
  };
  return onWxBridgeReady();
  // if (typeof WeixinJSBridge == "undefined") {
  //   if (document.addEventListener) {
  //     document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
  //   } else if (document.attachEvent) {
  //     document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
  //     document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
  //   }
  // } else {
  //   onWxBridgeReady();
  // }
}

function onWxBridgeReady() {
  return new Promise((resolve, reject) => {
    var wxParameter = payParameter.wx.wxParameter;
    var data = payParameter.wx.data;
    // if (!(wxParameter instanceof Object && wxParameter["prepay_id"])) {//跳转模式
    //   window.location.href = `https://pay.swiftpass.cn/pay/jspay?token_id=${wxParameter}&showwxtitle=1`;
    //   return
    // }
    WeixinJSBridge.invoke("getBrandWCPayRequest", wxParameter, function(res) {
      if (res.err_msg === "get_brand_wcpay_request:ok") {
        resolve({
          success: true,
          data: data
        });
      } else {
        let errmsg;
        if (res.err_msg === "get_brand_wcpay_request:fail") {
          errmsg = res.err_desc || "支付失败";
        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          errmsg = "支付取消";
        } else {
          errmsg = "支付失败(" + res.err_msg;
          if (res.err_desc) {
            errmsg += res.err_desc;
          }
          errmsg += ")";
        }
        reject({ success: false, type: 3, msg: errmsg });
      }
    });
  });
}

function alipay(tradeNo, data, supportXY) {
  return new Promise((resolve, reject) => {
    if (supportXY && tradeNo.indexOf("http") === 0) {
      window.location.href = tradeNo;
      return;
    }
    window.AlipayJSBridge.call("tradePay", { tradeNO: tradeNo }, function(
      result
    ) {
      if (result.resultCode === "9000") {
        resolve({
          success: true,
          data
        });
      } else {
        reject({
          success: false,
          type: 4,
          msg: "支付失败(" + result.resultCode + ")"
        });
      }
    });
  });
}
