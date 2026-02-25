import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import type { Configuration } from "webpack";

const config: Configuration = {
  // Указываем, что собираем приложение для Node.js, а не для браузера
  target: ['node', 'es2018'],
  entry: './src/server.ts', // Точка входа вашего приложения
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    clean: true, // Очищает папку dist перед каждой сборкой
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
};

export default config;
