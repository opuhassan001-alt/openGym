/* opengym-api — Real-time Floor Occupancy Tracker & SSE Engine */

class OccupancyTracker {
  constructor() {
    this.count = 42;
    this.maxCapacity = 150;
    this.zones = {
      'free-weights': 18,
      'cardio-zone': 12,
      'cable-machines': 8,
      'recovery-suite': 4
    };
    this.clients = new Set();
  }

  getCount() {
    return this.count;
  }

  getCapacityPercent() {
    return Math.round((this.count / this.maxCapacity) * 100);
  }

  getStatus() {
    const p = this.getCapacityPercent();
    if (p < 40) return { level: 'OPTIMAL', text: 'Low Density — Fast Equipment Turnover', color: '#10B981' };
    if (p < 75) return { level: 'MODERATE', text: 'Moderate Density — Standard Wait Times', color: '#ccff00' };
    if (p < 90) return { level: 'HIGH', text: 'High Density — Peak Hour Surge', color: '#F59E0B' };
    return { level: 'CAPACITY_CRITICAL', text: 'Maximum Safe Threshold Reached', color: '#EF4444' };
  }

  getPayload() {
    return {
      count: this.count,
      maxCapacity: this.maxCapacity,
      percentage: this.getCapacityPercent(),
      status: this.getStatus(),
      zones: this.zones,
      timestamp: new Date().toISOString()
    };
  }

  increment(zone = 'free-weights') {
    this.count++;
    if (this.zones[zone] !== undefined) this.zones[zone]++;
    this.broadcast();
  }

  decrement(zone = 'free-weights') {
    if (this.count > 0) this.count--;
    if (this.zones[zone] && this.zones[zone] > 0) this.zones[zone]--;
    this.broadcast();
  }

  reset() {
    this.count = 0;
    Object.keys(this.zones).forEach(z => { this.zones[z] = 0; });
    this.broadcast();
  }

  broadcast() {
    const data = `data: ${JSON.stringify(this.getPayload())}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(data);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  addClient(res) {
    this.clients.add(res);
    res.write(`data: ${JSON.stringify(this.getPayload())}\n\n`);
  }

  removeClient(res) {
    this.clients.delete(res);
  }
}

export const globalOccupancy = new OccupancyTracker();

export function occupancyRoutes({ json }) {
  return {
    'GET /api/floor/occupancy': (req, res) => {
      json(res, 200, { ok: true, ...globalOccupancy.getPayload() });
    },
    'GET /api/floor/stream': (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      globalOccupancy.addClient(res);
      req.on('close', () => globalOccupancy.removeClient(res));
    }
  };
}

