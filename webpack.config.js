const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.tsx',
    content: './src/content.ts',
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        include: path.resolve(__dirname, 'src'),
        loader: "ts-loader" 
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      template: 'src/index.html',
      title: "Chrome Extension",
      excludeChunks: ["background", "content"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "." },
      ],
    }),
  ]
}
