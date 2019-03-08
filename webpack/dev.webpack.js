const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://127.0.0.1:7012',
    path.join(__dirname, '/../view/index.tsx'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader?{configFileName: "tsconfig.client.json"}'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: {
              'font-size-base': '12px',
            },
            javascriptEnabled: true,
          },
        }],
      },
      { test: /.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=8192' },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/../view/index.html'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
  ],
  // devtool: 'source-map',
  devtool: 'eval-source-map',
  devServer: {
    // hot: true,
    contentBase: './dist/',
    historyApiFallback: true,
    hotOnly: true,
    publicPath: '/',
    host: '0.0.0.0',
    port: 7012,
    proxy: {
      "/api": "http://127.0.0.1:7000"
    }
  },
}
