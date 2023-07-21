const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getCssLoader = type => {
  return [
    'style-loader',
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
  ]
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    // 动态导入的文件
    chunkFilename: 'js/[name].chunk.js',
    assetModuleFilename: 'assets/[name][hash:8][ext][query]'
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
    })
  ],
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    // 解析模块，自动补全扩展名
    extensions: ['.jsx', '.js', '.json']
  },
  devServer: {
    hot: true,
    open: true,
    port: 4180
  },
  mode: 'development'
}