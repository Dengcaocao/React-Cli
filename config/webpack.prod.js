const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const getCssLoader = type => {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    { // 处理样式兼容性，需配合packjson.browserslist指定兼容的版本
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    type
  ].filter(Boolean)
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:10].js',
    // 动态导入的文件
    chunkFilename: 'js/[name].[contenthash:10].chunk.js',
    assetModuleFilename: 'assets/[name][hash:8][ext][query]',
    clean: true // 在生成文件之前清空 output 目录
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/i,
        use: getCssLoader()
      },
      {
        test: /\.less$/i,
        use: getCssLoader('less-loader')
      },
      {
        test: /\.(sa|sc)ss$/i,
        use: getCssLoader('sass-loader')
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 小于 4kb 转为base64
          }
        }
      },
      // 其他资源
      {
        test: /\.(woff2?|ttf)/,
        type: 'asset/resource'
      },
      // 处理js兼容
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          // 可开启缓存提升速度
        }
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'), // 指定要检查的目录
      exclude: 'node_modules'
      // 可开启缓存提升速度
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // 将css抽取为单独文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:10].css',
      chunkFilename: 'css/[name].[contenthash:10].chunk.css'
    }),
    // 压缩css
    new CssMinimizerPlugin(),
    // 压缩js
    new TerserPlugin()
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    // 解析模块，自动补全扩展名
    extensions: ['.jsx', '.js', '.json']
  },
  mode: 'production'
}
