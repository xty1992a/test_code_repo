let isWechat = false
let isAliLife = false
let isBrowser = false
let ua = navigator.userAgent.toLowerCase()
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  isWechat = true
} else if (ua.match(/alipayclient/i) == 'alipayclient') {
  isAliLife = true
} else {
  isBrowser = true
}
export default {
  isWechat: isWechat,
  isAliLife: isAliLife,
  isBrowser: isBrowser
}
