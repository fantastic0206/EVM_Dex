const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: { path: path.resolve(__dirname, "dist") },
  module: {
    test: /\.js$/,
    use: ["source-map-loader"],
    enforce: "pre",
    exclude: /node_modules/
  },
  stats: {
    warningsFilter: /Failed to parse source map/,
  },
};