/**
 * Created by TY-xie on 2017/10/16.
 */
import calc from './calc';

export function getCookie(sName) {
  // var aCookie = document.cookie.split("; ");
  // for (var i = 0; i < aCookie.length; i++) {
	// var aCrumb = aCookie[i].split("=");
	// if (sName == aCrumb[0])
	//   return unescape(aCrumb[1]);
  // }
  return null;
}

export function redirectTo(url) {
  var params = getParams();
  if (params.bid) {
	if (url.indexOf('?') !== -1) {
	  url = url + '&bid=' + params.bid;
	}
	else {
	  url = url + '?bid=' + params.bid;
	}
  }
  window.location.href = url;
}

// 从地址栏获取参数,包装为一个对象返回
export function getParams(url = '') {
  url = url || '?bid=e02cbb7b-a9e7-e311-a603-90b11c47e695&storeid=092a7168-6fcc-e211-81c9-90b11c47e696&account=0228001&staffid=1b4a86ba-3fef-11e9-9b0d-20040fed9860&organizationGuid=668cf346-a627-e411-a604-90b11c47e695&oilGunGuid=00000000-0000-0000-0000-000000000000&goodsItemTypeGuid=45569811-b812-11e8-9f73-0010185de866&show-debugger=1';
  let params = {};
  if (url.indexOf('?') !== -1) {
	let str = url.substr(url.indexOf('?') + 1);
	let strs = str.split('&');
	strs.forEach(item => {
	  let arrs = item.split('=');
	  params[arrs[0].toLowerCase()] = arrs[1];
	});
  }
  return params;
}

export function hasProp(obj) {
  var type = typeof obj;
  switch (type) {
	case 'number':
	case 'boolean':
	  return true;
	default :
	  return !!obj && Object.keys(obj).length > 0;
  }
}

export function copy(obj) {
  let isArray = Array.isArray(obj);
  let ret = null;
  if (isArray) {
	ret = obj.slice();
  }
  else {
	ret = {};
	for (var key in obj) {
	  ret[key] = obj[key];
	}
  }
  return ret;
}

/* ================ 深拷贝 ================ */
export function deepClone(initalObj) {
  var obj = {};
  obj = JSON.parse(JSON.stringify(initalObj));
  return obj;
}

export function formatHump(obj) {
  if (!obj) return obj;
  let returnObj = {};
  for (var key in obj) {
	var tem = key[0].toLocaleLowerCase() + key.substring(1);
	returnObj[tem] = obj[key];
  }
  return returnObj;
}

export function formatNotHump(obj) {
  if (!obj) return obj;
  let returnObj = {};
  for (var key in obj) {
	var tem = key[0].toLocaleUpperCase() + key.substring(1);
	returnObj[tem] = obj[key];
  }
  return returnObj;
}

export function leftTimer(time, isHour = false) {
  var leftTime = +new Date(time) - +new Date();
  if (leftTime <= 0) {
	return {
	  timeend: true,
	  days: pad(0),
	  hours: pad(0),
	  minutes: pad(0),
	  seconds: pad(0),
	};
  }
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
  var seconds = parseInt(leftTime / 1000 % 60, 10);
  return {
	days: pad(days),
	fullhours: pad(days * 24 + hours),
	hours: pad(hours),
	minutes: pad(minutes),
	seconds: pad(seconds),
  };
}

export function formatDate(value, fmt) {
  var date;
  var type = typeof (value);
  if (type === 'object') { // 日期对象
	date = value;
  }
  else if (type === 'string') { // 字符串格式的日期
	date = new Date(value.replace(/-/g, '/').replace(/T/g, ' '));
  }
  else if (type === 'number') { // 时间戳
	if (value === 0) {
	  return '';
	}
	date = new Date(value * 1000);
  }
  else {
	return '';
  }

  if (!fmt) {
	fmt = 'yyyy-MM-dd hh:mm';
  }
  var o = {
	'M+': date.getMonth() + 1,                 // 月份
	'd+': date.getDate(),                    // 日
	'h+': date.getHours(),                   // 小时
	'm+': date.getMinutes(),                 // 分
	's+': date.getSeconds(),                 // 秒
	'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
	'S': date.getMilliseconds()             // 毫秒
  };
  if (/(y+)/.test(fmt)) {
	fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
	if (new RegExp('(' + k + ')').test(fmt)) {
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	}
  }
  return fmt;
}

// 格式化券的过期时间
export function fmtCouponDate(status, endDate) {
  if (status === 0) {
	var days = calc.toDecimal((new Date(formatDate(endDate)) - new Date()) / (1000 * 60 * 60 * 24), 0);
	if (days === 0) {
	  return '今天后过期';
	}
	else if (days && days <= 7) {
	  return days + '天后过期';
	}
	else if (endDate === '2099-12-31 23:59:59') {
	  return '永久有效';
	}
	else {
	  return formatDate(endDate, 'yyyy-MM-dd');
	}
  }
  else {
	if (endDate === '2099-12-31 23:59:59') {
	  return '永久有效';
	}
	else {
	  return formatDate(endDate, 'yyyy-MM-dd');
	}
  }
}

export function getNextDay(list) {
  if (!list.length) {
	return null;
  }
  let date = new Date();
  let year = date.getFullYear(); // 年
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();

  function getNext(gap) { // 获取下一天
	return new Date(year, month, day + gap, hours);
  }

  function check(newDate) {
	let days = newDate.getUTCDay(); // 检查传入的日期是否符合数组要求
	days = days === 0 ? 7 : days;
	console.log(days);
	return list.indexOf(days) > -1;
  }

  let newDate = null;
  for (var i = 0; i < list.length; i++) {
	newDate = getNext(i);
	if (check(newDate)) {
	  break;
	}
  }
  return newDate;
}

export function getDateGap(date1, date2) {    // 2017-08-07 年月日格式
  var aDate1, aDate2, oDate1, oDate2, iDays;
  aDate1 = date1.split('-');
  aDate2 = date2.split('-');
  oDate1 = new Date(+aDate1[0], +aDate1[1], +aDate1[2]);
  oDate2 = new Date(+aDate2[0], +aDate2[1], +aDate2[2]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);    // 把相差的毫秒数转换为天数
  return iDays;
}

export function isiOS() {
  var u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

export function writeCookie() {
  var days = 36500000;
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';path=/;expires=' + date.toGMTString();
  return true;
}

export function splitArray(arr, len = 1) {
  if (!Array.isArray(arr)) {
	throw new Error('splitArray need a array, got ' + typeof arr);
  }
  let list = [];
  while (arr.length) {
	list.push(arr.splice(0, len));
  }
  return list;
}

export function getErrMsg(err) {
  if (err.resultCode) {
	return err.msg;
  }
  return '网络错误';
}

export function pad(num, n = 2) {
  let len = num.toString().length;
  while (len < n) {
	num = '0' + num;
	len++;
  }
  return num;
}

export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
	u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}
