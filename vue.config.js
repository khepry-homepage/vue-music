
module.exports = {
  lintOnSave: false,  //关闭eslint6语法检查
  publicPath: './',
  pages: {
    index: {
      //入口
      entry: 'src/main.js'
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  //路径别名
  configureWebpack: {
    //配置路径相关的时候用resolve 可以解决路径相关的问题
    resolve: {
        //别名ps：.vue等相关的其实已经写了，这里只需要写我们自己需要的
        alias: {
            //默认有@  他指向的是：src
            'assets': '@/assets',
            'pages': '@/pages',
            'components': '@/components',
            'discover': '@/views/discover',
            'api': '@/api',
            'store': '@/store',
            'router': '@/router'
        }
    }
  }
}