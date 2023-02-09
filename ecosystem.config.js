require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'Basic Express Mongodb',
      script: "./server.js",
      env: {
        APP_ENV: "development",
      },
      env_production: {
        APP_ENV: "production",
      },

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: -1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
    }
  ]
};
