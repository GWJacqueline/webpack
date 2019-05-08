# webpack demo

## 关于 webpack 常用的配置,loader,plugins 用法的一个小 demo。

> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Webpack 是一个 js 应用程序的静态模块打包器。本身只能打包 js 模块，我们可以通过 loader 让 webpack 去处理那些非 JS 文件。它会将所有类型的文件，转化为应用程序的依赖图。总而言之，webpack 是一个能实现模块化打包的工具。之前的项目一直采用 gulp 进行打包，gulp 和 webpack 相比，gulp 是一种能够优化前端的开发流程的工具，而 WebPack 是一种模块化的解决方案。接下来，我将从 webpack 的工作方式、安装、使用、构建本地服务器以及 entry(入口)、output(出口)、loader、plugins(插件)四个核心概念总结下 webpack。

<!--more-->

## 工作方式

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Webpack 会把你的项目当做一个整体，通过给定的主文件（例如：index.js）开始找到你项目所有的依赖文件，并使用 loaders 去处理它们，最后打包为一个或多个浏览器可识别的 JS 文件。把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack 将从这个文件开始找到你的项目的所有依赖文件，使用 loaders 处理它们，最后打包为一个（或多个）浏览器可识别的 JavaScript 文件。

## 安装

```
//全局安装webpack以及脚手架
npm install webpack webpack-cli -g
//局部安装
npm install webpack webpack-cli -S
```

## 使用

1.新建空文件夹<br>
2.cd 到需要打包的项目<br> 3.创建一个标准的 npm 说明文件，里面蕴含了丰富的信息，包括当前项目的依赖模块，自定义的脚本任务等等<br>

```
npm init
```

4.安装 webpack 到项目目录<br>

```
npm install webpack webpack-cli -S
```

5.配置**webpack.config.js**<br> 6.启动 webpack 进行打包

```
//生产环境
webpack --mode production
//开发环境，可通过package.json快捷配置，下面说
webpack --mode development
```

## 构建本地服务器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**webpack-dev-server**基于 node.js 构建。能够帮助浏览器监听你的代码的修改，并自动刷新显示修改后的结果。我们需要先安装下。

```
npm install webpack-dev-server -S
```

webpack.config.js 中配置

```
module.exports = {
    devServer: {
        //本地服务器加载的页面所在的目录
        contentBase: "./build",
        //实时刷新
        inline: true,
        //如果设置为true，所有的跳转将指向index.html。针对单页面应用
        historyApiFallback: false,
        //监听端口,默认为8080
        port:4040,
        //默认为index.html
        index: 'main.html'
    }
}
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;具体配置可以查看[这里](https://webpack.js.org/configuration/dev-server/)。接下来我们把运行命令配置到 npm 的 script 中。因为真正开发的时候 webpack 命令会敲很长，我们在 package.json 中设置 scripts 值就可以去调用对应的指令，是非常方便快捷的。

package.json

```
"scripts": {
    "deploy": "webpack --mode development",
    "dev": "webpack-dev-server --open --inline"
  },
```

在根目录下执行命令

生成未压缩的代码

```
npm run deploy
```

启动服务器

```
npm run dev
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运行后，webpack 会自动帮我们启动一个 web 服务器，并监听文件修改，然后自动重新合并代码。

## entry(入口)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entry 告诉 webpack 应该使用哪个模块作为内部依赖图的起始点。进入起始点后，webpack 会找出哪些模块和库是起始点所依赖的。每个依赖被处理后，最后会被输出到 bundles 文件中。

webpack.config.js

```
//里面采取commonJs的书写规范，比如module.exports语法
module.exports = {
   //唯一入口文件
  //默认值为‘./src’
  entry: './src/index.js'
};
```

## output(出口)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;output 告诉 webpack 在哪里输出它所创建的 bundles，以及该如何命名这些文件。

webpack.config.js

