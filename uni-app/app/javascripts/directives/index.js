/*
const windowHeight = window.innerHeight

const fixedInputBug = function () {
  let windowFocusHeight = window.innerHeight
  if (windowHeight === windowFocusHeight) {
    return
  }
  console.log(windowHeight + '--' + windowFocusHeight);
  console.log('修复');
  let currentPosition;
  let speed = 1; //页面滚动距离
  currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
  currentPosition -= speed;
  window.scrollTo(0, currentPosition); //页面向上滚动
  currentPosition += speed; //speed变量
  window.scrollTo(0, currentPosition); //页面向下滚动
}


const directives = {
  fixed:{
    bind: function(el) {
      el.addEventListener('focusout', fixedInputBug)
    },
    unbind(el){
      el.removeEventListener('focusout', fixedInputBug)
    }
  }
}
*/

export default {
  install:Vue => {
    // Object.keys(directives).forEach(key => {
    //   console.log('key:',key)
    //   Vue.directive(key, directives[key])
    // })
  }
}
