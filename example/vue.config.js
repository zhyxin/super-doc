module.exports = {
    devServer: {
      proxy: {
        '/arm': {
          target: 'http://10.8.4.126:7009',
          changeOrigin: true,
          pathRewrite: {
          },
        },
        '/akb': {
          target: 'http://10.8.4.148:9898',
          changeOrigin: true,
          pathRewrite: {
          },
        },
        '/imagePreview': {
          target: 'http://10.8.4.148:9000',
          changeOrigin: true,
          pathRewrite: {
            pathRewrite: {
              '^/imagePreview': '',
            },
          },
        },
        '/dddd': {
          target: 'http://10.9.1.114:18050',
          changeOrigin: true
        },
        // '/api': {
        //   target: 'http://10.8.4.166:8123',
        //   changeOrigin: true
        // },
        '/docs': {
          target: 'http://10.8.4.166:8123',
          changeOrigin: true,
          pathRewrite: {
            '^/docs': '',
          },
        },
      }
    }
  }