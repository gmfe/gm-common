const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function expressMiddleware (router) {
  router.use('/enterprise', createProxyMiddleware({
    target: 'http://dev.guanmai.cn:8811/',
    changeOrigin: true,
  }))
}