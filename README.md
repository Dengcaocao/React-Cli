# React-Cli

记录一下使用 Webpack5 + React 从零搭建一个脚手架项目。

1. 首先创建一个目录初始化 npm，并安装 webpack webpack-cli(用于在命令行中运行 webpack)。

```npm
npm init -y
npm i webpack webpack-cli --save-dev
```

2. 确定目录结构，与官网脚手架一致。不同的是我们在 config 目录下进行 webpack 配置。

3. 配置入口文件和输出目录、处理 css 及静态资源。

基本配置这里不做过多说明，webpack 官网写的很详细。

```js
// webpack.dev.js
module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    assetModuleFilename: 'assets/[name][hash:8][ext][query]'
  }
}
```

css 这里由于有多种预处理器，避免代码出现臃肿，这里使用一个函数返回。
注意：这里使用了 [postcss-loader](https://webpack.docschina.org/loaders/postcss-loader/) 对不同平台进行了兼容处理，需要指定兼容的版本。

```json
// package.json
"browserslist": [
  "last 2 version",
  "> 1%",
  "not dead"
]
```

asset 和 asset/resource 的区别在于 asset 会进行 base64 格式的转换，而 asset/resource 则是原封不动的输出。

```js
// webpack.dev.js
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
  ].filter(Boolean)
}

module.exports = {
  module: {
    rules: [
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
      }
    ]
  }
}
```

处理完了 css，接下来就是处理 js 了。目前浏览器是不支持 ES6+ 的语法的，这里我们使用 [babel-loader](https://webpack.docschina.org/loaders/babel-loader/) 进行处理，将其转换为浏览器认识的语法。规则**推荐** 使用 React 官网的 [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app)。

需要在根目录下创建 `.eslintrc.js` 文件并继承 eslint-config-react-app。


```js
// webpack.dev.js
module.exports = {
  module: {
    rules: [
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
    })
  ]
}
```

[html-webpack-plugin](https://webpack.docschina.org/plugins/html-webpack-plugin/) 简化 HTML 文件的创建，自动引入打包后的 js 文件。

```js
// webpack.dev.js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 知道 HTML 模版
      template: path.resolve(__dirname, '../public/index.html')
    }),
  ]
}
```

指定 source map 生成方式。以便精准定位错误信息。

```js
// webpack.dev.js
module.exports = {
  // 生成模式指定 source-map
  devtool: 'cheap-module-source-map',
}
```

开启代码分割，可详细进行 cacheGroups 分割。

```js
// webpack.dev.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

配置开发服务器，指定端口和 loaclhost，开启热模块替换。css-loader 默认开启了热模块，HTML 并没有，后续会讲。生成环境可移除该配置。

```js
module.exports = {
  devServer: {
    hot: true,
    open: true,
    port: 4180,
    // 防止页面刷新404
    historyApiFallback: true
  }
}
```

指定构建环境。

```js
module.exports = {
  mode: 'development'
}
```

到这里基本配置差不多就完成了。运行项目你会发现报错了，头疼 程序最怕报错了 哈哈哈！！！。

其实只需要使用 [cross-env](https://www.npmjs.com/package/cross-env) 指定一个环境就可以了。

```json
// package.json
"scripts": {
  "start": "npm run dev",
  "dev": "cross-env NODE_ENV=development webpack server --config ./config/webpack.dev.js",
  "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.prod.js"
}
```

配置好环境后 mode 就可以通过 `process.env.NODE_ENV` 获取了。

接下来最重要的来了，那就是引入 React。

```npm
npm install react react-dom react-router-dom
```

创建一个根容器组件，并渲染。

```js
// main.js
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'

// 渲染你的 React 组件
const root = createRoot(document.getElementById('app'))
root.render(
  <Router>
    <App />
  </Router>
)
```

这时你又会发现报红了 头疼 头疼 头疼。那是因为在引入文件时默认会以 js 进行访问。
只需要配置 `resolve.extensions` 自动补全扩展名就行啦。

```js
// webpack.dev.js
module.exports = {
  resolve: {
    // 解析模块，自动补全扩展名
    extensions: ['.jsx', '.js', '.json']
  }
}
```

到现在为止，项目终于是可以运行啦。前面是不是说过 HTML 并没有热替换功能，现在就来讲讲吧。React 热替换是借助了 [@pmmmwh/react-refresh-webpack-plugin](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin)，怎么配置就不写啦，插件使用方式写的很清楚。

至此 属于自己的脚手架项目就完成了。
