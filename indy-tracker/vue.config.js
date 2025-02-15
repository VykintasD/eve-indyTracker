const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(
          path.join('../certs', process.env.HTTPS_KEY_FILENAME)
        ),
        cert: fs.readFileSync(
          path.join('../certs', process.env.HTTPS_CERT_FILENAME)
        ),
      },
    },
    host: 'localhost',
    port: 8080,
  },
});
