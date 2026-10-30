/* opengym-api — Standalone Enterprise Backend Server
   Zero-dependency Node.js HTTP server mounting all facility micro-services. */

import http from 'node:http';
import { accessRoutes } from './access.js';
import { occupancyRoutes, globalOccupancy } from './occupancy.js';
import { leaderboardRoutes } from './leaderboard.js';
import { nutritionRoutes } from './nutrition.js';
import { superAdminRoutes, logToTerminal } from './admin-super.js';

const PORT = Number(process.env.PORT) || 3000;

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function readSession() {
  return { id: 'usr_owner_001', name: 'Master Owner', admin: true };
}

// Assemble all route maps
const routes = {
  'GET /api/health': (req, res) => json(res, 200, { ok: true, status: 'operational', timestamp: new Date().toISOString() }),
  ...superAdminRoutes({ json, readBody, readSession }),
  ...accessRoutes({ json, readBody, readSession }),
  ...occupancyRoutes({ json }),
  ...leaderboardRoutes({ json, readBody, readSession }),
  ...nutritionRoutes({ json, readBody, readSession })
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With'
    });
    return res.end();
  }

  const [path] = req.url.split('?');
  const routeKey = `${req.method.toUpperCase()} ${path}`;

  if (routes[routeKey]) {
    try {
      await routes[routeKey](req, res);
    } catch (err) {
      console.error(`Error handling ${routeKey}:`, err);
      logToTerminal('ERROR', 'HANDLER', err.message);
      json(res, 500, { ok: false, error: 'Internal server error' });
    }
    return;
  }

  // Health probe fallback
  if (path === '/health' || path === '/') {
    return json(res, 200, {
      ok: true,
      service: 'OpenGym Enterprise Backend Kernel',
      status: 'ONLINE',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  }

  json(res, 404, { ok: false, error: `Endpoint '${routeKey}' not found` });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenGym Backend Kernel active on http://localhost:${PORT}`);
  logToTerminal('SYSTEM', 'BOOT', `Kernel listening on 0.0.0.0:${PORT}`);
});
