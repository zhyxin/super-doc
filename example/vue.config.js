module.exports = {
    devServer: {
      proxy: {
        '/arm': {
          target: 'https://arm2.awebide.com/',
          changeOrigin: true
        },
      }
    }
  }