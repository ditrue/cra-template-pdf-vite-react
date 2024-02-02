const { createProxyMiddleware } = require('http-proxy-middleware');
console.log(process.env.API_PPM_AUTHORIZATION)
module.exports = function(app) {
  app.use(
    '/workbenchApi',
    createProxyMiddleware({
      target: process.env.API_TARGET,
      changeOrigin: true,
      pathRewrite: {
        '^/workbenchApi/': '/workbenchApi/'
      }
    })
  );
  app.use(
    '/api/v3',
    createProxyMiddleware({
      target: process.env.API_PPM_TARGET,
      changeOrigin: true,
      headers: {
        Authorization: process.env.API_PPM_AUTHORIZATION,
      },
      // pathRewrite: {
      //   '^/workbenchApi/': '/workbenchApi/'
      // }
    })
  );
};
