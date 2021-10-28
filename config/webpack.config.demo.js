let path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/demo/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../public')
  },
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015', 'stage-0']
      }
    },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }]
  },
  plugins: [
  ]
};