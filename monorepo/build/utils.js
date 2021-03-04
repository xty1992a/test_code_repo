const fs = require("fs");
const path = require("path");

exports.pages = fs
  .readdirSync(path.resolve(__dirname, "../pages"))
  .filter((f) => {
    if (!fs.statSync(path.resolve(__dirname, `../pages/${f}`)).isDirectory()) {
      return false;
    }
    const pkg = require(`../pages/${f}/package.json`);
    return !!pkg.main;
  });
