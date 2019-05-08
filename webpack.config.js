const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里。使用Extract Text Plugin插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin'); //引入清除文件插件
// const autoprefixer = require('autoprefixer')
module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/index-[hash].js',
    hashDigestLength: 8 // 默认长度是20
    // publicPath: '../dist/'
  },
  devServer: {
    contentBase: "./dist",//请求的资源路径
    //实时刷新
    inline: true,
    index: 'main.html',
    //publicPath: '/dist', //打包生成的静态文件所在的位置
    overlay: true//在编译出错的时候，在浏览器页面上显示错误

  },
  //loader
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          //编译后用什么loader来提取css文件
          fallback: "style-loader",  //loader（例如 'style-loader'）应用于当 CSS 没有被提取(也就是一个额外的 chunk，当 allChunks: false)
          use: [{
            loader: 'css-loader',  // 将 CSS 转化成 CommonJS 模块
            options: {
              modules: true, // 指定启用css modules
              localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
          }, {
            //指需要什么样的loader去编译文件
            loader: 'sass-loader' // 将 Sass 编译成 CSS
          }, {
            loader: "postcss-loader",
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 100 versions']      //必须设置支持的浏览器才会自动添加添加浏览器兼容
                })
              ]
            }
          },
          ],
          publicPath: "../",
        }),
      },
      {
        test: /\.(png|jepg|jpg)$/,
        use: [
          { loader: 'url-loader?limit=1024&name=./image/[name]-[hash:8].[ext]' }
        ]
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     { loader: 'html-withimg-loader' }
      //   ]
      // },
      {
        test: /\.(woff|ttf|svg|eot|xttf|woff2)$/,
        use: [
          //limit：字节，name:原名，ext:字节
          { loader: 'url-loader?limit=1024&name=./css/font/[name].[ext]' }
        ]
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/ //不要进行 babel-loader
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('./css/[name]-[hash].css'), //生成文件的文件名。可能包含 [name], [id] and [contenthash]
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      title: 'hello',
      minify: {
        removeAttributeQuotes: true,//去除引号
        removeComments: true,//去除注释
        removeEmptyAttributes: true,//去除空属性
        collapseWhitespace: true//去除空格
      },
      filename: 'main.html', //输出文件【注意：这里的根路径是module.exports.output.path】
    }),
    new webpack.BannerPlugin('版权所有'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CleanWebpackPlugin()
  ]
};
