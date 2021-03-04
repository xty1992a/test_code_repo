/**
 * Created by TY-xie on 2017/10/24.
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
	return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
	return
  }

  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function getData(el, name, val) {
  let prefix = 'data-'
  if (val) {
	return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
	let rect = el.getBoundingClientRect()
	return {
	  top: rect.top,
	  left: rect.left,
	  width: rect.width,
	  height: rect.height,
	}
  } else {
	return {
	  top: el.offsetTop,
	  left: el.offsetLeft,
	  width: el.offsetWidth,
	  height: el.offsetHeight,
	}
  }
}

export function backTop(dom) {
  console.log(dom)
  let height = dom.scrollTop
  let arr = []
  let lang = height / 10
  while (height > 0) {
	let gap = height -= lang
	arr.push(Math.round(Math.max(gap, 0)))
  }
  requestAnimationFrame(step)
  function step() {
	let gap = arr.shift()
	dom.scrollTop = gap
	gap && requestAnimationFrame(step)
  }
}