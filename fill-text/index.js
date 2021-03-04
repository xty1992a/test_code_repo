const WIDTH = 600;
const HEIGHT = 300;
const maxDistance = 13;
const minDistance = 0;

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d');
let flag = true;
cvs.width = WIDTH;
cvs.height = HEIGHT;
document.body.appendChild(cvs);

function debounce(fn, interval = 500) {
  let timeout = null;

  return function () {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
	  fn.apply(this, arguments);
	}, interval);
  };
}

const Tween = {
  Linear: function (t, b, c, d) {
	return c * t / d + b;
  }
};

const getDistance = function (point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};

function getShape(text, size = 300) {
  ctx.font = size + 'px sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = 'top';
  ctx.fillText(text, 0, 10);
  const imgData = ctx.getImageData(0, 0, size, size).data;

  var gap = 5;
  var pos = [];
  var x = 0, y = 0, index = 0;
  for (var i = 0; i < imgData.length; i += (4 * gap)) {
	if (imgData[i + 3] === 255) {
	  // 塞入此时的坐标
	  pos.push({
		x: x,
		y: y
	  });
	}
	index = Math.floor(i / 4);
	x = index % size;
	y = Math.floor(index / size);
	if (x >= size - gap) {
	  i += gap * 4 * size;
	}
  }
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  return pos;
}

function drawShape(text, size = 1) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const shape = getShape(text, size);
  shape.forEach(pos => {
	ctx.fillRect(pos.x, pos.y, 1, 1);
  });
}

const input = document.createElement('input');
input.setAttribute('maxlength', 1);

function handlerInput() {
  if (!input.value) return;
  drawShape(input.value, 300);
}

const onInput = debounce(handlerInput);

input.addEventListener('input', onInput);

document.body.appendChild(input);

drawShape('A', 300);
