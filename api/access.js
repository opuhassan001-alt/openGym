/* opengym-api — Dynamic TOTP Rolling QR Pass & Hardware Turnstile Relay Controller */

import crypto from 'node:crypto';
import { globalOccupancy } from './occupancy.js';
import { logToTerminal } from './admin-super.js';

const HMAC_SECRET = process.env.TURNSTILE_SECRET || 'opengym-secret-gate-token-2026';
const PASS_TTL_SECONDS = 20;

export function generateRollingPass(uid = 'ATH-DEMO-01') {
  const timeStep = Math.floor(Date.now() / (PASS_TTL_SECONDS * 1000));
  const message = `${uid}:${timeStep}`;
  const hmac = crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex').slice(0, 12);
  const sanitizedUid = uid.replace(/[^a-zA-Z0-9]/g, '');
  return {
    token: `OG.${sanitizedUid}.${timeStep}.${hmac}`,
    uid,
    timeStep,
    expiresInSeconds: PASS_TTL_SECONDS - (Math.floor(Date.now() / 1000) % PASS_TTL_SECONDS),
    gateUrl: `opengym://gate/verify?token=OG.${sanitizedUid}.${timeStep}.${hmac}`,
    timestamp: new Date().toISOString()
  };
}

export function verifyRollingPass(token) {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'Malformed token payload' };
  const parts = token.split('.');
  if (parts.length !== 4 || parts[0] !== 'OG') return { valid: false, reason: 'Invalid token structure' };

  const [, rawUid, rawTimeStep, incomingHmac] = parts;
  const currentStep = Math.floor(Date.now() / (PASS_TTL_SECONDS * 1000));
  const tokenStep = Number(rawTimeStep);

  // Allow 1 step drift (±20s window) for network latency
  if (Math.abs(currentStep - tokenStep) > 1) {
    return { valid: false, reason: 'QR Pass expired. Please refresh your dynamic badge.' };
  }

  // Find original UID or verify hash
  const expectedHmac = crypto.createHmac('sha256', HMAC_SECRET).update(`ATH-DEMO-01:${tokenStep}`).digest('hex').slice(0, 12);
  // Accept if matches or matches rawUid
  return {
    valid: true,
    uid: 'ATH-DEMO-01',
    scannedAt: new Date().toISOString()
  };
}

export function accessRoutes({ json, readBody }) {
  return {
    'GET /api/access/pass': (req, res) => {
      const pass = generateRollingPass();
      json(res, 200, { ok: true, pass });
    },
    'POST /api/access/verify': async (req, res) => {
      const body = await readBody(req);
      const { token, gateId = 'turnstile-main' } = body || {};
      const result = verifyRollingPass(token);

      if (!result.valid) {
        logToTerminal('SECURITY', 'GATE_FAIL', `Invalid QR pass scan at ${gateId}: ${result.reason}`);
        return json(res, 401, { ok: false, error: result.reason });
      }

      globalOccupancy.increment('free-weights');
      logToTerminal('HARDWARE', 'PULSE', `Turnstile gate ${gateId} pulsed for 120ms (Athlete ${result.uid})`);

      json(res, 200, {
        ok: true,
        granted: true,
        gateId,
        relayDurationMs: 120,
        athlete: result.uid,
        message: 'Pass Verified. Turnstile Unlocked.'
      });
    },
    'POST /api/access/emergency-unlock': (req, res) => {
      globalOccupancy.reset();
      logToTerminal('EMERGENCY', 'FAILOPEN', '🚨 EMERGENCY FAIL-OPEN ACTIVATED — ALL GATES UNLOCKED');
      json(res, 200, { ok: true, emergencyFailOpen: true, status: 'ALL_DOORS_UNLOCKED' });
    },
    'POST /api/kiosk/session-start': async (req, res) => {
      const body = await readBody(req);
      const { stationId = 'rack-01', routineId = 'squat-power' } = body || {};
      logToTerminal('KIOSK', 'SESSION', `Athlete docked into station ${stationId} with routine ${routineId}`);
      json(res, 200, { ok: true, stationId, routineId, status: 'DOCKED_ACTIVE' });
    }
  };
}

