const VueLoaderPlugin = require("vue-loader/lib/plugin");
const PRODUCTION = process.env.NODE_ENV === "production";
const path = require("path");
const baseConfig = ({ root, workspace }) => {
  return {
    entry: {},
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".vue"],
      modules: ["pages/shared/node_modules", "node_modules"],
      alias: {
        shared: root("pages/shared"),
        pages: root("pages"),
      },
    },
    output: {
      path: root("dist"),
      filename: PRODUCTION ? "[name]_[chunkhash:8].js" : "[name].js",
      chunkFilename: PRODUCTION ? "[name]_[chunkhash:8].js" : "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.less$/,
          use: [
            "vue-style-loader",
            "css-loader",
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "[name].[ext]",
            publicPath: "/",
          },
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
  };
};

module.exports = baseConfig;
