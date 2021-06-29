const TerserPlugin = require( 'terser-webpack-plugin' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );
const resolve = require( 'path' ).resolve;
const webpack = require( 'webpack' );

module.exports = env => {
  const plugins = [ 
    new ESLintPlugin( require( './eslint.config.js' ) ),
  ];
  const { WEBPACK_BUILD: production } = env;
  if( ! production ) {
    plugins.push( new webpack.SourceMapDevToolPlugin( {} ) );
  }
  
  return {
    target: 'web',
    output: {
      path: resolve( 'dist' ),
      filename: pathData => {
        return pathData.chunk.name === 'main' ? 'polished-content.min.js' : 'vendors/polished-content-vendors.min.js';
      },
      chunkFilename: pathData => {
        let isVendor;
        let ids;
        let fileName = '';
        
        if( pathData.chunk.id ) {
          const name = pathData.chunk.id.toString();
          isVendor = name.search( 'vendor' ) !== -1;
          
          const ids = name.split( '-' );
          fileName = ids[ ids.length - 1 ];
        }
        return pathData.chunk.chunkReason ? `vendors/polished-content-${ fileName }.min.js` : `components/polished-content_[id].min.js`;
      },
      publicPath: 'js/',
    },
    resolve: {
      alias: {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      },
    },
    module: {
      noParse: [
        /benchmark/,
      ],
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: require( './babel.config.js' ),
            },
            {
              loader: 'source-map-loader',
              options: {},
            },
          ],
        },
        {
          test: /\.(s*)css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                injectType: 'styleTag',
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ]
        },
        /*
        {
          test: /\.(woff|woff2)$/,
          use: {
            loader: 'url-loader',
          },
        },
        */
      ],
    },
    stats: 'error-details',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
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
    plugins,
    devtool: false,
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
  };
}
