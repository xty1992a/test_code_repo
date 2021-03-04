import * as Rx from "rxjs/Rx";
import _ from "lodash";

const btn = document.getElementById("btn");
const secret = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
  "KeyB",
  "KeyA",
];

Rx.Observable.fromEvent(btn, "click")
  // .debounce(() => Rx.Observable.interval(1000))
  .debounceTime(1000)
  .bufferCount(3)
  .scan((count) => count + 1, 0)
  // .delay(5000)
  .subscribe((count) => console.log("Clicked!", count));

Rx.Observable.fromEvent(document, "keyup")
  .map((e) => e.code)
  .bufferCount(12, 1)
  // .throttleTime(3000)
  .subscribe((keymap) => {
    if (_.isEqual(keymap, secret)) {
      console.log("surprise motherfucker!");
    }
  });
