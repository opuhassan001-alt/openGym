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
  'GET /api/config': (req, res) => json(res, 200, { guest: true, allowRegistration: true, coach: { enabled: true } }),
  'GET /api/me': (req, res) => json(res, 200, { user: { id: 'usr_owner_001', name: 'Master Owner', admin: true }, admin: true }),
  'GET /api/state': (req, res) => json(res, 200, { S: {}, rev: 1 }),
  'PUT /api/state': (req, res) => json(res, 200, { ok: true, rev: 2 }),
  'GET /api/data': (req, res) => json(res, 200, { state: {}, rev: 1 }),
  'PUT /api/data': (req, res) => json(res, 200, { ok: true, rev: 2 }),
  'GET /api/data/rev': (req, res) => json(res, 200, { rev: 1, wid: 'w_1' }),
  'POST /api/logout': (req, res) => json(res, 200, { ok: true }),
  'GET /api/admin/users': (req, res) => json(res, 200, {
    users: [
      { id: 'usr_owner_001', name: 'Master Owner (Lead Admin)', email: 'owner@opengym.internal', tier: 'Super Admin', admin: true, disabled: false, workouts: 342, lastSync: Date.now() - 60000, created: '2026-01-01' },
      { id: 'usr_ath_101', name: 'Marcus Vance', email: 'marcus.v@titan.io', tier: 'Titan Athlete', disabled: false, workouts: 184, lastSync: Date.now() - 720000, created: '2026-02-14' },
      { id: 'usr_ath_102', name: 'Elena Rostova', email: 'elena.r@athletics.org', tier: 'Apex Athlete', disabled: false, workouts: 142, lastSync: Date.now() - 3600000, created: '2026-02-28' },
      { id: 'usr_ath_103', name: 'Devon King', email: 'devon.k@powerlift.net', tier: 'Apex Athlete', disabled: false, workouts: 96, lastSync: Date.now() - 10800000, created: '2026-03-10' },
      { id: 'usr_ath_104', name: 'Aisha Mansoor', email: 'aisha.m@gymfit.com', tier: 'Pro Athlete', disabled: false, workouts: 67, lastSync: Date.now() - 86400000, created: '2026-04-05' }
    ]
  }),
  'GET /api/admin/invites': (req, res) => json(res, 200, { invites: [] }),
  'GET /api/admin/audit': (req, res) => json(res, 200, { entries: [] }),
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
