const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Endereço local para a API
    createProxyMiddleware({
      target: 'https://script.google.com/macros/s/AKfycbzD-dhfV96sJImt1RAkZ1QQ_U3s9AnN2YpwGrLmA4kCd_NTS4nobl8nw2cBaDXfkynfTg/exec', // URL da API
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove "/api" da URL antes de enviar
      },
    })
  );
};
