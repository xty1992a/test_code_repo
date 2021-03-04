/**
 * Created by TY-xie on 2017/11/13.
 */
var calendar = require('./calendar')
var {
  solar2lunar, lunar2solar,
  toChinaMonth, toChinaDay,
  solarDays, monthDays,
  leapMonth, leapDays
} = calendar

// 获取农历年份
export function getGZYears(year) {
  year = year === undefined ? new Date().getFullYear() + 1 : year
  let list = []
  for (var i = 1900; i < year; i++) {
    let leap = leapMonth(i)
    let lYear = lunar2solar(i, 2, 1, leap === 1)
    list.push(lYear.gzYear + '(' + lYear.cYear + ')年')
  }
  return list
}
export function getSolarYears(year) {
  year = year === undefined ? new Date().getFullYear() + 1 : year
  let list = []
  for (var i = 1900; i < year; i++) {
    list.push(i + '年')
  }
  return list
}
export function getSolarMonth() {
  let list = []
  for (var i = 1; i < 13; i++) {
    list.push({text: i + '月', month: i})
  }
  return list
}
export function getSolarDays(y, month) {
  let m = month.month
  let list = []
  console.log(y, m, '-------')
  let days = solarDays(y, m)
  for (var i = 1; i < days + 1; i++) {
    list.push((((i + '').length < 2 ? '0' : '') + i) + '日')
  }
  return list
}
// 获取农历月份
export function getGZMonth(year) {
  let list = [
    {isLeap: false, month: 1},
    {isLeap: false, month: 2},
    {isLeap: false, month: 3},
    {isLeap: false, month: 4},
    {isLeap: false, month: 5},
    {isLeap: false, month: 6},
    {isLeap: false, month: 7},
    {isLeap: false, month: 8},
    {isLeap: false, month: 9},
    {isLeap: false, month: 10},
    {isLeap: false, month: 11},
    {isLeap: false, month: 12}
  ]
  let leap = leapMonth(year)
  if (leap) {
    let leapM = {isLeap: true, month: leap}
    list.splice(leap, 0, leapM)
  }
  list.map(item => {
    item.text = (item.isLeap ? '闰' : '') + toChinaMonth(item.month)
    return item
  })
  return list
}

// 获取农历日期
export function getGZDays(year, month) {
  let totalDays = (month.isLeap) ? leapDays(year) : monthDays(year, month.month)
  let list = []
  for (var i = 1; i < totalDays + 1; i++) {
    list.push(toChinaDay(i))
  }
  return list
}
