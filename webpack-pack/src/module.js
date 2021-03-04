export const sleep = time => new Promise(resolve => setTimeout(resolve, time));
/*
// import {add} from 'lodash-es';
const add = (...args) => args.reduce((p, i) => p + i, 0);

export const test = (...args) => new Promise(async resolve => {
  await sleep(1000);
  resolve(add(...args));
});
*/
!async function f() {
  await sleep(1000);
  console.log('world');
}();

export class EmitAble {
  _task = {};

  on(event, callback) {
	this._task[event] = callback;
  }

  fire(event, payload) {
	this._task[event] && this._task[event](payload);
  }
}