```
//path模块是从node.js导入的，主要用来控制生成文件的目录
const path = require('path');
module.exports = {
//默认值为‘./dist’
  output: {
        //将参数中的路径、路径片段解析成一个绝对地址。_dirname表示当前文件所在的绝对路径
        path: path.resolve(__dirname, 'build'),
        //打包后输出文件的文件名
        filename: 'js/index-[hash].js'

    },
};
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在 webpack.config.js 中配置了出入口后，我们只需在终端里运行 webpack，就会自动引用 webpack.config.js 文件中的配置选项。

## loader

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;webpack 本身只支持 js,不支持 image、css、html...,如果要让 webpack 支持这些，就需要使用 loader。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后我们就可以利用 webpack 的打包能力，对它们进行处理。记录下我常用的 loader 吧。

### scss,css 打包压缩

#### 安装

编译打包 scss、css

```
npm install style-loader css-loader node-sass sass-loader -S

```

使用 Extract Text Plugin 插件。将 css 各文件分离，生成的文件 不嵌入 bundle.js，而是放在单独的文件里。

```
npm install extract-text-webpack-plugin@next -S
```

#### 使用

1.代码将打包到入口文件里

```
import "../scss/style.scss";
```

2.修改 webpack.config.js

```
//css各文件分离
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
        hashDigestLength: 8 // 默认长度是20
    }
    //loader
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", //将 JS 字符串生成为 style 节点
                    use: [{
                        loader: 'css-loader',  // 将 CSS 转化成 CommonJS 模块
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }, {
                        loader: 'sass-loader' // 将 Sass 编译成 CSS
                    },]
                })
            }
        ]
    },
    //插件
    plugins: [
        new ExtractTextPlugin('./css/[name]-[hash].css'), //生成文件的文件名
    ]
}
```

#### css 模块化

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SS modules 的技术意在把 JS 的模块化思想带入 CSS 中来，通过 CSS 模块,所有的类名只作用于当前模块。通过在 CSS loader 进行配置，就可以直接把 CSS 的类名传递到组件的代码中，这样做有效避免了全局污染。<br>

1.使用：<br>

webpack.config.js

```
options: {
    modules: true, // 指定启用css modules
    localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
}
```

index.js

```
import styles from "../scss/style.scss";
document.write('<div class="' + styles.green + '">绿色</div>');
let a = 10;
```

style.scss

```
.green {
    color: green;
}
```

最后结果：

```
<div class="style__green--XLkki">绿色</div>
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样，即使相同的类名也不会造成不同组件之间的污染

### 图片

#### css 自动添加前缀

1.安装

```
npm install  postcss-loader autoprefixer -S
```

2.使用

```
module.exports = {
    //loader
    module: {
        rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]'
                        }
                    }, {
                        loader: 'sass-loader'
                    }, {
                        //添加前缀
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require('autoprefixer')({
                                    browsers: ['last 100 versions']      //必须设置支持的浏览器才会自动添加添加浏览器兼容
                                })
                            ]
                        }
                    },],
                    publicPath: "../",
                    }
                ),
            },
        ]
    }
}
```

#### css 中的图片处理

##### 安装

```
npm install file-loader -S
```

##### 使用

1.修改 webpack.config.js

```
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
        hashDigestLength: 8 // 默认长度是20
    }
    //loader
    module: {
        rules: [
            {
                test: /\.(png|jepg|jpg)$/,
                use: [
                        //loader 后面 limit 字段代表图片打包限制，这个限制并不是说超过了就不能打包，而是指当图片大小小于限制时会自动转成 base64 码引用
                        //name 字段来指定图片打包的目录与文件名
                        { loader: 'url-loader?limit=1024&name=./image/[name]-[hash:8].[ext]' }
                ]
            }
        ]
    }
}
```

#### html 中的图片

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用’url-loader‘只能将 css 中的图片进行打包，如果想将 html 中图片进行打包，需要用到**html-withimg-loader**插件

##### 安装

```
npm install html-withimg-loader -S
```

