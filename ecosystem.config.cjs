module.exports = {
  apps: [
    {
      name: 'us-postal-tracking',
      script: 'server-prod.cjs',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
