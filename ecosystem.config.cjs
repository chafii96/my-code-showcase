/**
 * PM2 Ecosystem Configuration — SwiftTrack Hub
 * الاستخدام: pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'swifttrack-hub',
      script: 'server/index.js',
      cwd: '/var/www/swifttrack-hub',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
