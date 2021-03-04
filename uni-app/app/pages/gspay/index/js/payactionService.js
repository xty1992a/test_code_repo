export default class PayactionService {
  static allPayTypes = [
    { key: 2, value: "微信支付", deviceType: 1, checked: false },
    { key: 1, value: "支付宝支付", deviceType: 2, checked: false },
    { key: 16, value: "现金支付", isMember: true, checked: false },
    { key: 32, value: "银行卡支付", isMember: true, checked: false },
    { key: 1024, value: "分期支付", checked: false },
    { key: 512, value: "翼支付", deviceType: 6, checked: false }
  ];

  static currentPayTypeValue = 0;

  ///判断是否应该直接发起买单，不弹出确认支付层
  static shouldShowPayAction({
    deviceType,
    isMember,
    payType,
    memberAvailableValue,
    addValueList,
    valueMode,
    result,
    isCanUseMotherValue,
    money
  }) {
    //过滤掉设备类型不符合的
    let filterPayTypes = this.allPayTypes.filter(
      x => !x.deviceType || x.deviceType == deviceType
    );
    //过滤掉会员的
    if (!isMember) {
      filterPayTypes = filterPayTypes.filter(x => !x.isMember);
    }
    //过滤配置的
    filterPayTypes = filterPayTypes.filter(x => (payType & x.key) !== 0);

    console.log("当前能用的支付方式：", filterPayTypes);

    if (filterPayTypes.length) {
      this.currentPayTypeValue = filterPayTypes[0].key;
    }
    console.log("shouldShowPayAction,result----",result)
    console.log("shouldShowPayAction,money----",money)
    let payCash = result.payCash
    //所有优惠都没有抵扣到,且商家只开启了三方支付
    if (payCash*1 === money*1) {
      if(payType<4&&this.currentPayTypeValue<4&&this.currentPayTypeValue>0){
        return false;
      }
      //其他支付方式已经抵扣玩
      // this.currentPayTypeValue = 4;
      // console.log("其他支付方式已经抵扣完了");
      // return false;
    }
    // if (filterPayTypes.length !== 1) {
    //   return true;
    // }

    // var allowValuePay = (payType & 4) > 0;
    // if (!allowValuePay) {
    //   console.log("不允许储值支付");
    //   return false;
    // }
    //母卡储值
    // if (isCanUseMotherValue) {
    //   return true;
    // }

    // if (memberAvailableValue === 0 && !(addValueList && addValueList.length)) {
    //   console.log("储值为0");
    //   return false;
    // }
    return true;
  }
}
