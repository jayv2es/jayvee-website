// This is used to start the script with pm2 anti-crash package

module.exports = {
    apps: [{
      name: 'yourAppName',
      script: 'app.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1,
      autorestart: true,
      watch: false,
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
      time: true,
      env: {
      },
    }],
  };