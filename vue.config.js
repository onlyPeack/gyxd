'use strict'
const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin' )
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']
const defaultSettings = require('./src/settings.js')
// const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9529 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: './static',
  lintOnSave: false, // process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // [process.env.VUE_APP_BASE_API]: {
      //   target: `http://127.0.0.1:${port}/mock`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API]: ''
      //   }
      // }
      '/api/mini': {
        // target: 'http://47.92.91.63:8765', //正式
        target: 'http://192.168.1.219:8765',//测试
        // target: 'http://192.168.1.171:10050',//开发
        // target: 'http://192.168.1.55:10050',//史
        // target: 'http://192.168.1.91:10050',//岳
        // logLevel:'debug',
        pathRewrite: {
          '^/api/mini': '/api/mini'
          // '^/api/mini': ''
        }
      },
      '/api': {
        // target: 'http://47.92.91.63:8765', //正式
        target: 'http://192.168.1.219:8765',//测试
        // target: 'http://192.168.1.57:8765',//开发
        // logLevel:'debug',
        pathRewrite: {
          '^/api': '/api/'
        }
      },

      '/a': {
        // target: 'http://47.92.91.63:8765', //正式
        target: 'http://static.hejizx.com:20000', //正式
        // target: 'http://192.168.1.219:8765', //测试
        // target: 'http://192.168.3.11:20000', //测试
        // logLevel:'debug',
        // target: 'http://192.168.1.57:8765',//开发
        pathRewrite: {
          '^/a': '/a/api'
        }
      },
    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new SimpleProgressWebpackPlugin(),
      // new BundleAnalyzerPlugin({
      //   //  可以是`server`，`static`或`disabled`。
      //   //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
      //   //  在“静态”模式下，会生成带有报告的单个HTML文件。
      //   //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
      //   analyzerMode: 'server',
      //   //  将在“服务器”模式下使用的主机启动HTTP服务器。
      //   analyzerHost: '127.0.0.1',
      //   //  将在“服务器”模式下使用的端口启动HTTP服务器。
      //   analyzerPort: 8888,
      //   //  路径捆绑，将在`static`模式下生成的报告文件。
      //   //  相对于捆绑输出目录。
      //   reportFilename: 'report.html',
      //   //  模块大小默认显示在报告中。
      //   //  应该是`stat`，`parsed`或者`gzip`中的一个。
      //   //  有关更多信息，请参见“定义”一节。
      //   defaultSizes: 'parsed',
      //   //  在默认浏览器中自动打开报告
      //   openAnalyzer: true,
      //   //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
      //   generateStatsFile: false,
      //   //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
      //   //  相对于捆绑输出目录。
      //   statsFilename: 'stats.json',
      //   //  stats.toJson（）方法的选项。
      //   //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
      //   //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      //   statsOptions: null,
      //   logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
      // })
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