##### 使用

```
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
        hashDigestLength: 8 // 默认长度是20
    }
    //loader
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    { loader: 'html-withimg-loader' }
                ]
            }
        ]
    }
}
```

#### js 中的图片

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在 js 中引用的图片应该通过模块化的方式引用图片路径，才可以成功打包。

##### 使用

```
var imgUrl = require('../image/js.png');
document.write('<img src="' + imgUrl + '" />');
```

### 字体图标

```
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
        hashDigestLength: 8 // 默认长度是20
    }
    //loader
    module: {
        rules: [
            {
                test:/\.(woff|ttf|svg|eot|xttf|woff2)$/,
                use: 'url-loader?limit=1024&name=./fonts/[name].[ext]'
            }
        ]
    }
}
```

### Babel

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Babel 能让帮助我们将 ES6、ES7 等新标准被当前使用的浏览器支持。能让我们使用基于 JS 进行的扩展语言，比如 React 的 JSX。

#### 安装

```
npm install babel-core babel-loader@7 babel-preset-env babel-preset-react -S
```

#### 使用

```
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
        hashDigestLength: 8 // 默认长度是20
    }
    //loader
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                loader: "babel-loader"
                },
                exclude: /node_modules/ //不要进行 babel-loader
            },
        ]
    }
}
```

## plugins 插件

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;插件接口使 webpack 变得更加灵活。记录下我常用的插件把。

### html-webpack-plugin

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用户可以使用模版，通过 webpack 生成 html 文件。<br>

1.安装<br>

```
npm install html-webpack-plugin -S
```

2.使用

```
const path = require('path');
//添加插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '学习 webpack',
            template: "./src/html/main.html",  //模版的路径
            filename: 'html/main.html', //生成html的文件
            minify: {
                removeAttributeQuotes: true,//去除引号
                removeComments: true,//去除注释
                removeEmptyAttributes: true,//去除空属性
                collapseWhitespace: true//去除空格
            }
        })
    ]
}
```

3.**注意：** 当和“html-withimg-loader”一起使用时，会导致 html 文件中的类似<%= htmlWebpackPlugin.options.title%>无法解析。但是我们可以通过 requier 引入图片<br/>
解决办法：

```
//index.html
<img src="<%= require('../image/html.png')%>" alt="picture" />
```

### clean-webpack-plugin

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加了 hash 之后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，**clean-webpack-plugin**可以帮助我们删除残余文件。

1.安装

```
npm install clean-webpack-plugin -S
```

2.使用

```
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

### BannerPlugin

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加版权声明的插件 1.使用<br>

```
const path = require('path');
const webpack = require('webpack');
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
    },
    plugins: [
        new webpack.BannerPlugin('版权所有'),
    ]
}
```

2.效果

```
//index.js
/*! 版权所有 */
!function(e)();
```

### webpack.optimize.OccurenceOrderPlugin

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该插件的作用是为组件分配 id，通过这个插件 webpack 会分析使用频率最多的模块，并未他们分配最小的 id，id 越小表示模块被找到的速度会更快。此为内置插件，所以不需要安装。<br>
使用<br>

```
const webpack = require('webpack');
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
}
```

### webpack.ProvidePlugin

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;它是一个全局挂载插件。可以自动加载模块，无需每处 import 或 require。如果项目中需要使用 jQuery 类似的工具，使用它，可以使 jquery 变成全局变量，这样在项目的任何地方都可以直接使用。它也是内置插件，不需要安装。<br>
使用<br>

安装 jquery 依赖

```
npm install jquery
```

webpack.config.js

```
const webpack = require('webpack');
module.exports = {
    // 入口
    entry: './src/js/index.js',
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index-[hash].js'
    },
    plugins: [
         new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
    ]
}
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;webpack 的 loader 和 plugin 非常多，这里只列出了一些常用的。具体的请看[官网](https://webpack.js.org/api)。以上完整的 demo 在[这里]()查看
