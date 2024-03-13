module.exports = {
    devServer: {
      proxy: {
        '/arm': {
          target: 'http://10.8.4.126:7009',
          changeOrigin: true,
          pathRewrite: {
          },
        },
        '/dddd': {
          target: 'http://10.9.1.114:18050',
          changeOrigin: true
        },
        '/api': {
          target: 'http://10.8.4.166:8123',
          changeOrigin: true
        }
      }
    }
  }