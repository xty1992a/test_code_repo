#!/usr/bin/env node

const webpack = require("webpack");
const utils = require("./utils");
const path = require("path");
const pagePath = (p) => path.resolve(__dirname, "../pages", p);
const devServer = require("./dev-server");
const devConfig = require("./webpack.dev");
const context = path.resolve(__dirname, "..");
const workspace = path.resolve(__dirname, "..");

const args = require("minimist")(process.argv.splice(2), {
  boolean: ["build", "dev", "open"],
  string: ["pages"],
});

let { pages, dev, build, open } = args;

pages = (pages || "").split(",");

if (dev) {
  console.log("dev ", pages);
  openDevServer(pages);
} else if (build) {
  console.log("build ", pages);
}

async function openDevServer(pages) {
  const entry = utils.pages
    .filter((page) => pages.some((key) => new RegExp(`^${key}`).test(page)))
    .reduce((map, page) => {
      const pkg = require(pagePath(`${page}/package.json`));
      return { ...map, [page]: pagePath(`${page}/${pkg.main}`) };
    }, {});
  const config = await devConfig({ context, workspace, report: false, entry });
  const server = await devServer(config, open);
}
