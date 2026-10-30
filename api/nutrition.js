/* opengym-api — Durable Macro Nutrition & Daily Hydration Ledger */

let dailyLedger = {
  date: new Date().toISOString().slice(0, 10),
  calories: 2420,
  caloriesTarget: 2650,
  protein: 172,
  proteinTarget: 185,
  carbs: 260,
  carbsTarget: 300,
  fat: 65,
  fatTarget: 75,
  waterGlasses: 18,
  waterTarget: 24
};

export function nutritionRoutes({ json, readBody }) {
  return {
    'GET /api/nutrition/today': (req, res) => {
      json(res, 200, { ok: true, nutrition: dailyLedger });
    },
    'POST /api/nutrition/log': async (req, res) => {
      const body = await readBody(req);
      if (body) {
        dailyLedger = { ...dailyLedger, ...body, updatedAt: new Date().toISOString() };
      }
      json(res, 200, { ok: true, nutrition: dailyLedger });
    }
  };
}

