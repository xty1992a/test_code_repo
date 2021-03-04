console.log("hello about");
import Vue from "vue";
import App from "./App";

new Vue({
  components: { App },
  render: (h) => h(App),
}).$mount("#app");

// run();

function run() {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d");
  cvs.width = 494;
  cvs.height = 582;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "30px bold";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      console.log(index, j * 123.5, i * 97);
      ctx.fillText(index, j * 123.5 + 61.75, i * 97 + 48.5, 123.5);
    }
  }

  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.moveTo(123.5 * i, 0);
    ctx.lineTo(123.5 * i, 582);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < 7; i++) {
    ctx.save();
    ctx.moveTo(0, 97 * i);
    ctx.lineTo(494, 97 * i);
    ctx.stroke();
    ctx.restore();
  }

  cvs.addEventListener("click", function () {
    cvs.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      download(url);
    }, "image/png");
  });

  document.body.appendChild(cvs);
}

function download(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = Date.now() + ".png";
  link.click();
}
