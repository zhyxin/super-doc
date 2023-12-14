module.exports = {
    devServer: {
      proxy: {
        '/arm': {
          target: 'http://10.8.4.126:7009',
          changeOrigin: true,
          pathRewrite: {
          },
        },
      }
    }
  }