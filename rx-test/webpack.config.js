const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const pages = (p) => path.resolve(__dirname, "pages");

module.exports = new Promise(async (resolve) => {
  const { entry, plugins, keys } = await utils.getEntry();

  console.log(entry);

  const config = {
    entry,

    output: {
      publicPath: "/",
      filename: "[name].js",
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
      ],
    },

    plugins: [...plugins],
    devtool: "cheap-module-source-map",

    devServer: {
      clientLogLevel: "warning",
      port: 8080,
      quiet: true,
      disableHostCheck: true,
      publicPath: "/",
      contentBase: "/",
      before(app) {
        app.get("/", function (req, res) {
          const html = keys.reduce(
            (p, key) =>
              p +
              `<p style="font-size: 30px;"><a href="/${key}">${key}</a></p>`,
            ""
          );
          res.send(html);
        });
        keys.forEach((key) => {
          app.get(`/${key}`, function (req, res) {
            // res.redirect(`${key}.html`);
            res.sendFile(`${key}.html`, {
              root: __dirname,
            });
          });
        });
      },
    },
  };
  resolve(config);
});
