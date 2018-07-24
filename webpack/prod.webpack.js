const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    path.join(__dirname, '/../view/index.tsx'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    filename: 'main.js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader?{configFileName: "tsconfig.client.json"}'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', `less-loader?{sourceMap: true}`] },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
  ],
  devtool: 'eval-source-map',
}
