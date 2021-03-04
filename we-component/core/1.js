const obj = {a: 1, b: 1, c: {p: '1'}};
const p = new Proxy(obj, {
  get(target, p, receiver) {
	if (target.hasOwnProperty(p)) return target[p];
  },
  set(target, p, value) {
	console.log(target, p, value);
  }
});

p.c = 1;
