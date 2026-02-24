import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import type { Configuration } from "webpack";

const config: Configuration = {
  target: "node",
  entry: "./src/server.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "lib", "google-client", "credentials.json"),
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
  externals: {
    "utf-validate": "commonjs utf-validate",
    "bufferutil": "commonjs bufferutil",
    kerberos: "commonjs kerberos",
    "@mongodb-js/zstd": "commonjs @mongodb-js/zstd",
    "supports-color": "commonjs supports-color",
    "@aws-sdk/credential-providers": "commonjs @aws-sdk/credential-providers",
    snappy: "commonjs snappy",
    "mongodb-client-encryption": "commonjs mongodb-client-encryption",
  },
  ignoreWarnings: [
    /require\.extensions/,
    /Critical dependency/,
  ],
};

export default config;
