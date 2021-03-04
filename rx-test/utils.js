const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function makeHtmlPlugin(key) {
  return new HtmlWebpackPlugin({
    template: `./pages/${key}/index.html`,
    filename: `${key}.html`,
    inject: true,
    chunks: [key],
  });
}

module.exports = {
  getEntry() {
    return new Promise((resolve) => {
      glob("pages/**/index.js", function (e, files) {
        if (e) return resolve({});
        resolve(
          files.reduce(
            (config, file) => {
              const match = file.match(/^pages\/(.*)\/index.js$/);
              if (!match) return config;

              const key = match[1];

              return {
                entry: { ...config.entry, [key]: "./" + file },
                plugins: [...config.plugins, makeHtmlPlugin(key)],
                keys: [...config.keys, key],
              };
            },
            {
              entry: {},
              plugins: [],
              keys: [],
            }
          )
        );
      });
    });
  },
};
