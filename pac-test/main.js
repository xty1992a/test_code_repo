const pac = new require('node-pac')('http://help.1card1.cn/static/pac/app-release.pac')

const url = 'https://bkchina.m.yunhuiyuan.cn/UPay/Info/9cbb7254-b3e7-e311-a603-90b11c47e695?bid=e02cbb7b-a9e7-e311-a603-90b11c47e695'
pac.findProxyForURL(url, (err, res) => {
  console.log(res)
})
