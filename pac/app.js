// var Pac = require('node-pac');
// var pac = new Pac('http://help.1card1.cn/static/pac/app-release.pac');
// var url = 'https://bkchina.h5.yunhuiyuan.cn/Shop/GoodsList/?bid=e02cbb7b-a9e7-e311-a603-90b11c47e695&show-debugger=1'
// pac.FindProxyForURL(url, function(err, res)　{
// 	console.log(err, res);
// });
const axios = require('axios')
axios.get('https://10.10.14.10:32666/#!/pod/app-release/activitycenter-api-847ccfb885-7k2d7?namespace=app-release')
.then(res => {
    console.log('result => ', res)
})
.catch(err => {
    console.log('error => ',err)
})