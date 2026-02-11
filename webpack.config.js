const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  target: "node",
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "google-client", "credentials.json"),
        },
        {
          from: path.resolve(__dirname, "openapi.yaml"),
          to: path.resolve(__dirname, "dist", "openapi.yaml"),
        },
        {
          from: path.resolve(__dirname, "docs", "swagger.html"),
          to: path.resolve(__dirname, "dist", "swagger.html"),
        },
      ],
    }),
    new Dotenv(),
  ],
};
