const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function expressMiddleware(router) {
  router.use(
    '/ceres',
    createProxyMiddleware({
      target: 'http://x.test.guanmai.cn/',
      changeOrigin: true,
    }),
  )
}
