const Rx = require("rxjs/Rx");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const instance = axios.create({});

const link = "http://www.biquge.info/0_821/394523.html";

/*axios.defaults.headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
  Host: "www.biquge.info",
  "Accept-Language": "zh,en;q=0.9,zh-CN;q=0.8",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*!/!*;q=0.8,application/signed-exchange;v=b3;q=0.9",
};

Rx.Observable.fromPromise(axios.get(link))
  // .map((res) => cheerio.load(res.data))
  .subscribe(($) => {
    return console.log($);
    // console.log($.html());

    const next = {
      next: $('.bottem1 a:contains("下一章")').attr("href"),
      content: $("#content").text(),
      title: $(".bookname h1").text(),
    };

    console.log(next);
  });
*/

const writer = Rx.Observable.bindNodeCallback(fs.writeFile);

/*writer("./data.json", JSON.stringify({ hello: "world" }, "utf8")).subscribe({
  next(e) {
    console.log(e);
    return Rx.Observable.from([1, 2]);
  },
  error(e) {
    console.log(e);
  },
});*/

Rx.Observable.of("1", "2", "3", "4")
  .map((i) => +i)
  .subscribe({
    sum: 0,
    next(value) {
      this.sum += value;
      console.log("next", value);
    },
    complete() {
      console.log("complete", this.sum);
    },
  });
