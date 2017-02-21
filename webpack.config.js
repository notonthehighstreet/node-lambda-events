module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    library: "LambdaEvents",
  },
  externals: [
    /^[a-z\-0-9]+$/,
  ],
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
