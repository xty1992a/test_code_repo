import "./index.less";

const $ = (s) => document.querySelector(s);

$("body").addEventListener("touchstart", (ev) => {
  console.log(ev);
});
