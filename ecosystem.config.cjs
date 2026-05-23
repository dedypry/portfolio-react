/**
 * PM2 process definition for the Next.js portfolio.
 *
 * Usage on the server (after `npm run build`):
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 save
 *
 * Notes:
 *   - We let Next read GEMINI_API_KEY from `.env.local` (loaded automatically).
 *     PM2 only needs to know NODE_ENV + PORT. Do NOT put secrets here.
 *   - Single instance is fine for a portfolio. Switch `instances` to "max" and
 *     `exec_mode` to "cluster" if you ever need more throughput.
 */
module.exports = {
  apps: [
    {
      name: "dedypry",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3450",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
