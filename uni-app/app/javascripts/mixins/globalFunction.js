/**
 * Created by TY-xie on 2017/10/17.
 */
import {getParams} from '../libs/libs'

export default {
  data() {
	return {
	  floatShow: false,
	}
  },
  methods: {
	_confirm () {},
	_tip(msg) {
	  let key = {}
	  let pro = new Promise((resolve, reject) => {
		key.resolve = resolve
		key.reject = reject
	  })
	  this.pub.$emit('tip', {
		msg,
		key,
	  })
	  return pro
	},
	_toast(msg, status = 1, duration = 1500) { // 图文toast
/*	  const iconMap = ['success', 'waring', 'waring', 'waring']
	  // this.pub.$emit('toast', {type: 'minxi', status, msg, delay})
	  Message({
		message: msg,
		duration,
		icon: iconMap[status] || '',
	  })*/
	},

	_error(msg, isShow = true) {
	  setTimeout(() => {
		this.pub.$emit('err', {msg: msg, isShow: isShow})
	  }, 50)
	},
	_loading(msg = '') {
	  // Loading(msg)
	  // this.pub.$emit('alert', {type: 'loading', isShow: true, msg})
	},
	_unLoading() {
	  // Loading().close()
	  // this.pub.$emit('alert', {type: 'loading', isShow: false})
	},
	_setting(value){
	  let key = {}
	  let pro = new Promise((resolve, reject) => {
		key.resolve = resolve
		key.reject = reject
	  })
	  this.pub.$emit('settingCount', {
		value,
		key,
	  })
	  return pro
	},
  },
  computed: {
	bid() {
	  let params = getParams()
	  for (var key in params) {
		if (/bid/i.test(key)) {
		  return params[key]
		}
	  }
	  return params.businessguid || ''
	},
	$params() {
	  return getParams()
	},
  },
}
