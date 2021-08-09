const path = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = {
  target: 'web',
  output: {
    filename: 'app.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: require( './babel.config.js' ),
          },
          {
            loader: 'eslint-loader',
            options: require( './eslint.config.js' ),
          },
        ],
      },
      {
        test:/\.(s*)css$/,
        use:[
          'style-loader',
          'css-loader', 
          'sass-loader',
        ]
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin( {
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: true,
      } ),
    ],
  },
};
