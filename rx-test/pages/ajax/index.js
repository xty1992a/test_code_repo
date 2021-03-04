import * as Rx from "rxjs/Rx";
import axios from "axios";

Rx.Observable.fromPromise(axios.get("https://api.github.com/users/xty1992a"))
  .map((res) => res.data)
  .subscribe(
    (result) => {
      console.log(result);
    },
    (err) => {
      console.log(err);
    }
  );

console.log(Promise.resolve("ok"));
console.log([].includes(0));

class Class {
  name = "test";

  constructor(age) {
    this.age = age;
  }

  say() {
    console.log(this.name, this.age);
  }
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
async function main() {
  await sleep(1000);
  new Class(10).say();
}

main();
