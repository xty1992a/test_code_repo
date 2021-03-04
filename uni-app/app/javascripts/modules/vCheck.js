/**
 * Created by TY-xie on 2017/9/11.
 */
let utils = {
  exp: {
    tel: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,   // 手机
    id: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/   // 身份证
  }
}


function check(el, modifiers, binding) {
  var value = binding.value
  var data = value.data
  var utilExp = utils.exp
  var exp = /.*/
  if (!value.exp) { // 用户使用修饰符指定内置正则
    if (modifiers.tel) {
      exp = utilExp.tel
    }
    if (modifiers.id) {
      exp = utilExp.id
    }
  } else {          // 用户指定了正则,使用指定正则
    if (typeof value.exp === 'string') {  // 如果exp是字符串,省略模式
      exp = utilExp[value.exp]
    } else if (typeof value.exp === 'object') {        // exp为一个正则对象或者含有校验用的test方法的对象
      exp.test && (exp = value.exp)
    }
  }
  if (exp.test(el.value)) {
    data.illegal = false
    el.style.border = '1px solid transparent'
  } else {
    console.log('illegal')
    data.illegal = true
    el.style.border = '1px solid #f00'
  }
}

var checker = {
  bind: function (el, binding) {
    el.handler = function (e, isInput) {
      check(el, binding.modifiers, binding)
    }
    el.addEventListener('input', function (e) {
      el.handler(e, true)
    })
    // if (binding.modifiers.input) {
    // }
    // if (binding.modifiers.change) {
    //   el.addEventListener('change', function (e) {
    //     el.handler(e, false)
    //   })
    // }
    /*   el.tapObj = {};
     el.handler = function (e, isPc) { // This directive.handler
     var value = binding.value;
     value.event = e;
     var tagName = value.event.target.tagName.toLocaleLowerCase();
     !isPc ? value.tapObj = el.tapObj : null;

     if (tagName === 'input') {
     return value.event.target.focus();
     }
     if (!value && el.href && !binding.modifiers.prevent) {
     return window.location = el.href;
     }
     value.methods.call(this, value);
     };
     if (isPc()) {
     el.addEventListener('click', function (e) {
     if (binding.modifiers.stop)
     e.stopPropagation();
     if (binding.modifiers.prevent)
     e.preventDefault();
     el.handler(e, true)
     }, false);
     } else {
     el.addEventListener('touchstart', function (e) {
     if (binding.modifiers.stop)
     e.stopPropagation();
     if (binding.modifiers.prevent)
     e.preventDefault();
     touchstart(e, el);
     }, false);
     el.addEventListener('touchend', function (e) {
     let isInput = e.target.nodeName.toLocaleLowerCase() === 'input' && el.nodeName.toLocaleLowerCase() !== 'input'
     let isA = e.target.nodeName.toLocaleLowerCase() === 'a'
     try {
     Object.defineProperty(e, 'currentTarget', {// 重写currentTarget对象 与jq相同
     value: el,
     writable: true,
     enumerable: true,
     configurable: true
     })
     } catch (e) {
     // ios 7下对 e.currentTarget 用defineProperty会报错。
     // 报“TypeError：Attempting to configurable attribute of unconfigurable property”错误
     // 在catch里重写
     e.currentTarget = el
     }
     !isA && !isInput && e.preventDefault();

     return touchend(e, el);
     }, false);
     }*/
  },
  componentUpdated: function (el, binding) {
    /*    el.tapObj = {};
     el.handler = function (e, isPc) { // This directive.handler
     var value = binding.value;
     if (!value && el.href && !binding.modifiers.prevent) {
     return window.location = el.href;
     }
     value.event = e;
     !isPc ? value.tapObj = el.tapObj : null;
     value.methods.call(this, value);
     };*/
  },
  unbind: function (el) {
    // 卸载，别说了都是泪
    el.handler = function () {
    };
  }
}
var vCheck = {}
vCheck.install = function (Vue) {
  Vue.directive('check', checker)
};
vCheck.version = '3.0.2'
export default vCheck
